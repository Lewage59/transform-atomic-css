/**
 * style to windi CSS tool class loader
 */
import _ from 'lodash'
import CssProcessor from './processor/css'
import TemplateProcessor, { Node } from './processor/template'
import JSProcessor from './processor/javascript'
import SelectorHandler from './processor/selectorHandler'
import { staticUtilities, StaticUtilities } from './config/utilities'
// import mpxConditionalStrip from './plugins/mpx-conditional-strip'
// Load the core build.
import { isSize, isPercent, isFloat, isNegative, getSizeValue, hasMatchPath, absToRelPath } from '../utils'

export default async function (content, extraOptions) {
  // 读取 windicss 配置文件
  const customConfig = require('../windi.config.ts')

  // 处理分别是 windi loader 和 webpack loader
  const rootPath = extraOptions?.root || this.rootContext
  const currPath = extraOptions?.path || this.resourcePath
  const loaderOptions = {
    include: customConfig.extract?.include,
    exclude: customConfig.extract?.exclude
  }

  // 相对路径转换
  if (loaderOptions.include) {
    loaderOptions.include = loaderOptions.include.map((path) => {
      return absToRelPath(rootPath, path)
    })
  }
  if (loaderOptions.exclude) {
    loaderOptions.exclude = loaderOptions.exclude.map((path) => {
      return absToRelPath(rootPath, path)
    })
  }

  // loaderOptions对象属性
  if (loaderOptions) {
    const relativePath = absToRelPath(rootPath, currPath)
    const { include, exclude } = loaderOptions
    if (!(include && hasMatchPath(include, relativePath)) || (exclude && hasMatchPath(exclude, relativePath))) {
      return content
    }
  }

  // config
  const prefix = 'c-'

  const templateRegex = /<template.*>(.|\n)*<\/template>/gim
  const styleRegex = /<style.*>(.|\n)*<\/style>/gim
  // split template
  const templateContent = templateRegex.exec(content)

  // if not template will skip
  if (!templateContent) return content

  // template to AST
  const tempalteProcessor = new TemplateProcessor(templateContent[0])
  const htmlAst = tempalteProcessor.parse()

  // split script
  const scriptStartReg = /<script.*>/im
  const scriptEndReg = /<\/script>/im
  const startTag = content.match(scriptStartReg)
  const endTag = content.match(scriptEndReg)
  const startIndex = content.indexOf(startTag)
  const endIndex = content.indexOf(endTag)
  const scriptContent = content.slice(startIndex, endIndex + endTag[0].length)
  // parse Class
  const jsProcessor = new JSProcessor()
  const jsClasses = jsProcessor.parseClasses(scriptContent)

  // CSS to AST（default parse Less）
  const cssProcessor = new CssProcessor(content)
  const cssAst = await cssProcessor.parse()

  // 收集 Class Name 对应的 windi CSS 工具类
  const rulesMap = new Map()
  // 生成的 CSS Class 对象及工具类属性
  interface SingleClass {
    utilities: Record<string, string>,
    isUseAll: boolean
  }
  let singleClass: SingleClass = {
    utilities: {},
    isUseAll: false
  }
  // 是否忽略属性
  let isIgnore = false
  // 条件编译
  // const conditionalStrip = mpxConditionalStrip()
  // 遍历 CSS AST
  cssProcessor.traverse(cssAst, {
    enter (node) {
      // 注释
      // if (node.type === 'comment') {
      //   // mpx条件编译情况
      //   if (conditionalStrip(node.comment)) {
      //     isIgnore = true
      //   } else {
      //     isIgnore = false
      //   }
      // }
      // 样式规则 初始化单个样式规则对象 并记录当前样式规则位置
      if (node.type === 'rule' && !isIgnore) {
        // css是否转换
        node.isTransform = true
        // 判断是否为类选择器，是则进行转换，否则不转换
        const isTransform = node.selectors.every((selector) => {
          const selectorHandler = new SelectorHandler(selector)
          return !selectorHandler.isIntersectSelector && selectorHandler.isClassSelector
        })
        // 直接跳过该选择器
        if (!isTransform) {
          node.isTransform = false
          this.break()
          return
        }

        singleClass = {
          utilities: {},
          isUseAll: false
        }
      }
      // 样式属性 处理样式属性并保存
      if (node.type === 'declaration' && !isIgnore) {
        // 根据配置判断是否需要转换对应属性
        if (_.has(staticUtilities, node.property)) {
          // 连字符
          const separator = '-'
          // 默认工具类配置
          const utility = staticUtilities[node.property]
          // 属性值
          let nValue = node.value
          // 生成的工具类
          let value
          let pre = prefix

          // 判断属性值是否为指定 type 类型，如果不是则不做转换处理
          if (utility?.valueType && utility.valueType === 'Size' && !isSize(nValue)) {
            return
          }

          // 遍历处理组合数值情况
          nValue = nValue.split(' ')
          for (let i = 0; i < nValue.length; i++) {
            const val = nValue[i]
            const amount = getSizeValue(val)
            if (isSize(val)) {
              // 不对小数属性值进行转换
              if (isFloat(amount)) {
                return
              }
              nValue[i] = val.replace(/rpx/g, '')
            } else if (isPercent(amount)) {
              return
            }
          }
          nValue = nValue.join(' ')

          // 判断是否为负数，并转换绝对值
          if (isNegative(nValue)) {
            pre += '-'
            nValue = nValue.substring(1)
          }

          // 判断配置项是否为对象
          if (_.isObject(utility)) {
            value = utility.value ? utility.value[nValue] : nValue.replace(/\s/g, '_')
            pre += utility.property ? utility.property + separator : ''
          } else {
            value = nValue
            pre += utility + separator
          }

          // 存储到指定规则
          singleClass.utilities[node.property] = pre + value
        }
      }
    },
    leave (node) {
      // 只处理可转换的选择器
      if (node.type === 'rule' && node.isTransform) {
        const { selectors } = node

        // check selectors in js
        const isRemove = selectors.some((item) => {
          return jsClasses.indexOf(item as never) > -1
        })

        // remove declarations
        if (!isRemove) {
          node.declarations = node.declarations.filter((item) => {
            if (_.has(singleClass.utilities, item.property)) {
              return false
            }
            return true
          })
        }

        // 收集样式规则
        selectors.forEach((selector) => {
          // 判断是否存规则名
          if (rulesMap.has(selector)) {
            // 同一样式合并且覆盖重复设置样式
            const objectClass = rulesMap.get(selector)
            // 判断当前样式和重复样式是否全部转换为工具类
            objectClass.isUseAll = rulesMap.get(selector).isUseAll && !node.declarations.length
            Object.assign(objectClass.utilities, singleClass.utilities)
          } else {
            const cloneClass = _.cloneDeep(singleClass)
            // 判断当前样式是否全部转换为工具类
            cloneClass.isUseAll = !node.declarations.length
            rulesMap.set(selector, cloneClass)
          }
        })
      }
    }
  } as any)

  // 检测是否为变量
  function variableCheck (val) {
    const len = val.length
    for (let i = 0; i < 2; i++) {
      const start = val[i]
      const end = val[len - i - 1]
      if (start !== '{' && end !== '}') {
        return false
      }
    }
    return true
  }

  // 将字符串解析出来，并生成数组
  function parseString (str) {
    const length = str.length
    let currIndex = 0
    let char
    let inStr = false
    let singleStr: string = ''
    let strArray = []

    while (currIndex < length) {
      char = str.charAt(currIndex)
      if (/['|"]/.test(char)) {
        inStr && strArray.push(singleStr as never)
        inStr = !inStr
        singleStr = ''
      } else if (inStr) {
        singleStr += char
      }
      currIndex++
    }

    return strArray
  }

  function matchStyleUtilities (className, cb) {
    const buildSelector = '.' + className
    if (rulesMap.has(buildSelector)) {
      const { utilities = {}, isUseAll = false } = rulesMap.get(buildSelector)
      // eslint-disable-next-line standard/no-callback-literal
      cb && cb({ utilities, isUseAll })
      return Object.values(utilities).join(' ')
    }
    return ''
  }

  // 遍历 Template AST 并插入 windicss 工具类
  tempalteProcessor.traverse(htmlAst.children[0], function (node: any): void {
    if (_.has(node.attribs, 'class') && node.type === 'tag') {
      const classArr = node.attribs.class.split(' ')
      const customClass = []
      const toolStr = classArr.reduce((pre, currVal) => {
        let useStatus = false
        const utilities = matchStyleUtilities(currVal, function (rule) {
          // !! 暂时关闭移除 Dom 中 Classname 能力
          // useStatus = rule.isUseAll
        })
        if (variableCheck(currVal)) {
          parseString(currVal).forEach((val) => {
            if (val) {
              const tmpStr = currVal.split(val)
              let varStatus = false
              const utilities2 = matchStyleUtilities(val, function (rule) {
                // !! 暂时关闭移除 Dom 中 Classname 能力
                // varStatus = rule.isUseAll
              })
              currVal = `${tmpStr[0]}${varStatus ? '' : val + ' '}${utilities2}${tmpStr[1]}`
            }
          })
          return (pre + ' ' + currVal).trim()
        }
        pre += useStatus ? '' : ' ' + currVal
        return (pre + ' ' + utilities).trim()
      }, '')
      const space = customClass.length ? ' ' : ''
      node.attribs.class = customClass.join(' ') + space + toolStr
    }
  })

  // Template AST 转换成 Template 字符串
  const newHtml = tempalteProcessor.stringify(htmlAst)
  const newCss = cssProcessor.stringify(cssAst)
  // 更新 Template
  content = content.replace(templateRegex, newHtml)
  // !! 需要检索标签
  content = content.replace(styleRegex, `<style lang="less">${newCss}</style>`)

  return content
}
