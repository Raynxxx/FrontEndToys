import * as core from './core';
import * as css from './css';
import * as attributes from './attributes';
import * as traversing from './traversing';
import * as manipulation from './manipulation';


// 一切的入口，一个自调用匿名函数
(function (window, undefined) {
  let w = window;
  let document = w.document;
  let rootWind;

  // 简写引用的库方法
  let coreSlice = Array.prototype.slice;
  let coreIndexOf = Array.prototype.indexOf;
  let coreTrim = String.prototype.trim;

  // 正则表达式
  const rId = /^#[\w\-]+$/;

  let wind = function (selector, context) {
    return new wind.prototype.init(selector, context);
  }

  wind.fn = wind.prototype = {
    constructor: wind,

    // 选择器入口
    init: function (selector, context) {
      // Handle $(""), $(null), $(undefined), $(false)
      if (!selector) return this;

      // handle $(DOMElement)
      if (selector.nodeType) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;
      }

      // handle HTML Strings
      if (typeof selector === 'string') {
        this.context = context || document;
        let _selector = selector.trim();
        this.selector = _selector;
        // handle $('#id')
        if (_selector.indexOf('#') === 0 && _selector.match(rId)) {
          this.context = document;
          _selector = _selector.substring(1);
          let elem = document.getElementById(_selector);
          this[0] = elem;
          this.length = 1;
        } else {
          // handle $('css selector')
          let elems = this.context.querySelectorAll(_selector);
          for (let i = 0; i < elems.length; ++i) {
            this[i] = elems[i];
          }
          this.length = elems.length;
        }
        return this;
      }

      // handle $($(..))
      if (selector.selector !== undefined) {
        this.selector = selector.selector;
        this.context = selector.context;
      }
      return this;
    },

    // 记录当前选择器, 默认空
    selector: '',

    // 对象的长度属性
    length: 0,

    // 元素数量
    size: function () {
      return this.length;
    },

    toArray: function () {
      return Array.prototype.slice.call(this);
    },

    find: function (selector) {
      if (!selector) return this;
      let context = this.selector;
      return wind(context + (context ? ' ' : '') + selector);
    },

    get: function (num) {
      return num == null ? this.toArray()
                        : (num < 0 ? this[this.length + num] : this[num]);
    },

    each: function (callback, args) {
      return wind.each(this, callback, args);
    },

    ready: function (fn) {
      
    },

    pushStack: function (elems, name, selector) {
      let ret = this.constructor();

      if (wind.isArray(elems)) {
        this.push.apply(ret, elems);
      } else {
        wind.merge(ret, elems);
      }

      ret.context = this.context;

      if (name) {
        ret.selector = `${this.selector}.${name}(${selector})`;
      }
      return ret;
    },

    eq: function (i) {
      i = +i;
      return i === -1 ? this.slice(i) : this.slice(i, i + 1);
    },

    first: function () {
      return this.eq(0);
    },

    last: function () {
      return this.eq(-1);
    },

    slice: function () {
      return this.pushStack(coreSlice.apply(this, arguments),
          'slice', coreSlice.call(arguments).join(','));
    },

    map: function () {
      return wind.map();
    },

    push: [].push,
    sort: [].sort,
    splice: [].splice
  }

  wind.fn.init.prototype = wind.fn;
  
  // extend
  wind.extend = wind.fn.extend = function () {
    let args = arguments[0] || {};
    for (let key in args) {
      this[key] = args[key];
    }
  }

  // wind static fn
  wind.extend({
    ready: function () {
      console.log('ready');
    },

    ajax: function () {
      console.log('ajax');
    }
  });

  wind.extend(core);
  wind.fn.extend(css);
  wind.fn.extend(attributes);
  wind.fn.extend(traversing);
  wind.fn.extend(manipulation);

  rootWind = wind(document);

  w.wind = w.$ = wind;
})(window);
