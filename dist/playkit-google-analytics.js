!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("playkit-js")):"function"==typeof define&&define.amd?define(["playkit-js"],t):"object"==typeof exports?exports.googleAnalytics=t(require("playkit-js")):(e.KalturaPlayer=e.KalturaPlayer||{},e.KalturaPlayer.plugins=e.KalturaPlayer.plugins||{},e.KalturaPlayer.plugins.googleAnalytics=t(e.KalturaPlayer.core))}(this,function(e){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(t,n){t.exports=e},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.NAME=t.VERSION=void 0;var r=n(0),i=n(2),o=function(e){return e&&e.__esModule?e:{default:e}}(i);t.default=o.default,t.VERSION="0.1.3",t.NAME="playkit-js-google-analytics";(0,r.registerPlugin)("googleAnalytics",o.default)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0;try{for(var a,c=e[Symbol.iterator]();!(r=(a=c.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{!r&&c.return&&c.return()}finally{if(i)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(0),s=n(3),y=function(e){return e&&e.__esModule?e:{default:e}}(s),g="widget loaded",d=function(e){function t(e,n,o){r(this,t);var a=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n,o));return a._timePercentEvent={PLAY_REACHED_25:!1,PLAY_REACHED_50:!1,PLAY_REACHED_75:!1,PLAY_REACHED_100:!1},a.config.trackingId?(a._init(),a._addBindings(),a._sendEvent({action:g,category:a._getValue(a.config.tracking.category)})):a.logger.warn("No Google Analytics tracking ID provided. Tracking aborted"),a}return o(t,e),l(t,null,[{key:"isValid",value:function(){return!0}}]),l(t,[{key:"_gtag",value:function(){window.dataLayer.push(arguments)}},{key:"_init",value:function(){var e=this;window.google_tag_manager||f.Utils.Dom.loadScriptAsync(t.GTAG_LIB_URL+"?id="+this.config.trackingId).then(function(){e.logger.debug("Google gtag library has loaded successfully")}),window.dataLayer=window.dataLayer||[],this._gtag("js",new Date),this._gtag("config",this.config.trackingId)}},{key:"_getValue",value:function(e,t){try{return"function"==typeof e?e.call(this,t):e}catch(e){return this.logger.error(e),null}}},{key:"_addBindings",value:function(){var e=this;Object.entries(this.config.tracking.events).forEach(function(t){var n=u(t,2),r=n[0],i=n[1];e.eventManager.listen(e.player,e.player.Event[r],function(t){if(i&&"object"===(void 0===i?"undefined":c(i))&&function(n){return n.action&&("function"!=typeof n.condition||n.condition.call(e,t))}(i)){var n=e._getValue(i.category,t),r=e._getValue(i.label,t),o=e._getValue(i.value,t),a={action:e._getValue(i.action,t),category:"string"==typeof n?n:e._getValue(e.config.tracking.category,t),label:"string"==typeof r?r:e._getValue(e.config.tracking.label,t),value:"number"==typeof o?o:e._getValue(e.config.tracking.value,t)};e._sendEvent(a)}})}),this.eventManager.listen(this.player,this.player.Event.TIME_UPDATE,this._sendTimePercentAnalytic.bind(this))}},{key:"_sendTimePercentAnalytic",value:function(e){var t=this,n=function(){return{category:t._getValue(t.config.tracking.category,e),label:t._getValue(t.config.tracking.label,e),value:t.player.currentTime}};if(this.player.config.sources.type!==this.player.MediaType.LIVE){var r=this.player.currentTime/this.player.duration;!this._timePercentEvent.PLAY_REACHED_25&&r>=.25&&(this._timePercentEvent.PLAY_REACHED_25=!0,this._sendEvent(a({action:"25% watched"},n()))),!this._timePercentEvent.PLAY_REACHED_50&&r>=.5&&(this._timePercentEvent.PLAY_REACHED_50=!0,this._sendEvent(a({action:"50% watched"},n()))),!this._timePercentEvent.PLAY_REACHED_75&&r>=.75&&(this._timePercentEvent.PLAY_REACHED_75=!0,this._sendEvent(a({action:"75% watched"},n()))),!this._timePercentEvent.PLAY_REACHED_100&&r>=1&&(this._timePercentEvent.PLAY_REACHED_100=!0,this._sendEvent(a({action:"100% watched"},n())))}}},{key:"_sendEvent",value:function(e){if(e.action){var t={};t.event_category=e.category,e.label&&(t.event_label=e.label),"number"==typeof e.value&&(t.value=Math.round(e.value)),this.logger.debug(e.action+" event sent",t),this._gtag("event",e.action,t)}}},{key:"destroy",value:function(){this.eventManager.destroy()}},{key:"reset",value:function(){this._timePercentEvent={PLAY_REACHED_25:!1,PLAY_REACHED_50:!1,PLAY_REACHED_75:!1,PLAY_REACHED_100:!1}}}]),t}(f.BasePlugin);d.defaultConfig={tracking:y.default},d.GTAG_LIB_URL="//www.googletagmanager.com/gtag/js",t.default=d},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0;try{for(var a,c=e[Symbol.iterator]();!(r=(a=c.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{!r&&c.return&&c.return()}finally{if(i)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=n(0);t.default={category:"Kaltura Video Events",label:function(){return this.config.partnerId+" | "+(this.config.uiConfId?this.config.uiConfId+" | ":"")+this.config.entryId+" | '"+this.config.entryName+"'"},events:{MEDIA_LOADED:{action:"media ready"},FIRST_PLAY:{action:"first play"},PLAY:{action:"play",value:1},PAUSE:{action:"pause",value:1},SEEKED:{action:"seek",value:function(){return this.player.currentTime}},ENDED:{action:"ended"},CHANGE_SOURCE_ENDED:{action:"change media",value:1},ENTER_FULLSCREEN:{action:"enter full screen",value:1},EXIT_FULLSCREEN:{action:"exit full screen",value:1},ERROR:{action:"error",category:"Kaltura Video Error",label:function(e){return Object.entries(i.Error.Code).find(function(t){var n=r(t,2);n[0];return n[1]===e.payload.code})[0]},condition:function(e){return e.payload.severity===i.Error.Severity.CRITICAL}}}}}])});
//# sourceMappingURL=playkit-google-analytics.js.map