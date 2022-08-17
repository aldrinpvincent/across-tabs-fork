/*! For license information please see across-tabs.js.LICENSE.txt */
!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.AcrossTabs=n():e.AcrossTabs=n()}(self,(()=>(()=>{"use strict";var e={d:(n,t)=>{for(var i in t)e.o(t,i)&&!e.o(n,i)&&Object.defineProperty(n,i,{enumerable:!0,get:t[i]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>M});const t="__TAB__LOADED_EVENT__",i="__TAB__CUSTOM_EVENT__",o="__TAB__HANDSHAKE_EVENT__",a="__TAB__ON_BEFORE_UNLOAD__",r="__PARENT_DISCONNECTED__",s="__HANDSHAKE_WITH_PARENT__",d="__PARENT_COMMUNICATED__";var l={},u={INDEX:"index",OBJECT:"object",BOTH:"both"};l.searchByKeyName=function(e,n,t,i){if(!e||!n)return!1;i=i||u[1];var o,a,r,s=-1;for(o=0;o<e.length;o++){if(a=e[o],!isNaN(t)&&parseInt(a[n],10)===parseInt(t,10)){s=o;break}if(isNaN(t)&&a[n]===t){s=o;break}}switch(-1===s&&(e[s]={}),i){case u.INDEX:r=s;break;case u.BOTH:r={obj:e[s],index:s};break;default:r=e[s]}return r};const c=l,f="open",h="close",g="Invalid JSON Object!",w="Some wrong message is being sent by Parent.",p="Configuration options required. Please read docs.",b="Url is needed for creating and opening a new window/tab. Please read docs.";var y={tabs:[],config:{},_remove:function(e){var n;n=c.searchByKeyName(y.tabs,"id",e.id,"index"),y.tabs.splice(n,1)},_preProcessMessage:function(e){try{e=y.config.stringify(e)}catch(e){throw new Error(g)}return e&&-1===e.indexOf(d)&&(e=d+e),e},addNew:function(e){y.tabs.push(e)},getOpened:function(){return y.tabs.filter((function(e){return e.status===f}))},getClosed:function(){return y.tabs.filter((function(e){return e.status===h}))},getAll:function(){return y.tabs},closeTab:function(e){var n=c.searchByKeyName(y.tabs,"id",e);return n&&n.ref&&(n.ref.close(),n.status=h),y},closeAll:function(){var e;for(e=0;e<y.tabs.length;e++)y.tabs[e]&&y.tabs[e].ref&&(y.tabs[e].ref.close(),y.tabs[e].status=h);return y},broadCastAll:function(e,n){var t,i=y.getOpened();for(e=y._preProcessMessage(e),t=0;t<i.length;t++)y.sendMessage(i[t],e,n);return y},broadCastTo:function(e,n,t){var i,o=y.getAll();return n=y._preProcessMessage(n),i=c.searchByKeyName(o,"id",e),y.sendMessage(i,n,t),y},sendMessage:function(e,n,t){var i=y.config.origin||"*";if(t&&e.ref[0])for(var o=0;o<e.ref.length;o++)e.ref[o].postMessage(n,i);else e.ref&&e.ref.top&&e.ref.top.postMessage(n,i)}};const m=y,v=function(){function e(){}return e.generate=function(){var n=e._getRandomInt,t=e._hexAligner;return t(n(32),8)+"-"+t(n(16),4)+"-"+t(16384|n(12),4)+"-"+t(32768|n(14),4)+"-"+t(n(48),12)},e._getRandomInt=function(e){return e<0?NaN:e<=30?0|Math.random()*(1<<e):e<=53?(0|Math.random()*(1<<30))+(0|Math.random()*(1<<e-30))*(1<<30):NaN},e._getIntAligner=function(e){return function(n,t){for(var i=n.toString(e),o=t-i.length,a="0";o>0;o>>>=1,a+=a)1&o&&(i=a+i);return i}},e._hexAligner=e._getIntAligner(16),e.prototype.toString=function(){return this.hexString},e}(),_=function(e){if(!e)return!1;var n,t=document.querySelectorAll("["+e+"]");for(n=0;n<t.length;n++)t[n].setAttribute("disabled","disabled")},E=function(e){if(!e)return!1;var n,t=document.querySelectorAll("["+e+"]");for(n=0;n<t.length;n++)t[n].removeAttribute("disabled")};function T(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}const C=function(){function e(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),window.name=window.name||"PARENT_TAB"}var n,t;return n=e,(t=[{key:"create",value:function(e){return e=e||{},Object.assign(this,e),this.id=v.generate()||m.tabs.length+1,this.status="open",this.ref=window.open(this.url,e.windowName||"_blank",e.windowFeatures),_("data-tab-opener"),window.newlyTabOpened={id:this.id,name:this.name||this.windowName,ref:this.ref},m.addNew(this),this}}])&&T(n.prototype,t),Object.defineProperty(n,"prototype",{writable:!1}),e}();!function(){function e(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=document.createEvent("CustomEvent");return t.initCustomEvent(e,!1,!1,n.detail),t}"function"!=typeof window.CustomEvent&&(e.prototype=window.Event.prototype,window.CustomEvent=e)}();var S={_onLoad:function(e){var n,i,o=e.split(t)[1];if(o)try{(o=m.config.parse(o)).id&&(n=m.getAll()).length&&(window.newlyTabOpened=n[n.length-1],window.newlyTabOpened.id=o.id,window.newlyTabOpened.name=o.name||o.windowName)}catch(e){throw new Error(g)}if(window.newlyTabOpened)try{i=s,i+=m.config.stringify({id:window.newlyTabOpened.id,name:window.newlyTabOpened.name||window.newlyTabOpened.windowName,parentName:window.name}),m.sendMessage(window.newlyTabOpened,i,o.isSiteInsideFrame)}catch(e){throw new Error(g)}},_onCustomMessage:function(e,n){var t,i=e.split(n)[1];try{i=m.config.parse(i)}catch(e){throw new Error(g)}t=new CustomEvent("onCustomChildMessage",{detail:{tabInfo:i,type:n}}),window.dispatchEvent(t)},_onBeforeUnload:function(e){var n,t=e.split(a)[1];try{t=m.config.parse(t)}catch(e){throw new Error(g)}m.tabs.length&&(n=m.getAll(),window.newlyTabOpened=c.searchByKeyName(n,"id",t.id)||window.newlyTabOpened);var i=new CustomEvent("onChildUnload",{detail:t});window.dispatchEvent(i)},onNewTab:function(e){var n=e.data;return!(!n||"string"!=typeof n||!m.tabs.length)&&(!m.config.origin||m.config.origin===e.origin)&&void(n.indexOf(t)>-1?S._onLoad(n):n.indexOf(i)>-1?S._onCustomMessage(n,i):n.indexOf(o)>-1?S._onCustomMessage(n,o):n.indexOf(a)>-1&&S._onBeforeUnload(n))}};const O=S;function N(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}var I,k,A=function(){function e(n){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),void 0===(n=n||{}).heartBeatInterval&&(n.heartBeatInterval=500),void 0===n.shouldInitImmediately&&(n.shouldInitImmediately=!0),"function"!=typeof n.parse&&(n.parse=JSON.parse),"function"!=typeof n.stringify&&(n.stringify=JSON.stringify),m.tabs=[],this.Tab=C,Object.assign(this,n),m.config=n,this.shouldInitImmediately&&this.init()}var n,t;return n=e,t=[{key:"addInterval",value:function(){var e,n=m.getAll(),t=m.getOpened();if(!t||!t.length)return window.clearInterval(I),I=null,!1;for(e=0;e<n.length;e++)this.removeClosedTabs&&this.watchStatus(n[e]),n[e]&&n[e].ref&&(n[e].status=n[e].ref.closed?h:f);this.onPollingCallback&&this.onPollingCallback()}},{key:"startPollingTabs",value:function(){var e=this;I=window.setInterval((function(){return e.addInterval()}),this.heartBeatInterval)}},{key:"watchStatus",value:function(e){if(!e||!e.ref)return!1;var n=e.ref.closed?h:f,t=e.status;if(!n||n===t)return!1;t===f&&n===h&&m._remove(e)}},{key:"onChildUnload",value:function(e){this.onChildDisconnect&&this.onChildDisconnect(e.detail)}},{key:"customEventUnListener",value:function(e){this.enableElements(),e.detail&&e.detail.type===o&&this.onHandshakeCallback?this.onHandshakeCallback(e.detail.tabInfo):e.detail&&e.detail.type===i&&this.onChildCommunication&&this.onChildCommunication(e.detail.tabInfo)}},{key:"addEventListeners",value:function(){var e=this;window.removeEventListener("message",O.onNewTab),window.addEventListener("message",O.onNewTab),window.removeEventListener("onCustomChildMessage",this.customEventUnListener),window.addEventListener("onCustomChildMessage",(function(n){return e.customEventUnListener(n)})),window.removeEventListener("onChildUnload",this.onChildUnload),window.addEventListener("onChildUnload",(function(n){return e.onChildUnload(n)})),window.onbeforeunload=function(){m.broadCastAll(r)}}},{key:"enableElements",value:function(){E("data-tab-opener")}},{key:"getAllTabs",value:function(){return m.getAll()}},{key:"getOpenedTabs",value:function(){return m.getOpened()}},{key:"getClosedTabs",value:function(){return m.getClosed()}},{key:"closeAllTabs",value:function(){return m.closeAll()}},{key:"closeTab",value:function(e){return m.closeTab(e)}},{key:"broadCastAll",value:function(e){return m.broadCastAll(e)}},{key:"broadCastTo",value:function(e,n){return m.broadCastTo(e,n)}},{key:"openNewTab",value:function(e){if(!e)throw new Error(p);if(!e.url)throw new Error(b);return(k=new this.Tab).create(e),I||this.startPollingTabs(),k}},{key:"init",value:function(){this.addEventListeners()}}],t&&N(n.prototype,t),Object.defineProperty(n,"prototype",{writable:!1}),e}();function P(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}const M={Parent:A,Child:function(){function e(n){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),this.sessionStorageKey="__vwo_new_tab_info__",n||(n={}),void 0===n.handshakeExpiryLimit&&(n.handshakeExpiryLimit=5e3),void 0===n.shouldInitImmediately&&(n.shouldInitImmediately=!0),"function"!=typeof n.parse&&(n.parse=JSON.parse),"function"!=typeof n.stringify&&(n.stringify=JSON.stringify),this.tabName=window.name,this.tabId=null,this.tabParentName=null,Object.assign(this,n),this.config=n,this.shouldInitImmediately&&this.init()}var n,l;return n=e,(l=[{key:"_isSessionStorage",value:function(){return!(!("sessionStorage"in window)||!window.sessionStorage)}},{key:"_getData",value:function(){return!!this.isSessionStorageSupported&&window.sessionStorage.getItem(this.sessionStorageKey)}},{key:"_setData",value:function(e){return!!this.isSessionStorageSupported&&(window.sessionStorage.setItem(this.sessionStorageKey,e),e)}},{key:"_restoreData",value:function(){if(!this.isSessionStorageSupported)return!1;if(this.isSessionStorageSupported){var e=this._getData();this._parseData(e)}}},{key:"_parseData",value:function(e){var n;try{n=this.config.parse(e),this.tabId=n&&n.id,this.tabName=n&&n.name,this.tabParentName=n&&n.parentName}catch(e){throw new Error(w)}}},{key:"onCommunication",value:function(e){var n,t,i=this,a=e.data;if(a&&"string"==typeof a&&(!this.config.origin||this.config.origin===e.origin)&&(window.clearTimeout(this.timeout),a.indexOf(r)>-1&&(this.config.onParentDisconnect&&this.config.onParentDisconnect(),window.removeEventListener("message",(function(e){return i.onCommunication(e)}))),a.indexOf(s)>-1&&(n=a.split(s)[1],this._setData(n),this._parseData(n),t={id:this.tabId,isSiteInsideFrame:this.config.isSiteInsideFrame},this.sendMessageToParent(t,o),this.config.onInitialize&&this.config.onInitialize()),a.indexOf(d)>-1)){n=a.split(d)[1];try{n=this.config.parse(n)}catch(e){throw new Error(g)}this.config.onParentCommunication&&this.config.onParentCommunication(n)}}},{key:"addListeners",value:function(){var e=this;window.onbeforeunload=function(n){var t={id:e.tabId,isSiteInsideFrame:e.config.isSiteInsideFrame};e.sendMessageToParent(t,a)},window.removeEventListener("message",(function(n){return e.onCommunication(n)})),window.addEventListener("message",(function(n){return e.onCommunication(n)}))}},{key:"setHandshakeExpiry",value:function(){var e=this;return window.setTimeout((function(){e.config.onHandShakeExpiry&&e.config.onHandShakeExpiry()}),this.handshakeExpiryLimit)}},{key:"sendMessageToParent",value:function(e,n){var t;e=(n||i)+this.config.stringify(e),window.top.opener&&(t=this.config.origin||"*",window.top.opener.postMessage(e,t))}},{key:"getTabInfo",value:function(){return{id:this.tabId,name:this.tabName,parentName:this.tabParentName,isSiteInsideFrame:this.config.isSiteInsideFrame}}},{key:"init",value:function(){this.isSessionStorageSupported=this._isSessionStorage(),this.addListeners(),this._restoreData(),this.sendMessageToParent(this.getTabInfo(),t),this.timeout=this.setHandshakeExpiry(),this.config.onReady&&this.config.onReady()}}])&&P(n.prototype,l),Object.defineProperty(n,"prototype",{writable:!1}),e}()};return n})()));