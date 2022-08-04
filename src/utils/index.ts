import minimatch from 'minimatch'

/**
 * 判断是否表示为尺寸
 */
export function isSize (amount: any) {
  return /^-?(\d+(\.\d+)?)+(rem|em|px|rpx|vh|vw|ch|ex)$/.test(amount)
}

/**
 * 判断是否为小数
 */
export function isFloat (amount: any) {
  return /^-?\d+\.\d+$/.test(amount)
}

/**
 * 判断是否为数值类型
 */
export function isNumber (amount: string, start?: number, end?: number, type?: string) {
  start = -Infinity
  end = Infinity
  const isInt = /^-?\d+$/.test(amount)
  if (type === 'int') {
    if (!isInt) return false
  } else {
    if (!(isInt || isFloat(amount))) return false
  }
  const num = parseFloat(amount)
  return num >= start && num <= end
}

export function isNegative (val: string) {
  if (isNumber(val)) {
    return val[0] === '-'
  }
  return false
}

/**
 * 获取尺寸值
 */
export function getSizeValue (val: string) {
  if (isSize(val)) {
    return val.replace(/(rem|em|px|rpx|vh|vw|ch|ex)$/, '')
  }

  return val
}

/**
 * 判断是否为百分数
 */
export function isPercent (amount: string): boolean {
  return /\d+%$/g.test(amount)
}

/**
 * 路径匹配校验
 */
export function hasMatchPath (patterns: Array<string>, resourcePath?: string): boolean {
  if (!resourcePath) {
    return false
  }

  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i]
    if (minimatch(resourcePath, pattern)) {
      return true
    }
  }

  return false
}

/**
 * 绝对路径 to 相对路径
 */
export function absToRelPath (rootPath: string, currPath: string): string {
  return currPath.replace(rootPath + '/', '')
}
