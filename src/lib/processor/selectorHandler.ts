/**
 * CSS 选择器处理
 */

export default class SelectorHandler {
  _selector
  constructor (raw) {
    this._selector = raw
  }

  test (patt) {
    return patt.test(this._selector)
  }

  get isCommonSelector () {
    return this.test(/\*/)
  }

  get isIdSelector () {
    return !this.isIntersectSelector && this.test(/^#/)
  }

  get isClassSelector () {
    return !this.isIntersectSelector && this.test(/^\./)
  }

  get isAttrSelector () {
    return !this.isIntersectSelector && this.test(/\[.+\]/)
  }

  get isElementSelector () {
    return !this.isIntersectSelector && !this.test(/(^[.#])|(\*)|(\[(.+)\])/)
  }

  get isIntersectSelector () {
    return !this.isCombinator && !this.isPseudoSelector && this.test(/[\w-\]][#.]/)
  }

  get isPseudoSelector () {
    return this.test(/:/)
  }

  get isDescendantCombinator () {
    return this.test(/[\w-\]]\s[\w#-.]/)
  }

  get isChildCombinator () {
    return this.test(/>/)
  }

  get isGenSiblingCombinator () {
    return this.test(/~/)
  }

  get isAdjSiblingCombinator () {
    return this.test(/\+/)
  }

  get isColumnCombinator () {
    return this.test(/\|\|/)
  }

  get isSelector () {
    return this.isCommonSelector || this.isIdSelector || this.isClassSelector || this.isAttrSelector || this.isElementSelector
  }

  get isCombinator () {
    return this.isDescendantCombinator || this.isChildCombinator || this.isGenSiblingCombinator || this.isAdjSiblingCombinator || this.isColumnCombinator
  }
}
