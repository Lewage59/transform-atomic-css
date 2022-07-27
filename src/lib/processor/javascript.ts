/* eslint-disable semi */
var _ = require('lodash')

export default class JSProcessor {
  private _content: any;
  constructor (content?: string) {
    this._content = content;
  }

  parseClasses (content = this._content) {
    if (!content) return [];
    let output: any = [];
    const regex = /'\s*\.(.*)\s*'/igm;
    let match;
    while ((match = regex.exec(content))) {
      if (match) {
        const raw = match[0].slice(1, -1);
        let value = raw.trim().split(' ');
        output = output.concat(value)
      }
    }
    return output
  }
}
