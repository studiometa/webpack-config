/*! For license information please see app.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[1],[function(t,e){t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},function(t,e){t.exports=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}},function(t,e){function n(e){return t.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},n(e)}t.exports=n},function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}t.exports=function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}},function(t,e){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,n){var r=n(18),o=n(0);t.exports=function(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?o(t):e}},function(t,e,n){var r=n(17);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}},function(t,e,n){var r=n(14),o=n(15),i=n(11),u=n(16);t.exports=function(t){return r(t)||o(t)||i(t)||u()}},function(t,e,n){var r=n(19),o=n(20),i=n(11),u=n(21);t.exports=function(t,e){return r(t)||o(t,e)||i(t,e)||u()}},function(t,e,n){"use strict";var r=function(t){return function(t){return!!t&&"object"==typeof t}(t)&&!function(t){var e=Object.prototype.toString.call(t);return"[object RegExp]"===e||"[object Date]"===e||function(t){return t.$$typeof===o}(t)}(t)};var o="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function i(t,e){return!1!==e.clone&&e.isMergeableObject(t)?f((n=t,Array.isArray(n)?[]:{}),t,e):t;var n}function u(t,e,n){return t.concat(e).map((function(t){return i(t,n)}))}function c(t){return Object.keys(t).concat(function(t){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t).filter((function(e){return t.propertyIsEnumerable(e)})):[]}(t))}function s(t,e){try{return e in t}catch(t){return!1}}function a(t,e,n){var r={};return n.isMergeableObject(t)&&c(t).forEach((function(e){r[e]=i(t[e],n)})),c(e).forEach((function(o){(function(t,e){return s(t,e)&&!(Object.hasOwnProperty.call(t,e)&&Object.propertyIsEnumerable.call(t,e))})(t,o)||(s(t,o)&&n.isMergeableObject(e[o])?r[o]=function(t,e){if(!e.customMerge)return f;var n=e.customMerge(t);return"function"==typeof n?n:f}(o,n)(t[o],e[o],n):r[o]=i(e[o],n))})),r}function f(t,e,n){(n=n||{}).arrayMerge=n.arrayMerge||u,n.isMergeableObject=n.isMergeableObject||r,n.cloneUnlessOtherwiseSpecified=i;var o=Array.isArray(e);return o===Array.isArray(t)?o?n.arrayMerge(t,e,n):a(t,e,n):i(e,n)}f.all=function(t,e){if(!Array.isArray(t))throw new Error("first argument should be an array");return t.reduce((function(t,n){return f(t,n,e)}),{})};var l=f;t.exports=l},function(t,e){t.exports=function(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}},function(t,e,n){var r=n(10);t.exports=function(t,e){if(t){if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}}},function(t,e){for(var n="-_",r=36;r--;)n+=r.toString(36);for(r=36;r---10;)n+=r.toString(36).toUpperCase();t.exports=function(t){var e="";for(r=t||21;r--;)e+=n[64*Math.random()|0];return e}},,function(t,e,n){var r=n(10);t.exports=function(t){if(Array.isArray(t))return r(t)}},function(t,e){t.exports=function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(t,e){function n(e,r){return t.exports=n=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},n(e,r)}t.exports=n},function(t,e){function n(e){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?t.exports=n=function(t){return typeof t}:t.exports=n=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(e)}t.exports=n},function(t,e){t.exports=function(t){if(Array.isArray(t))return t}},function(t,e){t.exports=function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,o=!1,i=void 0;try{for(var u,c=t[Symbol.iterator]();!(r=(u=c.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}}},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(t,e,n){"use strict";n.r(e);var r=n(7),o=n.n(r),i=n(4),u=n.n(i),c=n(0),s=n.n(c),a=n(3),f=n.n(a),l=n(6),h=n.n(l),d=n(5),p=n.n(d),y=n(2),v=n.n(y),m=n(12),b=n.n(m),g=n(8),w=n.n(g);function O(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=Object.getPrototypeOf(t);return n===Object.prototype?e:O(n,Object.getOwnPropertyNames(n).map((function(t){return[t,n]})).reduce((function(t,e){return[].concat(o()(t),[e])}),e))}var k=n(1),_=n.n(k),x=function(){function t(){u()(this,t),_()(this,"_events",{})}return f()(t,[{key:"$on",value:function(t,e){var n=this;return Array.isArray(this._events[t])||(this._events[t]=[]),this._events[t].push(e),function(){n.$off(t,e)}}},{key:"$off",value:function(t,e){if(!t)return this._events={},this;if(!e)return this._events[t]=[],this;var n=this._events[t].indexOf(e);return n>-1&&this._events[t].splice(n,1),this}},{key:"$emit",value:function(t){for(var e=this,n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return Array.isArray(this._events[t])?(this._events[t].forEach((function(t){t.apply(e,r)})),this):this}},{key:"$once",value:function(t,e){var n=this;return this.$on(t,(function r(){n.$off(t,r);for(var o=arguments.length,i=new Array(o),u=0;u<o;u++)i[u]=arguments[u];e.apply(n,i)})),this}}]),t}();function E(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];return t.$options.debug?window.console.log.apply(window,[t.config.name].concat(n)):function(){}}function $(t,e){return"function"==typeof t[e]}function j(t,e){for(var n,r=arguments.length,o=new Array(r>2?r-2:0),i=2;i<r;i++)o[i-2]=arguments[i];return E.apply(void 0,[t,"callMethod",e].concat(o)),"destroyed"===e&&!t.$isMounted||"mounted"===e&&t.$isMounted?(E(t,"not",e,"because the method has already been triggered once."),t):(t.$emit.apply(t,[e].concat(o)),$(t,e)?((n=t[e]).call.apply(n,[t].concat(o)),E.apply(void 0,[t,e,t].concat(o)),t):t)}function A(t,e,n){var r=Object.entries(n).reduce((function(n,r){var o=w()(r,2),i=o[0],u=o[1],c='[data-component="'.concat(i,'"]'),s=Array.from(e.querySelectorAll(c));return 0===s.length&&(s=Array.from(e.querySelectorAll(i))),0===s.length||(n[i]=s.map((function(e){return function(t,e,n){if(t.__base__)return t.__base__;if(e.__isBase__){Object.defineProperty(e.prototype,"__isChild__",{value:!0});var r=new e(t);return Object.defineProperty(r,"$parent",{get:function(){return n}}),r}var o=e().then((function(e){var r=e.default?e.default:e;Object.defineProperty(r.prototype,"__isChild__",{value:!0});var o=new r(t);return Object.defineProperty(o,"$parent",{get:function(){return n}}),o}));return o.__isAsync__=!0,o}(e,u,t)})).filter((function(t){return"terminated"!==t})),0===n[i].length&&delete n[i]),n}),{});return t.$emit("get:children",r),r}var S=n(9),L=n.n(S);function R(t,e,n){var r={};if(e.dataset.options)try{r=JSON.parse(e.dataset.options)}catch(t){throw new Error("Can not parse the `data-options` attribute. Is it a valid JSON string?")}return r=L()(n,r),t.$emit("get:options",r),r}function P(t,e,n){var r={};if(e.dataset.options)try{r=JSON.parse(e.dataset.options)}catch(t){throw new Error("Can not parse the `data-options` attribute. Is it a valid JSON string?")}r=L()(r,n),e.dataset.options=JSON.stringify(r)}function D(t,e){var n=Array.from(e.querySelectorAll("[data-ref]")),r=Array.from(e.querySelectorAll(":scope [data-component] [data-ref]")),o=n.filter((function(t){return!r.includes(t)})).reduce((function(t,e){var n=e.dataset.ref,r=e.__base__?e.__base__:e;return n.endsWith("[]")&&(t[n=n.replace(/\[\]$/,"")]||(t[n]=[])),t[n]?Array.isArray(t[n])?t[n].push(r):t[n]=[t[n],r]:t[n]=r,t}),{});return t.$emit("get:refs",o),o}function C(t){t.__isAsync__?t.then((function(t){return t.$mount()})):t.$mount()}function T(t){t.$children&&(E(t,"mountComponents",t.$children),Object.values(t.$children).forEach((function(t){t.forEach(C)})))}function H(t){t.__isAsync__?t.then((function(t){return t.$destroy()})):t.$destroy()}var z=function(){function t(){u()(this,t),this.callbacks=new Map,this.isInit=!1}return f()(t,[{key:"init",value:function(){throw new Error("The `init` method must be implemented.")}},{key:"kill",value:function(){throw new Error("The `kill` method must be implemented.")}},{key:"add",value:function(t,e){if(this.has(t))throw new Error("A callback with the key `".concat(t,"` has already been registered."));return 0!==this.callbacks.size||this.isInit||(this.init(),this.isInit=!0),this.callbacks.set(t,e),this}},{key:"has",value:function(t){return this.callbacks.has(t)}},{key:"get",value:function(t){return this.callbacks.get(t)}},{key:"remove",value:function(t){return this.callbacks.delete(t),0===this.callbacks.size&&this.isInit&&(this.kill(),this.isInit=!1),this}},{key:"trigger",value:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return this.callbacks.forEach((function(t){t.apply(void 0,e)})),this}},{key:"props",get:function(){throw new Error("The `props` getter must be implemented.")}}]),t}();function M(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:16,n=0;return function(){var r=(new Date).getTime();return!(r-n<e)&&(n=r,t.apply(void 0,arguments))}}function I(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:300;return function(){for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];clearTimeout(e),e=setTimeout((function(){t.apply(void 0,o)}),n)}}var W=function(){return"undefined"!=typeof window&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout};function q(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=v()(t);if(e){var o=v()(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return p()(this,n)}}var U=function(t){h()(n,t);var e=q(n);function n(){var t;u()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),_()(s()(t),"isTicking",!1),t}return f()(n,[{key:"init",value:function(){var t=this,e=W();this.isTicking=!0,function n(){t.trigger(t.props),t.isTicking&&e(n)}()}},{key:"kill",value:function(){this.isTicking=!1}},{key:"props",get:function(){return{time:window.performance.now()}}}]),n}(z),N=null,J=function(){N||(N=new U);return{add:N.add.bind(N),remove:N.remove.bind(N),has:N.has.bind(N),props:function(){return N.props}}};function X(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=v()(t);if(e){var o=v()(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return p()(this,n)}}var Y=function(t){h()(n,t);var e=X(n);function n(){var t;u()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),_()(s()(t),"isDown",!1),_()(s()(t),"y",window.innerHeight/2),_()(s()(t),"yLast",window.innerHeight/2),_()(s()(t),"x",window.innerWidth/2),_()(s()(t),"xLast",window.innerWidth/2),t}return f()(n,[{key:"init",value:function(){var t=this,e=J(),n=e.add,r=e.remove;this.hasRaf=!1;var o=I((function(e){t.updateValues(e),r("usePointer"),t.trigger(t.props),t.hasRaf=!1}),50);this.handler=M((function(e){t.updateValues(e),t.hasRaf||(n("usePointer",(function(){t.trigger(t.props)})),t.hasRaf=!0),o(e)}),32).bind(this),this.downHandler=this.downHandler.bind(this),this.upHandler=this.upHandler.bind(this),document.documentElement.addEventListener("mouseenter",this.handler,{once:!0}),document.addEventListener("mousemove",this.handler,{passive:!0}),document.addEventListener("touchmove",this.handler,{passive:!0}),document.addEventListener("mousedown",this.downHandler,{passive:!0}),document.addEventListener("touchstart",this.downHandler,{passive:!0}),document.addEventListener("mouseup",this.upHandler,{passive:!0}),document.addEventListener("touchend",this.upHandler,{passive:!0})}},{key:"kill",value:function(){document.removeEventListener("mousemove",this.handler),document.removeEventListener("touchmove",this.handler),document.removeEventListener("mousedown",this.downHandler),document.removeEventListener("touchstart",this.downHandler),document.removeEventListener("mouseup",this.upHandler),document.removeEventListener("touchend",this.upHandler)}},{key:"downHandler",value:function(){this.isDown=!0,this.trigger(this.props)}},{key:"upHandler",value:function(){this.isDown=!1,this.trigger(this.props)}},{key:"updateValues",value:function(t){this.yLast=this.y,this.xLast=this.x,((t.touches||[])[0]||t||{}).clientY!==this.y&&(this.y=((t.touches||[])[0]||t||{}).clientY),((t.touches||[])[0]||t||{}).clientX!==this.x&&(this.x=((t.touches||[])[0]||t||{}).clientX)}},{key:"props",get:function(){return{isDown:this.isDown,x:this.x,y:this.y,changed:{x:this.x!==this.xLast,y:this.y!==this.yLast},last:{x:this.xLast,y:this.yLast},delta:{x:this.x-this.xLast,y:this.y-this.yLast},progress:{x:this.x/window.innerWidth,y:this.y/window.innerHeight},max:{x:window.innerWidth,y:window.innerHeight}}}}]),n}(z),B=null,V=function(){B||(B=new Y);return{add:B.add.bind(B),remove:B.remove.bind(B),has:B.has.bind(B),props:function(){return B.props}}};function F(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=v()(t);if(e){var o=v()(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return p()(this,n)}}var Z=function(t){h()(n,t);var e=F(n);function n(){return u()(this,n),e.apply(this,arguments)}return f()(n,[{key:"init",value:function(){var t=this;this.handler=I((function(){t.trigger(t.props)})).bind(this),this.canUseResizeObserver?(this.resizeObserver=new ResizeObserver(this.handler),this.resizeObserver.observe(document.documentElement)):window.addEventListener("resize",this.handler)}},{key:"kill",value:function(){this.canUseResizeObserver?this.resizeObserver.disconnect():window.removeEventListener("resize",this.handler),delete this.resizeObserver}},{key:"props",get:function(){var t={width:window.innerWidth,height:window.innerHeight,ratio:window.innerWidth/window.innerHeight,orientation:"square"};return t.ratio>1&&(t.orientation="landscape"),t.ratio<1&&(t.orientation="portrait"),this.breakpointElement&&(t.breakpoint=this.breakpoint,t.breakpoints=this.breakpoints),t}},{key:"breakpointElement",get:function(){return document.querySelector("[data-breakpoint]")||null}},{key:"breakpoint",get:function(){return window.getComputedStyle(this.breakpointElement,"::before").getPropertyValue("content").replace(/"/g,"")}},{key:"breakpoints",get:function(){return window.getComputedStyle(this.breakpointElement,"::after").getPropertyValue("content").replace(/"/g,"").split(",")}},{key:"canUseResizeObserver",get:function(){return void 0!==window.ResizeObserver}}]),n}(z),G=null,K=function(){G||(G=new Z);return{add:G.add.bind(G),remove:G.remove.bind(G),has:G.has.bind(G),props:function(){return G.props}}};function Q(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=v()(t);if(e){var o=v()(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return p()(this,n)}}var tt=function(t){h()(n,t);var e=Q(n);function n(){var t;u()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),_()(s()(t),"y",window.pageYOffset),_()(s()(t),"yLast",window.pageYOffset),_()(s()(t),"x",window.pageXOffset),_()(s()(t),"xLast",window.pageXOffset),t}return f()(n,[{key:"init",value:function(){var t=this,e=I((function(){t.trigger(t.props),function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},e=W();new Promise((function(n){e((function(){return e((function(){return n(t())}))}))}))}((function(){t.trigger(t.props)}))}),50);this.handler=M((function(){t.trigger(t.props),e()}),32).bind(this),document.addEventListener("scroll",this.handler,{passive:!0})}},{key:"kill",value:function(){document.removeEventListener("scroll",this.handler)}},{key:"props",get:function(){return this.yLast=this.y,this.xLast=this.x,window.pageYOffset!==this.y&&(this.y=window.pageYOffset),window.pageXOffset!==this.x&&(this.x=window.pageXOffset),{x:this.x,y:this.y,changed:{x:this.x!==this.xLast,y:this.y!==this.yLast},last:{x:this.xLast,y:this.yLast},delta:{x:this.x-this.xLast,y:this.y-this.yLast},progress:{x:0===this.max.x?1:this.x/this.max.x,y:0===this.max.y?1:this.y/this.max.y},max:this.max}}},{key:"max",get:function(){return{x:(document.scrollingElement||document.body).scrollWidth-window.innerWidth,y:(document.scrollingElement||document.body).scrollHeight-window.innerHeight}}}]),n}(z),et=null,nt=function(){et||(et=new tt);return{add:et.add.bind(et),remove:et.remove.bind(et),has:et.has.bind(et),props:function(){return et.props}}},rt={ENTER:13,SPACE:32,TAB:9,ESC:27,LEFT:37,UP:38,RIGHT:39,DOWN:40};function ot(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function it(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=v()(t);if(e){var o=v()(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return p()(this,n)}}var ut=function(t){h()(n,t);var e=it(n);function n(){var t;u()(this,n);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=e.call.apply(e,[this].concat(o)),_()(s()(t),"event",{}),_()(s()(t),"triggered",0),_()(s()(t),"previousEvent",{}),t}return f()(n,[{key:"init",value:function(){var t=this;this.handler=function(e){t.event=e,t.trigger(t.props)},document.addEventListener("keydown",this.handler,{passive:!1}),document.addEventListener("keyup",this.handler,{passive:!1})}},{key:"kill",value:function(){document.removeEventListener("keydown",this.handler),document.removeEventListener("keyup",this.handler)}},{key:"props",get:function(){var t=this,e=Object.entries(rt).reduce((function(e,n){var r=w()(n,2),o=r[0],i=r[1];return e[o]=i===t.event.keyCode,e}),{});return this.previousEvent.type||(this.triggered=0),"keydown"===this.event.type&&"keydown"===this.previousEvent.type?this.triggered+=1:this.triggered=1,this.previousEvent=this.event,function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?ot(Object(n),!0).forEach((function(e){_()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):ot(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({event:this.event,triggered:this.triggered,direction:"keydown"===this.event.type?"down":"up",isUp:"keyup"===this.event.type,isDown:"keydown"===this.event.type},e)}}]),n}(z),ct=null,st=function(){ct||(ct=new ut);return{add:ct.add.bind(ct),remove:ct.remove.bind(ct),has:ct.has.bind(ct),props:function(){return ct.props}}};function at(t,e,n){if(!$(t,e))return function(){};var r=n(),o=r.add,i=r.remove;return o(t.$id,(function(){for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];j.apply(void 0,[t,e].concat(r))})),function(){return i(t.$id)}}function ft(t){var e=[at(t,"scrolled",nt),at(t,"resized",K),at(t,"ticked",J),at(t,"moved",V),at(t,"keyed",st)];if($(t,"loaded")){var n=function(e){j(t,"loaded",{event:e})};window.addEventListener("load",n),e.push((function(){window.removeEventListener("load",n)}))}return e}function lt(t){var e=/^on[A-Z][a-z]+$/,n=/^on([A-Z][a-z]+)([A-Z][a-z]+)+$/,r=O(t).reduce((function(t,r){var o=w()(r,1)[0];return e.test(o)?(t.root.push(o),t):(n.test(o)&&t.refsOrChildren.push(o),t)}),{root:[],refsOrChildren:[]});return[].concat(o()(function(t,e){return e.map((function(e){var n=e.replace(/^on/,"").toLowerCase(),r=function(){for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];E.apply(void 0,[t,e,t.$el].concat(r)),t[e].apply(t,r)};return t.$el.addEventListener(n,r),function(){t.$el.removeEventListener(n,r)}}))}(t,r.root)),o()(function(t,e){var n=[];return Object.entries(t.$refs).forEach((function(r){var o=w()(r,2),i=o[0],u=o[1],c=Array.isArray(u)?u:[u],s="on".concat(i.replace(/^\w/,(function(t){return t.toUpperCase()})));e.filter((function(t){return t.startsWith(s)})).forEach((function(r){c.forEach((function(o,u){var c=r.replace(s,"").toLowerCase(),a=function(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];E.apply(void 0,[t,r,o].concat(n,[u])),t[r].apply(t,n.concat([u]))};E(t,"binding ref event",i,c),o.constructor&&o.constructor.__isBase__&&(o=o.$el),o.addEventListener(c,a),n.push((function(){E(t,"unbinding ref event",e),o.removeEventListener(c,a)}))}))}))})),n}(t,r.refsOrChildren)),o()(function(t,e){var n=[];return Object.entries(t.$children).forEach((function(r){var o=w()(r,2),i=o[0],u=o[1],c="on".concat(i.replace(/^\w/,(function(t){return t.toUpperCase()})));e.filter((function(t){return t.startsWith(c)})).forEach((function(e){u.forEach((function(r,o){var u=e.replace(c,"").toLowerCase();E(t,"binding child event",i,u);var s=r.$on(u,(function(){for(var n=arguments.length,i=new Array(n),u=0;u<n;u++)i[u]=arguments[u];E.apply(void 0,[t,e,r].concat(i,[o])),t[e].apply(t,i.concat([o]))}));n.push((function(){E(t,"unbinding child event",i,u),s()}))}))}))})),n}(t,r.refsOrChildren)))}function ht(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=v()(t);if(e){var o=v()(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return p()(this,n)}}var dt=function(t){h()(n,t);var e=ht(n);function n(t){var r;if(u()(this,n),!(r=e.call(this)).config)throw new Error("The `config` getter must be defined.");if(!r.config.name)throw new Error("The `config.name` property is required.");if(!t)throw new Error("The root element must be defined.");Object.defineProperties(s()(r),{$id:{value:"".concat(r.config.name,"-").concat(b()())},$isMounted:{value:!1,writable:!0},$el:{value:t}}),r.$el.__base__||Object.defineProperty(r.$el,"__base__",{get:function(){return s()(r)},configurable:!0}),function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.include,r=e.exclude,o=function(t){var e=function(e){return"string"==typeof e?t===e:e.test(t)};return n?n.some(e):!r||!r.some(e)};O(t).filter((function(t){var e=w()(t,1)[0];return"constructor"!==e&&o(e)})).forEach((function(e){var n=w()(e,2),r=n[0],o=n[1],i=Object.getOwnPropertyDescriptor(o,r);i&&"function"==typeof i.value&&(t[r]=t[r].bind(t))}))}(s()(r),{exclude:["$mount","$destroy","$log","$on","$once","$off","$emit","mounted","loaded","ticked","resized","moved","keyed","scrolled","destroyed"].concat(o()(r._excludeFromAutoBind||[]))});var i=[];return r.$on("mounted",(function(){T(s()(r)),i=[].concat(o()(ft(s()(r))),o()(lt(s()(r)))),r.$isMounted=!0})),r.$on("updated",(function(){i.forEach((function(t){return t()})),T(s()(r)),i=[].concat(o()(ft(s()(r))),o()(lt(s()(r))))})),r.$on("destroyed",(function(){var t;r.$isMounted=!1,i.forEach((function(t){return t()})),(t=s()(r)).$children&&(E(t,"destroyComponents",t.$children),Object.values(t.$children).forEach((function(t){t.forEach(H)})))})),r.__isChild__||(r.$mount(),Object.defineProperty(s()(r),"$parent",{get:function(){return null}})),E(s()(r),"constructor",s()(r)),p()(r,s()(r))}return f()(n,[{key:"$refs",get:function(){return D(this,this.$el)}},{key:"$children",get:function(){return A(this,this.$el,this.config.components||{})}},{key:"$options",get:function(){return R(this,this.$el,this.config)},set:function(t){P(0,this.$el,t)}}]),f()(n,[{key:"$log",value:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return this.$options.log?window.console.log.apply(window,[this.config.name].concat(e)):function(){}}},{key:"$mount",value:function(){return E(this,"$mount"),j(this,"mounted"),this}},{key:"$update",value:function(){return E(this,"$update"),j(this,"updated"),this}},{key:"$destroy",value:function(){return E(this,"$destroy"),j(this,"destroyed"),this}},{key:"$terminate",value:function(){E(this,"$terminate"),this.$destroy(),j(this,"terminated"),delete this.$el.__base__,Object.defineProperty(this.$el,"__base__",{value:"terminated",configurable:!1,writable:!1})}}]),n}(x);function pt(t){return(pt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function yt(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function vt(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function mt(t,e){return(mt=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function bt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=wt(t);if(e){var o=wt(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return gt(this,n)}}function gt(t,e){return!e||"object"!==pt(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function wt(t){return(wt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}dt.__isBase__=!0;var Ot=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&mt(t,e)}(i,t);var e,n,r,o=bt(i);function i(){return yt(this,i),o.apply(this,arguments)}return e=i,(n=[{key:"mounted",value:function(){this.content="mounted"}},{key:"resized",value:function(){this.content="resized"}},{key:"config",get:function(){return{name:"App"}}},{key:"content",set:function(t){this.$el.innerHTML+="<br>".concat(t)}}])&&vt(e.prototype,n),r&&vt(e,r),i}(dt);e.default=new Ot(document.querySelector("main"))}],[[22,2]]]);
//# sourceMappingURL=app.js.map