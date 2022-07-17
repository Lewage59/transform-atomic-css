/* eslint-disable semi */
import less from 'less'
import cssHandler from 'css'
import _ from 'lodash'

interface TraverseCallback {
  enter: () => void,
  leave: () => void
}

interface Node {
  type: string
}

const visitorKeys: Record<string, string> = {
  stylesheet: 'stylesheet.rules',
  rule: 'declarations'
}

const importStypeRegex: RegExp = /@import\s'.*?';?/g

export default class CssProcessor {
  private _content: string
  constructor (content) {
    this._content = content;
  }

  // CSS to AST
  async parse (content = this._content) {
    const styleRegex = /(?<=(<style.*>))(.|\n)*?(?=(<\/style>))/gim
    const styleMatch = styleRegex.exec(content)
    let styleContent = styleMatch && styleMatch[0]
    let cssContent = ''

    if (styleContent) {
      styleContent = styleContent.replace(importStypeRegex, '')
      cssContent = (await less.render(styleContent)).css
    }

    const cssAst = cssHandler.parse(cssContent)

    return cssAst
  }

  // 获取通过 import 引入的样式文件路径
  get importStype () {
    return this._content.match(importStypeRegex)
  }

  // traverse AST Tree
  traverse (node: Node, cb: TraverseCallback) {
    if (!node) return

    const context = {
      isBreak: false,
      isSkip: false,
      break () {
        this.isBreak = true
      },
      skip () {
        this.isSkip = true
      }
    }

    if (_.isFunction(cb)) {
      cb.call(context, node)
    } else if (_.isObject(cb)) {
      cb.enter && cb.enter.call(context, node)
    }

    if (context.isBreak) {
      return
    }

    const key = visitorKeys[node.type]
    const childs = _.get(node, key) || []

    for (let i = 0; i < childs.length; i++) {
      this.traverse(childs[i], cb)
    }

    if (_.isObject(cb)) {
      cb.leave && cb.leave.call(context, node)
    }
  }

  // CSS AST to String
  stringify (ast) {
    if (this.importStype) {
      return this.importStype.join('\n') + cssHandler.stringify(ast)
    }

    return cssHandler.stringify(ast)
  }
}
