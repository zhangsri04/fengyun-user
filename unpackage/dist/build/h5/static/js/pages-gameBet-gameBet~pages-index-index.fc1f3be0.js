(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-gameBet-gameBet~pages-index-index"],{"3cdc":function(t,n,e){var o=e("24fb");n=o(!1),n.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.uni-countdown[data-v-64534147]{display:flex;flex-direction:row;justify-content:flex-start;align-items:center}.uni-countdown__splitor[data-v-64534147]{margin:0 2px;font-size:14px;color:#333}.uni-countdown__number[data-v-64534147]{border-radius:3px;text-align:center;font-size:14px}',""]),t.exports=n},"3fb5":function(t,n,e){"use strict";e.d(n,"b",(function(){return o})),e.d(n,"c",(function(){return i})),e.d(n,"a",(function(){}));var o=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-uni-view",{staticClass:"uni-countdown"},[t.showDay?e("v-uni-text",{staticClass:"uni-countdown__number",style:[t.timeStyle]},[t._v(t._s(t.d))]):t._e(),t.showDay?e("v-uni-text",{staticClass:"uni-countdown__splitor",style:[t.splitorStyle]},[t._v(t._s(t.dayText))]):t._e(),t.showHour?e("v-uni-text",{staticClass:"uni-countdown__number",style:[t.timeStyle]},[t._v(t._s(t.h))]):t._e(),t.showHour?e("v-uni-text",{staticClass:"uni-countdown__splitor",style:[t.splitorStyle]},[t._v(t._s(t.showColon?":":t.hourText))]):t._e(),e("v-uni-text",{staticClass:"uni-countdown__number",style:[t.timeStyle]},[t._v(t._s(t.i))]),e("v-uni-text",{staticClass:"uni-countdown__splitor",style:[t.splitorStyle]},[t._v(t._s(t.showColon?":":t.minuteText))]),e("v-uni-text",{staticClass:"uni-countdown__number",style:[t.timeStyle]},[t._v(t._s(t.s))]),t.showColon?t._e():e("v-uni-text",{staticClass:"uni-countdown__splitor",style:[t.splitorStyle]},[t._v(t._s(t.secondText))])],1)},i=[]},"4ec9":function(t,n,e){e("6f48")},"4fad":function(t,n,e){var o=e("d039"),i=e("861d"),r=e("c6b6"),s=e("d86b"),u=Object.isExtensible,a=o((function(){u(1)}));t.exports=a||s?function(t){return!!i(t)&&((!s||"ArrayBuffer"!=r(t))&&(!u||u(t)))}:u},6566:function(t,n,e){"use strict";var o=e("9bf2").f,i=e("7c73"),r=e("6964"),s=e("0366"),u=e("19aa"),a=e("7234"),c=e("2266"),f=e("c6d2"),d=e("4754"),l=e("2626"),h=e("83ab"),p=e("f183").fastKey,v=e("69f3"),b=v.set,g=v.getterFor;t.exports={getConstructor:function(t,n,e,f){var d=t((function(t,o){u(t,l),b(t,{type:n,index:i(null),first:void 0,last:void 0,size:0}),h||(t.size=0),a(o)||c(o,t[f],{that:t,AS_ENTRIES:e})})),l=d.prototype,v=g(n),m=function(t,n,e){var o,i,r=v(t),s=y(t,n);return s?s.value=e:(r.last=s={index:i=p(n,!0),key:n,value:e,previous:o=r.last,next:void 0,removed:!1},r.first||(r.first=s),o&&(o.next=s),h?r.size++:t.size++,"F"!==i&&(r.index[i]=s)),t},y=function(t,n){var e,o=v(t),i=p(n);if("F"!==i)return o.index[i];for(e=o.first;e;e=e.next)if(e.key==n)return e};return r(l,{clear:function(){var t=v(this),n=t.index,e=t.first;while(e)e.removed=!0,e.previous&&(e.previous=e.previous.next=void 0),delete n[e.index],e=e.next;t.first=t.last=void 0,h?t.size=0:this.size=0},delete:function(t){var n=v(this),e=y(this,t);if(e){var o=e.next,i=e.previous;delete n.index[e.index],e.removed=!0,i&&(i.next=o),o&&(o.previous=i),n.first==e&&(n.first=o),n.last==e&&(n.last=i),h?n.size--:this.size--}return!!e},forEach:function(t){var n,e=v(this),o=s(t,arguments.length>1?arguments[1]:void 0);while(n=n?n.next:e.first){o(n.value,n.key,this);while(n&&n.removed)n=n.previous}},has:function(t){return!!y(this,t)}}),r(l,e?{get:function(t){var n=y(this,t);return n&&n.value},set:function(t,n){return m(this,0===t?0:t,n)}}:{add:function(t){return m(this,t=0===t?0:t,t)}}),h&&o(l,"size",{get:function(){return v(this).size}}),d},setStrong:function(t,n,e){var o=n+" Iterator",i=g(n),r=g(o);f(t,n,(function(t,n){b(this,{type:o,target:t,state:i(t),kind:n,last:void 0})}),(function(){var t=r(this),n=t.kind,e=t.last;while(e&&e.removed)e=e.previous;return t.target&&(t.last=e=e?e.next:t.state.first)?d("keys"==n?e.key:"values"==n?e.value:[e.key,e.value],!1):(t.target=void 0,d(void 0,!0))}),e?"entries":"values",!e,!0),l(n)}}},"6d61":function(t,n,e){"use strict";var o=e("23e7"),i=e("da84"),r=e("e330"),s=e("94ca"),u=e("cb2d"),a=e("f183"),c=e("2266"),f=e("19aa"),d=e("1626"),l=e("7234"),h=e("861d"),p=e("d039"),v=e("1c7e"),b=e("d44e"),g=e("7156");t.exports=function(t,n,e){var m=-1!==t.indexOf("Map"),y=-1!==t.indexOf("Weak"),w=m?"set":"add",S=i[t],x=S&&S.prototype,_=S,k={},C=function(t){var n=r(x[t]);u(x,t,"add"==t?function(t){return n(this,0===t?0:t),this}:"delete"==t?function(t){return!(y&&!h(t))&&n(this,0===t?0:t)}:"get"==t?function(t){return y&&!h(t)?void 0:n(this,0===t?0:t)}:"has"==t?function(t){return!(y&&!h(t))&&n(this,0===t?0:t)}:function(t,e){return n(this,0===t?0:t,e),this})},O=s(t,!d(S)||!(y||x.forEach&&!p((function(){(new S).entries().next()}))));if(O)_=e.getConstructor(n,t,m,w),a.enable();else if(s(t,!0)){var E=new _,I=E[w](y?{}:-0,1)!=E,N=p((function(){E.has(1)})),F=v((function(t){new S(t)})),z=!y&&p((function(){var t=new S,n=5;while(n--)t[w](n,n);return!t.has(-0)}));F||(_=n((function(t,n){f(t,x);var e=g(new S,t,_);return l(n)||c(n,e[w],{that:e,AS_ENTRIES:m}),e})),_.prototype=x,x.constructor=_),(N||z)&&(C("delete"),C("has"),m&&C("get")),(z||I)&&C(w),y&&x.clear&&delete x.clear}return k[t]=_,o({global:!0,constructor:!0,forced:_!=S},k),b(_,t),y||e.setStrong(_,t,m),_}},"6ee8":function(t){t.exports=JSON.parse('{"uni-countdown.day":"day","uni-countdown.h":"h","uni-countdown.m":"m","uni-countdown.s":"s"}')},"6f48":function(t,n,e){"use strict";var o=e("6d61"),i=e("6566");o("Map",(function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}}),i)},"7a19":function(t,n,e){"use strict";var o=e("b69e"),i=e.n(o);i.a},9518:function(t){t.exports=JSON.parse('{"uni-countdown.day":"天","uni-countdown.h":"時","uni-countdown.m":"分","uni-countdown.s":"秒"}')},"990a":function(t){t.exports=JSON.parse('{"uni-countdown.day":"天","uni-countdown.h":"时","uni-countdown.m":"分","uni-countdown.s":"秒"}')},a022:function(t,n,e){e("fb6a"),e("d401"),e("d3b7"),e("25f0"),e("14d9"),e("ac1f"),e("466d"),e("841c"),e("4d63"),e("c607"),e("2c3e"),e("1276"),e("5319"),e("26e9"),e("c975"),e("e25e"),e("c19f"),e("ace4"),e("5cc6"),e("907a"),e("9a8c"),e("a975"),e("735e"),e("c1ac"),e("d139"),e("3a7b"),e("986a"),e("1d02"),e("d5d6"),e("82f8"),e("e91f"),e("60bd"),e("5f96"),e("3280"),e("3fcc"),e("ca91"),e("25a1"),e("cd26"),e("3c5d"),e("2954"),e("649e"),e("219c"),e("b39a"),e("72f7"),function(){var t,e,o,i,r={}.hasOwnProperty,s=[].slice;t={LF:"\n",NULL:"\0"},o=function(){var n;function e(t,n,e){this.command=t,this.headers=null!=n?n:{},this.body=null!=e?e:""}return e.prototype.toString=function(){var n,o,i,s,u;for(o in n=[this.command],i=!1===this.headers["content-length"],i&&delete this.headers["content-length"],u=this.headers,u)r.call(u,o)&&(s=u[o],n.push(o+":"+s));return this.body&&!i&&n.push("content-length:"+e.sizeOfUTF8(this.body)),n.push(t.LF+this.body),n.join(t.LF)},e.sizeOfUTF8=function(t){return t?encodeURI(t).match(/%..|./g).length:0},n=function(n){var o,i,r,s,u,a,c,f,d,l,h,p,v,b,g,m,y;for(s=n.search(RegExp(""+t.LF+t.LF)),u=n.substring(0,s).split(t.LF),r=u.shift(),a={},p=function(t){return t.replace(/^\s+|\s+$/g,"")},m=u.reverse(),v=0,g=m.length;v<g;v++)l=m[v],f=l.indexOf(":"),a[p(l.substring(0,f))]=p(l.substring(f+1));if(o="",h=s+2,a["content-length"])d=parseInt(a["content-length"]),o=(""+n).substring(h,h+d);else for(i=null,c=b=h,y=n.length;h<=y?b<y:b>y;c=h<=y?++b:--b){if(i=n.charAt(c),i===t.NULL)break;o+=i}return new e(r,a,o)},e.unmarshall=function(e){var o,i,r,s;return i=e.split(RegExp(""+t.NULL+t.LF+"*")),s={frames:[],partial:""},s.frames=function(){var t,e,r,s;for(r=i.slice(0,-1),s=[],t=0,e=r.length;t<e;t++)o=r[t],s.push(n(o));return s}(),r=i.slice(-1)[0],r===t.LF||-1!==r.search(RegExp(""+t.NULL+t.LF+"*$"))?s.frames.push(n(r)):s.partial=r,s},e.marshall=function(n,o,i){var r;return r=new e(n,o,i),r.toString()+t.NULL},e}(),e=function(){var n;function e(t){this.ws=t,this.ws.binaryType="arraybuffer",this.counter=0,this.connected=!1,this.heartbeat={outgoing:1e4,incoming:1e4},this.maxWebSocketFrameSize=16384,this.subscriptions={},this.partialData=""}return e.prototype.debug=function(t){var n;return"undefined"!==typeof window&&null!==window&&null!=(n=window.console)?n.log(t):void 0},n=function(){return Date.now?Date.now():(new Date).valueOf},e.prototype._transmit=function(t,n,e){var i;i=o.marshall(t,n,e),"function"===typeof this.debug&&this.debug(">>> "+i);while(1){if(!(i.length>this.maxWebSocketFrameSize))return this.ws.send(i);this.ws.send(i.substring(0,this.maxWebSocketFrameSize)),i=i.substring(this.maxWebSocketFrameSize),"function"===typeof this.debug&&this.debug("remaining = "+i.length)}},e.prototype._setupHeartbeat=function(e){var o,r,s,u,a,c;if((a=e.version)===i.VERSIONS.V1_1||a===i.VERSIONS.V1_2)return c=function(){var t,n,o,i;for(o=e["heart-beat"].split(","),i=[],t=0,n=o.length;t<n;t++)u=o[t],i.push(parseInt(u));return i}(),r=c[0],o=c[1],0!==this.heartbeat.outgoing&&0!==o&&(s=Math.max(this.heartbeat.outgoing,o),"function"===typeof this.debug&&this.debug("send PING every "+s+"ms"),this.pinger=i.setInterval(s,function(n){return function(){return n.ws.send(t.LF),"function"===typeof n.debug?n.debug(">>> PING"):void 0}}(this))),0!==this.heartbeat.incoming&&0!==r?(s=Math.max(this.heartbeat.incoming,r),"function"===typeof this.debug&&this.debug("check PONG every "+s+"ms"),this.ponger=i.setInterval(s,function(t){return function(){var e;if(e=n()-t.serverActivity,e>2*s)return"function"===typeof t.debug&&t.debug("did not receive server activity for the last "+e+"ms"),t.ws.close()}}(this))):void 0},e.prototype._parseConnect=function(){var t,n,e,o;switch(t=1<=arguments.length?s.call(arguments,0):[],o={},t.length){case 2:o=t[0],n=t[1];break;case 3:t[1]instanceof Function?(o=t[0],n=t[1],e=t[2]):(o.login=t[0],o.passcode=t[1],n=t[2]);break;case 4:o.login=t[0],o.passcode=t[1],n=t[2],e=t[3];break;default:o.login=t[0],o.passcode=t[1],n=t[2],e=t[3],o.host=t[4]}return[o,n,e]},e.prototype.connect=function(){var e,r,u,a;return e=1<=arguments.length?s.call(arguments,0):[],a=this._parseConnect.apply(this,e),u=a[0],this.connectCallback=a[1],r=a[2],"function"===typeof this.debug&&this.debug("Opening Web Socket..."),this.ws.onmessage=function(e){return function(i){var s,u,a,c,f,d,l,h,p,v,b,g,m;if(c="undefined"!==typeof ArrayBuffer&&i.data instanceof ArrayBuffer?(s=new Uint8Array(i.data),"function"===typeof e.debug&&e.debug("--- got data length: "+s.length),function(){var t,n,e;for(e=[],t=0,n=s.length;t<n;t++)u=s[t],e.push(String.fromCharCode(u));return e}().join("")):i.data,e.serverActivity=n(),c!==t.LF){for(e.debug,p=o.unmarshall(e.partialData+c),e.partialData=p.partial,g=p.frames,m=[],v=0,b=g.length;v<b;v++)switch(f=g[v],f.command){case"CONNECTED":"function"===typeof e.debug&&e.debug("connected to server "+f.headers.server),e.connected=!0,e._setupHeartbeat(f.headers),m.push("function"===typeof e.connectCallback?e.connectCallback(f):void 0);break;case"MESSAGE":h=f.headers.subscription,l=e.subscriptions[h]||e.onreceive,l?(a=e,d=f.headers["message-id"],f.ack=function(t){return null==t&&(t={}),a.ack(d,h,t)},f.nack=function(t){return null==t&&(t={}),a.nack(d,h,t)},m.push(l(f))):m.push("function"===typeof e.debug?e.debug("Unhandled received MESSAGE: "+f):void 0);break;case"RECEIPT":m.push("function"===typeof e.onreceipt?e.onreceipt(f):void 0);break;case"ERROR":m.push("function"===typeof r?r(f):void 0);break;default:m.push("function"===typeof e.debug?e.debug("Unhandled frame: "+f):void 0)}return m}e.debug}}(this),this.ws.onclose=function(t){return function(){var n;return n="Whoops! Lost connection to "+t.ws.url,"function"===typeof t.debug&&t.debug(n),t._cleanUp(),"function"===typeof r?r(n):void 0}}(this),this.ws.onopen=function(t){return function(){return"function"===typeof t.debug&&t.debug("Web Socket Opened..."),u["accept-version"]=i.VERSIONS.supportedVersions(),u["heart-beat"]=[t.heartbeat.outgoing,t.heartbeat.incoming].join(","),t._transmit("CONNECT",u)}}(this)},e.prototype.disconnect=function(t,n){return null==n&&(n={}),this._transmit("DISCONNECT",n),this.ws.onclose=null,this.ws.close(),this._cleanUp(),"function"===typeof t?t():void 0},e.prototype._cleanUp=function(){if(this.connected=!1,this.pinger&&i.clearInterval(this.pinger),this.ponger)return i.clearInterval(this.ponger)},e.prototype.send=function(t,n,e){return null==n&&(n={}),null==e&&(e=""),n.destination=t,this._transmit("SEND",n,e)},e.prototype.subscribe=function(t,n,e){var o;return null==e&&(e={}),e.id||(e.id="sub-"+this.counter++),e.destination=t,this.subscriptions[e.id]=n,this._transmit("SUBSCRIBE",e),o=this,{id:e.id,unsubscribe:function(){return o.unsubscribe(e.id)}}},e.prototype.unsubscribe=function(t){return delete this.subscriptions[t],this._transmit("UNSUBSCRIBE",{id:t})},e.prototype.begin=function(t){var n,e;return e=t||"tx-"+this.counter++,this._transmit("BEGIN",{transaction:e}),n=this,{id:e,commit:function(){return n.commit(e)},abort:function(){return n.abort(e)}}},e.prototype.commit=function(t){return this._transmit("COMMIT",{transaction:t})},e.prototype.abort=function(t){return this._transmit("ABORT",{transaction:t})},e.prototype.ack=function(t,n,e){return null==e&&(e={}),e["message-id"]=t,e.subscription=n,this._transmit("ACK",e)},e.prototype.nack=function(t,n,e){return null==e&&(e={}),e["message-id"]=t,e.subscription=n,this._transmit("NACK",e)},e}(),i={VERSIONS:{V1_0:"1.0",V1_1:"1.1",V1_2:"1.2",supportedVersions:function(){return"1.1,1.0"}},client:function(t,n){var o,r;return null==n&&(n=["v10.stomp","v11.stomp"]),o=i.WebSocketClass||WebSocket,r=new o(t,n),new e(r)},over:function(t){return new e(t)},Frame:o},null!==n&&(n.Stomp=i),"undefined"!==typeof window&&null!==window?(i.setInterval=function(t,n){return window.setInterval(n,t)},i.clearInterval=function(t){return window.clearInterval(t)},window.Stomp=i):n||(self.Stomp=i)}.call(this)},a260:function(t,n,e){"use strict";e("7a82");var o=e("4ea4").default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=o(e("6ee8")),r=o(e("990a")),s=o(e("9518")),u={en:i.default,"zh-Hans":r.default,"zh-Hant":s.default};n.default=u},b586:function(t,n,e){"use strict";e.r(n);var o=e("3fb5"),i=e("fb8c");for(var r in i)["default"].indexOf(r)<0&&function(t){e.d(n,t,(function(){return i[t]}))}(r);e("7a19");var s=e("f0c5"),u=Object(s["a"])(i["default"],o["b"],o["c"],!1,null,"64534147",null,!1,o["a"],void 0);n["default"]=u.exports},b69e:function(t,n,e){var o=e("3cdc");o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var i=e("4f06").default;i("09292825",o,!0,{sourceMap:!1,shadowMode:!1})},bb2f:function(t,n,e){var o=e("d039");t.exports=!o((function(){return Object.isExtensible(Object.preventExtensions({}))}))},e586:function(t,n,e){(function(){uni.webSocketBackup=WebSocket,WebSocket=function(t){this.uri=t,uni.connectSocket({url:t}),this.eventMap={};var n=this;uni.onSocketOpen((function(){console.log("uni:: ws open"),n.eventMap.hasOwnProperty("open")?n.eventMap["open"]():n.onopen()})),uni.onSocketMessage((function(t){n.eventMap.hasOwnProperty("message")?n.eventMap["message"](t):n.onmessage(t)})),uni.onSocketClose((function(){n.eventMap.hasOwnProperty("close")?n.eventMap["close"]():"function"==typeof n.onclose?n.onclose():uni.closeSocket({complete:function(t){console.log(t)}})})),uni.onSocketError((function(t){n.eventMap.hasOwnProperty("error")?n.eventMap["error"](t):n.onerror(t)}))};WebSocket.prototype={addEventListener:function(t,n){this.eventMap[t]=n},onopen:function(){},onmessage:function(t){console.log("default 实现:: "+t)},onclose:function(){},onerror:function(t){},send:function(t){uni.sendSocketMessage({data:t})},close:function(t){uni.closeSocket({complete:function(){"function"===typeof t&&t()}})}},null!==n&&(n.WebSocket=WebSocket)}).call(this)},f183:function(t,n,e){var o=e("23e7"),i=e("e330"),r=e("d012"),s=e("861d"),u=e("1a2d"),a=e("9bf2").f,c=e("241c"),f=e("057f"),d=e("4fad"),l=e("90e3"),h=e("bb2f"),p=!1,v=l("meta"),b=0,g=function(t){a(t,v,{value:{objectID:"O"+b++,weakData:{}}})},m=t.exports={enable:function(){m.enable=function(){},p=!0;var t=c.f,n=i([].splice),e={};e[v]=1,t(e).length&&(c.f=function(e){for(var o=t(e),i=0,r=o.length;i<r;i++)if(o[i]===v){n(o,i,1);break}return o},o({target:"Object",stat:!0,forced:!0},{getOwnPropertyNames:f.f}))},fastKey:function(t,n){if(!s(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!u(t,v)){if(!d(t))return"F";if(!n)return"E";g(t)}return t[v].objectID},getWeakData:function(t,n){if(!u(t,v)){if(!d(t))return!0;if(!n)return!1;g(t)}return t[v].weakData},onFreeze:function(t){return h&&p&&d(t)&&!u(t,v)&&g(t),t}};r[v]=!0},f747:function(t,n,e){"use strict";e("7a82");var o=e("4ea4").default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0,e("a9e3"),e("e25e");var i=e("37dc"),r=o(e("a260")),s=(0,i.initVueI18n)(r.default),u=s.t,a={name:"UniCountdown",emits:["timeup"],props:{showDay:{type:Boolean,default:!0},showHour:{type:Boolean,default:!0},showColon:{type:Boolean,default:!0},start:{type:Boolean,default:!0},backgroundColor:{type:String,default:""},color:{type:String,default:"#333"},fontSize:{type:Number,default:14},splitorColor:{type:String,default:"#333"},day:{type:Number,default:0},hour:{type:Number,default:0},minute:{type:Number,default:0},second:{type:Number,default:0},timestamp:{type:Number,default:0},zeroPad:{type:Boolean,default:!0}},data:function(){return{timer:null,syncFlag:!1,d:"00",h:"00",i:"00",s:"00",leftTime:0,seconds:0}},computed:{dayText:function(){return u("uni-countdown.day")},hourText:function(t){return u("uni-countdown.h")},minuteText:function(t){return u("uni-countdown.m")},secondText:function(t){return u("uni-countdown.s")},timeStyle:function(){var t=this.color,n=this.backgroundColor,e=this.fontSize;return{color:t,backgroundColor:n,fontSize:"".concat(e,"px"),width:"".concat(22*e/14,"px"),lineHeight:"".concat(20*e/14,"px"),borderRadius:"".concat(3*e/14,"px")}},splitorStyle:function(){var t=this.splitorColor,n=this.fontSize,e=this.backgroundColor;return{color:t,fontSize:"".concat(12*n/14,"px"),margin:e?"".concat(4*n/14,"px"):""}}},watch:{day:function(t){this.changeFlag()},hour:function(t){this.changeFlag()},minute:function(t){this.changeFlag()},second:function(t){this.changeFlag()},start:{immediate:!0,handler:function(t,n){if(t)this.startData();else{if(!n)return;clearInterval(this.timer)}}}},created:function(t){this.seconds=this.toSeconds(this.timestamp,this.day,this.hour,this.minute,this.second),this.countDown()},destroyed:function(){clearInterval(this.timer)},methods:{toSeconds:function(t,n,e,o,i){return t?t-parseInt((new Date).getTime()/1e3,10):60*n*60*24+60*e*60+60*o+i},timeUp:function(){clearInterval(this.timer),this.$emit("timeup")},countDown:function(){var t=this.seconds,n=0,e=0,o=0,i=0;t>0?(n=Math.floor(t/86400),e=Math.floor(t/3600)-24*n,o=Math.floor(t/60)-24*n*60-60*e,i=Math.floor(t)-24*n*60*60-60*e*60-60*o):this.timeUp(),n=n<10&&this.zeroPad?"0".concat(n):n,e=e<10&&this.zeroPad?"0".concat(e):e,o=o<10&&this.zeroPad?"0".concat(o):o,i=i<10&&this.zeroPad?"0".concat(i):i,this.d=n,this.h=e,this.i=o,this.s=i},startData:function(){var t=this;if(this.seconds=this.toSeconds(this.timestamp,this.day,this.hour,this.minute,this.second),this.seconds<=0)return this.seconds=this.toSeconds(0,0,0,0,0),void this.countDown();clearInterval(this.timer),this.countDown(),this.timer=setInterval((function(){t.seconds--,t.seconds<0?t.timeUp():t.countDown()}),1e3)},update:function(){this.startData()},changeFlag:function(){this.syncFlag||(this.seconds=this.toSeconds(this.timestamp,this.day,this.hour,this.minute,this.second),this.startData(),this.syncFlag=!0)}}};n.default=a},fb8c:function(t,n,e){"use strict";e.r(n);var o=e("f747"),i=e.n(o);for(var r in o)["default"].indexOf(r)<0&&function(t){e.d(n,t,(function(){return o[t]}))}(r);n["default"]=i.a}}]);