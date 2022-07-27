/* eslint-disable semi */
import { parseDocument } from 'htmlparser2';
import stringifyHandler from 'dom-serializer';
import _ from 'lodash';

interface Document {
  children: any;
  type: string
}

interface OutputTemplateObject {
  result: string[] | string;
  classList: string[];
  start: number;
  end: number;
}

type NodeCallback = (node: Node) => void

interface TraverseCallback {
  enter: NodeCallback,
  leave: NodeCallback
}

type Attached = {
  class: string[] | string
}

export interface Node {
  type: string,
  attribs: Attached,
  children: []
}

export default class TemplateProcessor {
  private _content: string;
  private _ast: Document | undefined;
  constructor (content: string) {
    this._content = content;
    this._ast = undefined
  }

  // Template to AST
  parse (content = this._content) {
    this._ast = parseDocument(content, {
      decodeEntities: false,
      lowerCaseTags: false,
      lowerCaseAttributeNames: false,
      recognizeSelfClosing: true
    })
    return this._ast
  }

  // Template AST to String
  stringify (ast = this._ast) {
    return stringifyHandler(ast as any, {
      decodeEntities: false // 不进行转码
    })
  }

  // parse Template Class
  parseClasses (content = this._content) {
    if (!content) return [];
    const output: OutputTemplateObject[] = [];
    const regex = /class(Name)?\s*=\s*{`[^]+`}|class(Name)?\s*=\s*"[^"]+"|class(Name)?\s*=\s*'[^']+'|class(Name)?\s*=\s*[^>\s]+/igm;
    let match;
    while ((match = regex.exec(content))) {
      if (match) {
        const raw = match[0];
        const sep = raw.indexOf('=');
        let value = raw.slice(sep + 1).trim();
        let start = match.index + sep + 1 + (content.slice(sep + 1).match(/[^'"]/)?.index ?? 0);
        let end = regex.lastIndex;
        let first = value.charAt(0);
        while (['"', '\'', '`', '{'].includes(first)) {
          value = value.slice(1, -1);
          first = value.charAt(0);
          end--;
          start++;
        }
        output.push({
          result: value,
          classList: value.split(' ').filter(Boolean),
          start,
          end
        });
      }
    }

    return output
  }

  // traverse AST Tree
  traverse (node: Node, cb: NodeCallback | TraverseCallback) {
    if (!node) return

    if (_.isFunction(cb)) {
      cb(node)
    } else if (_.isObject(cb)) {
      cb.enter && cb.enter(node)
    }

    const childs = node.children || []

    for (let i = 0; i < childs.length; i++) {
      this.traverse(childs[i], cb)
    }

    if (!_.isFunction(cb)) {
      cb.leave && cb.leave(node)
    }
  }
}
