/*
 * windicss tool class Map
 * 属性说明:
 * property 工具类属性名
 * value 属性值映射
 * valueType 属性值类型（包括：Size，Variable，String。如不设置属性值 valueType，则默认支持所有类型转换成工具类）
*/
enum ValueType { Size = 'Size' }

interface Attribute {
  property?: string,
  value?: Record<string, string>,
  valueType?: ValueType
}

export type StaticUtilities = Record<string, Attribute>

export const staticUtilities: StaticUtilities = {
  // 尺寸
  'width': {
    property: 'w'
  },
  'max-width': {
    property: 'max-w'
  },
  'min-width': {
    property: 'min-w'
  },
  'height': {
    property: 'h'
  },
  'max-height': {
    property: 'max-h'
  },
  'min-height': {
    property: 'min-h'
  },
  'box-sizing': {
    property: 'box',
    value: {
      'border-box': 'border',
      'content-box': 'content'
    }
  },
  // 间隔
  'margin': {
    property: 'm'
  },
  'margin-top': {
    property: 'mt',
    valueType: ValueType.Size
  },
  'margin-bottom': {
    property: 'mb',
    valueType: ValueType.Size
  },
  'margin-left': {
    property: 'ml',
    valueType: ValueType.Size
  },
  'margin-right': {
    property: 'mr',
    valueType: ValueType.Size
  },
  'padding': {
    property: 'p',
    valueType: ValueType.Size
  },
  'padding-top': {
    property: 'pt',
    valueType: ValueType.Size
  },
  'padding-bottom': {
    property: 'pb',
    valueType: ValueType.Size
  },
  'padding-left': {
    property: 'pl',
    valueType: ValueType.Size
  },
  'padding-right': {
    property: 'pr',
    valueType: ValueType.Size
  },
  // 背景
  // 'background-color': {
  //   property: 'bg'
  // },
  'background-repeat': {
    property: 'bg',
    value: {
      'repeat': 'repeat',
      'no-repeat': 'no-repeat',
      'repeat-x': 'repeat-x',
      'repeat-y': 'repeat-y',
      'round': 'repeat-round',
      'space': 'repeat-space'
    }
  },
  'background-size': {
    property: 'bg',
    value: {
      'auto': 'auto',
      'cover': 'cover',
      'contain': 'contain'
    }
  },
  // 边框
  // 'border-radius': {
  //   property: 'rounded'
  // },
  'border-width': {
    property: 'border'
  },
  'border-style': {
    property: 'border'
  },
  // 字体及排版
  // 'color': {
  //   property: 'text'
  // },
  'font-size': {
    property: 'text'
  },
  'text-align': {
    property: 'text'
  },
  // 'font-family': {
  //   property: 'font'
  // },
  'font-weight': {
    property: 'font'
  },
  'letter-spacing': {
    property: 'tracking'
  },
  'line-height': {
    property: 'leading'
  },
  'vertical-align': {
    property: 'align'
  },
  'white-space': {
    property: 'whitespace'
  },
  // 布局
  'display': {
    value: {
      'block': 'block',
      'inline-block': 'inline-block',
      'inline': 'inline',
      'flow-root': 'flow-root',
      'contents': 'contents',
      'hidden': 'none',
      'list-item': 'list-item',
      'flex': 'flex',
      'inline-flex': 'inline-flex',
      'grid': 'grid',
      'inline-grid': 'inline-grid',
      'table': 'table',
      'inline-table': 'inline-table',
      'table-caption': 'table-caption',
      'table-cell': 'table-cell',
      'table-row': 'table-row',
      'table-column': 'table-column',
      'table-row-group': 'table-row-group',
      'table-column-group': 'table-column-group',
      'table-header-group': 'table-header-group',
      'table-footer-group': 'table-footer-group'
    }
  },
  'flex-direction': {
    property: 'flex',
    value: {
      'row': 'row',
      'row-reverse': 'row-reverse',
      'column': 'col',
      'column-reverse': 'col-reverse'
    }
  },
  'flex-wrap': {
    property: 'flex',
    value: {
      'wrap': 'wrap',
      'wrap-reverse': 'wrap-reverse',
      'nowrap': 'nowrap'
    }
  },
  'flex': {
    property: 'flex',
    value: {
      '1 1 0%': '1',
      '1': '1',
      '1 1 auto': 'auto',
      '0 1 auto': 'initial',
      'none': 'none'
    }
  },
  'flex-grow': {
    property: 'flex',
    value: {
      '0': 'grow-0',
      '1': 'grow'
    }
  },
  'flex-shrink': {
    property: 'flex',
    value: {
      '0': 'shrink-0',
      '1': 'shrink'
    }
  },
  'visibility': {
    value: {
      'visible': 'visible',
      'hidden': 'invisible'
    }
  },
  'justify-content': {
    property: 'justify',
    value: {
      'flex-start': 'start',
      'flex-end': 'end',
      'center': 'center',
      'space-between': 'between',
      'space-around': 'around',
      'space-evenly': 'evenly'
    }
  },
  'justify-self': {
    property: 'justify-self'
  },
  'align-content': {
    property: 'content',
    value: {
      'center': 'center',
      'flex-start': 'start',
      'flex-end': 'end',
      'space-between': 'between',
      'space-around': 'around',
      'space-evenly': 'evenly'
    }
  },
  'align-items': {
    property: 'items',
    value: {
      'center': 'center',
      'flex-start': 'start',
      'flex-end': 'end',
      'baseline': 'baseline',
      'stretch': 'stretch'
    }
  },
  'align-self': {
    property: 'self',
    value: {
      'flex-start': 'start',
      'flex-end': 'end',
      'center': 'center',
      'auto': 'auto',
      'stretch': 'stretch'
    }
  },
  // 定位
  'position': {
    value: {
      'static': 'static',
      'fixed': 'fixed',
      'absolute': 'absolute',
      'relative': 'relative',
      'sticky': 'sticky'
    }
  },
  'top': {
    property: 'top'
  },
  'right': {
    property: 'right'
  },
  'bottom': {
    property: 'bottom'
  },
  'left': {
    property: 'left'
  },
  'z-index': {
    property: 'z'
  }
}


