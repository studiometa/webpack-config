/*! For license information please see app.js.LICENSE.txt */
(self.webpackChunk=self.webpackChunk||[]).push([[804],{645:t=>{const n=[{root:!0,test:["foo","bar","baz"],log:!0}];t.exports=n.length<=1?n[0]:n},745:(t,n,e)=>{"use strict";var r=e(144),o=e(404);const c={data:function(){return{count:0}}};var u=e(994),i=e.n(u),s=e(305),a={insert:"head",singleton:!1};i()(s.Z,a);s.Z.locals;const f=(0,e(900).Z)(c,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"counter"},[e("button",{staticClass:"counter__btn",on:{click:function(n){t.count+=1}}},[t._v("\n    Up\n  ")]),t._v(" "),e("button",{staticClass:"counter__btn",on:{click:function(n){t.count-=1}}},[t._v("\n    Down\n  ")]),t._v(" "),e("input",{staticClass:"counter__input",attrs:{readonly:""},domProps:{value:t.count}})])}),[],!1,null,null,null).exports;var l=e(645),p=e.n(l);function b(t){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function y(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),e.push.apply(e,r)}return e}function h(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{};n%2?y(Object(e),!0).forEach((function(n){d(t,n,e[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):y(Object(e)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}))}return t}function d(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}function v(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function m(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function g(t,n){return(g=Object.setPrototypeOf||function(t,n){return t.__proto__=n,t})(t,n)}function A(t){var n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var e,r=w(t);if(n){var o=w(this).constructor;e=Reflect.construct(r,arguments,o)}else e=r.apply(this,arguments);return O(this,e)}}function O(t,n){return!n||"object"!==b(n)&&"function"!=typeof n?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):n}function w(t){return(w=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}new(function(t){!function(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),n&&g(t,n)}(i,t);var n,o,c,u=A(i);function i(){return v(this,i),u.apply(this,arguments)}return n=i,(o=[{key:"mounted",value:function(){this.$log("config",p(),this.$options),this.content="mounted",this.vue=new r.Z({components:{VueCounter:f},render:function(t){return t("VueCounter")}}),this.vue.$mount(this.$refs.vue)}},{key:"resized",value:function(){this.content="resized"}},{key:"config",get:function(){return h(h({name:"App",log:!0},p()),{},{components:{Component:function(){return e.e(823).then(e.bind(e,823))}}})}},{key:"content",set:function(t){this.$refs.content.innerHTML+="<br>".concat(t)}}])&&m(n.prototype,o),c&&m(n,c),i}(o.ZP))(document.querySelector("main"))},305:(t,n,e)=>{"use strict";e.d(n,{Z:()=>i});var r=e(507),o=e.n(r),c=e(476),u=e.n(c)()(o());u.push([t.id,".counter{padding:2rem;color:#000;background:#eee;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,.1)}","",{version:3,sources:["webpack://./Counter.vue"],names:[],mappings:"AAmBA,SACE,YAAA,CACA,UAAA,CACA,eAAA,CACA,iBAAA,CACA,kCAAA",sourcesContent:["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.counter {\n  padding: 2rem;\n  color: black;\n  background: #eee;\n  border-radius: 5px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n}\n"],sourceRoot:""}]);const i=u}},0,[[745,700,216]]]);
//# sourceMappingURL=app.js.map