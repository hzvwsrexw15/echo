var V={exports:{}};(function(h){var b=function(u){var s=Object.prototype,c=s.hasOwnProperty,i=Object.defineProperty||function(r,t,e){r[t]=e.value},f,m=typeof Symbol=="function"?Symbol:{},v=m.iterator||"@@iterator",L=m.asyncIterator||"@@asyncIterator",S=m.toStringTag||"@@toStringTag";function y(r,t,e){return Object.defineProperty(r,t,{value:e,enumerable:!0,configurable:!0,writable:!0}),r[t]}try{y({},"")}catch{y=function(t,e,o){return t[e]=o}}function I(r,t,e,o){var n=t&&t.prototype instanceof $?t:$,a=Object.create(n.prototype),l=new D(o||[]);return i(a,"_invoke",{value:K(r,e,l)}),a}u.wrap=I;function J(r,t,e){try{return{type:"normal",arg:r.call(t,e)}}catch(o){return{type:"throw",arg:o}}}var q="suspendedStart",H="suspendedYield",B="executing",N="completed",w={};function $(){}function _(){}function O(){}var A={};y(A,v,function(){return this});var C=Object.getPrototypeOf,k=C&&C(C(U([])));k&&k!==s&&c.call(k,v)&&(A=k);var T=O.prototype=$.prototype=Object.create(A);_.prototype=O,i(T,"constructor",{value:O,configurable:!0}),i(O,"constructor",{value:_,configurable:!0}),_.displayName=y(O,S,"GeneratorFunction");function W(r){["next","throw","return"].forEach(function(t){y(r,t,function(e){return this._invoke(t,e)})})}u.isGeneratorFunction=function(r){var t=typeof r=="function"&&r.constructor;return t?t===_||(t.displayName||t.name)==="GeneratorFunction":!1},u.mark=function(r){return Object.setPrototypeOf?Object.setPrototypeOf(r,O):(r.__proto__=O,y(r,S,"GeneratorFunction")),r.prototype=Object.create(T),r},u.awrap=function(r){return{__await:r}};function j(r,t){function e(a,l,p,g){var d=J(r[a],r,l);if(d.type==="throw")g(d.arg);else{var Y=d.arg,G=Y.value;return G&&typeof G=="object"&&c.call(G,"__await")?t.resolve(G.__await).then(function(E){e("next",E,p,g)},function(E){e("throw",E,p,g)}):t.resolve(G).then(function(E){Y.value=E,p(Y)},function(E){return e("throw",E,p,g)})}}var o;function n(a,l){function p(){return new t(function(g,d){e(a,l,g,d)})}return o=o?o.then(p,p):p()}i(this,"_invoke",{value:n})}W(j.prototype),y(j.prototype,L,function(){return this}),u.AsyncIterator=j,u.async=function(r,t,e,o,n){n===void 0&&(n=Promise);var a=new j(I(r,t,e,o),n);return u.isGeneratorFunction(t)?a:a.next().then(function(l){return l.done?l.value:a.next()})};function K(r,t,e){var o=q;return function(a,l){if(o===B)throw new Error("Generator is already running");if(o===N){if(a==="throw")throw l;return x()}for(e.method=a,e.arg=l;;){var p=e.delegate;if(p){var g=z(p,e);if(g){if(g===w)continue;return g}}if(e.method==="next")e.sent=e._sent=e.arg;else if(e.method==="throw"){if(o===q)throw o=N,e.arg;e.dispatchException(e.arg)}else e.method==="return"&&e.abrupt("return",e.arg);o=B;var d=J(r,t,e);if(d.type==="normal"){if(o=e.done?N:H,d.arg===w)continue;return{value:d.arg,done:e.done}}else d.type==="throw"&&(o=N,e.method="throw",e.arg=d.arg)}}}function z(r,t){var e=t.method,o=r.iterator[e];if(o===f)return t.delegate=null,e==="throw"&&r.iterator.return&&(t.method="return",t.arg=f,z(r,t),t.method==="throw")||e!=="return"&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+e+"' method")),w;var n=J(o,r.iterator,t.arg);if(n.type==="throw")return t.method="throw",t.arg=n.arg,t.delegate=null,w;var a=n.arg;if(!a)return t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,w;if(a.done)t[r.resultName]=a.value,t.next=r.nextLoc,t.method!=="return"&&(t.method="next",t.arg=f);else return a;return t.delegate=null,w}W(T),y(T,S,"Generator"),y(T,v,function(){return this}),y(T,"toString",function(){return"[object Generator]"});function Q(r){var t={tryLoc:r[0]};1 in r&&(t.catchLoc=r[1]),2 in r&&(t.finallyLoc=r[2],t.afterLoc=r[3]),this.tryEntries.push(t)}function M(r){var t=r.completion||{};t.type="normal",delete t.arg,r.completion=t}function D(r){this.tryEntries=[{tryLoc:"root"}],r.forEach(Q,this),this.reset(!0)}u.keys=function(r){var t=Object(r),e=[];for(var o in t)e.push(o);return e.reverse(),function n(){for(;e.length;){var a=e.pop();if(a in t)return n.value=a,n.done=!1,n}return n.done=!0,n}};function U(r){if(r){var t=r[v];if(t)return t.call(r);if(typeof r.next=="function")return r;if(!isNaN(r.length)){var e=-1,o=function n(){for(;++e<r.length;)if(c.call(r,e))return n.value=r[e],n.done=!1,n;return n.value=f,n.done=!0,n};return o.next=o}}return{next:x}}u.values=U;function x(){return{value:f,done:!0}}return D.prototype={constructor:D,reset:function(r){if(this.prev=0,this.next=0,this.sent=this._sent=f,this.done=!1,this.delegate=null,this.method="next",this.arg=f,this.tryEntries.forEach(M),!r)for(var t in this)t.charAt(0)==="t"&&c.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=f)},stop:function(){this.done=!0;var r=this.tryEntries[0],t=r.completion;if(t.type==="throw")throw t.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var t=this;function e(g,d){return a.type="throw",a.arg=r,t.next=g,d&&(t.method="next",t.arg=f),!!d}for(var o=this.tryEntries.length-1;o>=0;--o){var n=this.tryEntries[o],a=n.completion;if(n.tryLoc==="root")return e("end");if(n.tryLoc<=this.prev){var l=c.call(n,"catchLoc"),p=c.call(n,"finallyLoc");if(l&&p){if(this.prev<n.catchLoc)return e(n.catchLoc,!0);if(this.prev<n.finallyLoc)return e(n.finallyLoc)}else if(l){if(this.prev<n.catchLoc)return e(n.catchLoc,!0)}else if(p){if(this.prev<n.finallyLoc)return e(n.finallyLoc)}else throw new Error("try statement without catch or finally")}}},abrupt:function(r,t){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&c.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var n=o;break}}n&&(r==="break"||r==="continue")&&n.tryLoc<=t&&t<=n.finallyLoc&&(n=null);var a=n?n.completion:{};return a.type=r,a.arg=t,n?(this.method="next",this.next=n.finallyLoc,w):this.complete(a)},complete:function(r,t){if(r.type==="throw")throw r.arg;return r.type==="break"||r.type==="continue"?this.next=r.arg:r.type==="return"?(this.rval=this.arg=r.arg,this.method="return",this.next="end"):r.type==="normal"&&t&&(this.next=t),w},finish:function(r){for(var t=this.tryEntries.length-1;t>=0;--t){var e=this.tryEntries[t];if(e.finallyLoc===r)return this.complete(e.completion,e.afterLoc),M(e),w}},catch:function(r){for(var t=this.tryEntries.length-1;t>=0;--t){var e=this.tryEntries[t];if(e.tryLoc===r){var o=e.completion;if(o.type==="throw"){var n=o.arg;M(e)}return n}}throw new Error("illegal catch attempt")},delegateYield:function(r,t,e){return this.delegate={iterator:U(r),resultName:t,nextLoc:e},this.method==="next"&&(this.arg=f),w}},u}(h.exports);try{regeneratorRuntime=b}catch{typeof globalThis=="object"?globalThis.regeneratorRuntime=b:Function("r","regeneratorRuntime = r")(b)}})(V);const P="https://api.yunzhu.info";function F(h,b){return fetch(`${P}${h}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b),mode:"cors"})}function X(){return fetch(`${P}/user/currentUser`,{method:"GET",mode:"cors"})}function Z(h){return fetch(`${P}/user/loginByPwd`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(h),mode:"cors"})}async function*R(h,b){const u=new TextDecoder("utf-8");let c=(await fetch(`${P}${h}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b),mode:"cors"})).body.getReader(),{value:i,done:f}=await c.read();i=i?u.decode(i,{stream:!0}):"";let m=/\r\n|\n|\r/gm,v=0;for(;;){let L=m.exec(i);if(!L){if(f)break;let S=i.substr(v);({value:i,done:f}=await c.read()),i=S+(i?u.decode(i,{stream:!0}):""),v=m.lastIndex=0;continue}yield i.substring(v,L.index),v=m.lastIndex}v<i.length&&(yield i.substr(v))}chrome.runtime.onMessage.addListener((h,b,u)=>{if(h.type==="user-login"){const{params:s}=h;Z({...s}).then(async c=>{const i=await c.text(),f=JSON.parse(i);u(f)}).catch(c=>{u(c)})}if(h.type==="user-logout"&&F("/user/logout",{}).then(async s=>{const c=await s.text(),i=JSON.parse(c);u(i)}).catch(s=>{u(s)}),h.type==="get-user-data"&&X().then(async s=>{try{const c=await s.text(),i=JSON.parse(c);u(i)}catch(c){u(c)}}),h.type==="post-data"){const{url:s,params:c}=h;F(s,{...c}).then(async i=>{const f=await i.text(),m=JSON.parse(f);u(m)}).catch(i=>{u(i)})}if(h.type==="goto-page"){const{url:s}=h;chrome.tabs.create({url:s})}if(h.type==="get-sse"){const{url:s,params:c,from:i}=h;async function f(){const m=R(s,c);for await(let v of m)try{const L=v.replace("data: ",""),S=JSON.parse(L);chrome.tabs.query({active:!0,currentWindow:!0},function(y){y.length!==0&&chrome.tabs.sendMessage(y[0].id,{from:i,finish_reason:S.choices[0].finish_reason,text:S.choices[0].delta.content},function(I){})})}catch{}u(!0)}f()}return!0});
