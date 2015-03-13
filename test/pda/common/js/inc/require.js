var requirejs,require,define;!function(global){function isFunction(a){return"[object Function]"===ostring.call(a)}function isArray(a){return"[object Array]"===ostring.call(a)}function each(a,b){if(a){var c;for(c=0;c<a.length&&(!a[c]||!b(a[c],c,a));c+=1);}}function eachReverse(a,b){if(a){var c;for(c=a.length-1;c>-1&&(!a[c]||!b(a[c],c,a));c-=1);}}function hasProp(a,b){return hasOwn.call(a,b)}function getOwn(a,b){return hasProp(a,b)&&a[b]}function eachProp(a,b){var c;for(c in a)if(hasProp(a,c)&&b(a[c],c))break}function mixin(a,b,c,d){return b&&eachProp(b,function(b,e){(c||!hasProp(a,e))&&(!d||"object"!=typeof b||!b||isArray(b)||isFunction(b)||b instanceof RegExp?a[e]=b:(a[e]||(a[e]={}),mixin(a[e],b,c,d)))}),a}function bind(a,b){return function(){return b.apply(a,arguments)}}function scripts(){return document.getElementsByTagName("script")}function defaultOnError(a){throw a}function getGlobal(a){if(!a)return a;var b=global;return each(a.split("."),function(a){b=b[a]}),b}function makeError(a,b,c,d){var e=new Error(b+"\nhttp://requirejs.org/docs/errors.html#"+a);return e.requireType=a,e.requireModules=d,c&&(e.originalError=c),e}function newContext(a){function q(a){var b,c;for(b=0;b<a.length;b++)if(c=a[b],"."===c)a.splice(b,1),b-=1;else if(".."===c){if(0===b||1==b&&".."===a[2]||".."===a[b-1])continue;b>0&&(a.splice(b-1,2),b-=2)}}function r(a,b,c){var d,e,f,h,i,j,k,l,m,n,o,p,r=b&&b.split("/"),s=g.map,t=s&&s["*"];if(a&&(a=a.split("/"),k=a.length-1,g.nodeIdCompat&&jsSuffixRegExp.test(a[k])&&(a[k]=a[k].replace(jsSuffixRegExp,"")),"."===a[0].charAt(0)&&r&&(p=r.slice(0,r.length-1),a=p.concat(a)),q(a),a=a.join("/")),c&&s&&(r||t)){f=a.split("/");a:for(h=f.length;h>0;h-=1){if(j=f.slice(0,h).join("/"),r)for(i=r.length;i>0;i-=1)if(e=getOwn(s,r.slice(0,i).join("/")),e&&(e=getOwn(e,j))){l=e,m=h;break a}!n&&t&&getOwn(t,j)&&(n=getOwn(t,j),o=h)}!l&&n&&(l=n,m=o),l&&(f.splice(0,m,l),a=f.join("/"))}return d=getOwn(g.pkgs,a),d?d:a}function s(a){isBrowser&&each(scripts(),function(b){return b.getAttribute("data-requiremodule")===a&&b.getAttribute("data-requirecontext")===d.contextName?(b.parentNode.removeChild(b),!0):void 0})}function t(a){var b=getOwn(g.paths,a);return b&&isArray(b)&&b.length>1?(b.shift(),d.require.undef(a),d.makeRequire(null,{skipMap:!0})([a]),!0):void 0}function u(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function v(a,b,c,e){var f,g,h,i,j=null,k=b?b.name:null,m=a,n=!0,q="";return a||(n=!1,a="_@r"+(o+=1)),i=u(a),j=i[0],a=i[1],j&&(j=r(j,k,e),g=getOwn(l,j)),a&&(j?q=g&&g.normalize?g.normalize(a,function(a){return r(a,k,e)}):-1===a.indexOf("!")?r(a,k,e):a:(q=r(a,k,e),i=u(q),j=i[0],q=i[1],c=!0,f=d.nameToUrl(q))),h=!j||g||c?"":"_unnormalized"+(p+=1),{prefix:j,name:q,parentMap:b,unnormalized:!!h,url:f,originalName:m,isDefine:n,id:(j?j+"!"+q:q)+h}}function w(a){var b=a.id,c=getOwn(h,b);return c||(c=h[b]=new d.Module(a)),c}function x(a,b,c){var d=a.id,e=getOwn(h,d);!hasProp(l,d)||e&&!e.defineEmitComplete?(e=w(a),e.error&&"error"===b?c(e.error):e.on(b,c)):"defined"===b&&c(l[d])}function y(a,b){var c=a.requireModules,d=!1;b?b(a):(each(c,function(b){var c=getOwn(h,b);c&&(c.error=a,c.events.error&&(d=!0,c.emit("error",a)))}),d||req.onError(a))}function z(){globalDefQueue.length&&(apsp.apply(k,[k.length,0].concat(globalDefQueue)),globalDefQueue=[])}function A(a){delete h[a],delete i[a]}function B(a,b,c){var d=a.map.id;a.error?a.emit("error",a.error):(b[d]=!0,each(a.depMaps,function(d,e){var f=d.id,g=getOwn(h,f);!g||a.depMatched[e]||c[f]||(getOwn(b,f)?(a.defineDep(e,l[f]),a.check()):B(g,b,c))}),c[d]=!0)}function C(){var a,c,e=1e3*g.waitSeconds,h=e&&d.startTime+e<(new Date).getTime(),j=[],k=[],l=!1,m=!0;if(!b){if(b=!0,eachProp(i,function(a){var b=a.map,d=b.id;if(a.enabled&&(b.isDefine||k.push(a),!a.error))if(!a.inited&&h)t(d)?(c=!0,l=!0):(j.push(d),s(d));else if(!a.inited&&a.fetched&&b.isDefine&&(l=!0,!b.prefix))return m=!1}),h&&j.length)return a=makeError("timeout","Load timeout for modules: "+j,null,j),a.contextName=d.contextName,y(a);m&&each(k,function(a){B(a,{},{})}),h&&!c||!l||!isBrowser&&!isWebWorker||f||(f=setTimeout(function(){f=0,C()},50)),b=!1}}function D(a){hasProp(l,a[0])||w(v(a[0],null,!0)).init(a[1],a[2])}function E(a,b,c,d){a.detachEvent&&!isOpera?d&&a.detachEvent(d,b):a.removeEventListener(c,b,!1)}function F(a){var b=a.currentTarget||a.srcElement;return E(b,d.onScriptLoad,"load","onreadystatechange"),E(b,d.onScriptError,"error"),{node:b,id:b&&b.getAttribute("data-requiremodule")}}function G(){var a;for(z();k.length;){if(a=k.shift(),null===a[0])return y(makeError("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));D(a)}}var b,c,d,e,f,g={waitSeconds:7,baseUrl:"./",paths:{},bundles:{},pkgs:{},shim:{},config:{}},h={},i={},j={},k=[],l={},m={},n={},o=1,p=1;return e={require:function(a){return a.require?a.require:a.require=d.makeRequire(a.map)},exports:function(a){return a.usingExports=!0,a.map.isDefine?a.exports?l[a.map.id]=a.exports:a.exports=l[a.map.id]={}:void 0},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){return getOwn(g.config,a.map.id)||{}},exports:a.exports||(a.exports={})}}},c=function(a){this.events=getOwn(j,a.id)||{},this.map=a,this.shim=getOwn(g.shim,a.id),this.depExports=[],this.depMaps=[],this.depMatched=[],this.pluginMaps={},this.depCount=0},c.prototype={init:function(a,b,c,d){d=d||{},this.inited||(this.factory=b,c?this.on("error",c):this.events.error&&(c=bind(this,function(a){this.emit("error",a)})),this.depMaps=a&&a.slice(0),this.errback=c,this.inited=!0,this.ignore=d.ignore,d.enabled||this.enabled?this.enable():this.check())},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=b)},fetch:function(){if(!this.fetched){this.fetched=!0,d.startTime=(new Date).getTime();var a=this.map;return this.shim?(d.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],bind(this,function(){return a.prefix?this.callPlugin():this.load()})),void 0):a.prefix?this.callPlugin():this.load()}},load:function(){var a=this.map.url;m[a]||(m[a]=!0,d.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,b,c=this.map.id,e=this.depExports,f=this.exports,g=this.factory;if(this.inited){if(this.error)this.emit("error",this.error);else if(!this.defining){if(this.defining=!0,this.depCount<1&&!this.defined){if(isFunction(g)){if(this.events.error&&this.map.isDefine||req.onError!==defaultOnError)try{f=d.execCb(c,g,e,f)}catch(h){a=h}else f=d.execCb(c,g,e,f);if(this.map.isDefine&&void 0===f&&(b=this.module,b?f=b.exports:this.usingExports&&(f=this.exports)),a)return a.requireMap=this.map,a.requireModules=this.map.isDefine?[this.map.id]:null,a.requireType=this.map.isDefine?"define":"require",y(this.error=a)}else f=g;this.exports=f,this.map.isDefine&&!this.ignore&&(l[c]=f,req.onResourceLoad&&req.onResourceLoad(d,this.map,this.depMaps)),A(c),this.defined=!0}this.defining=!1,this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}else this.fetch()}},callPlugin:function(){var a=this.map,b=a.id,c=v(a.prefix);this.depMaps.push(c),x(c,"defined",bind(this,function(c){var e,f,i,j=getOwn(n,this.map.id),k=this.map.name,l=this.map.parentMap?this.map.parentMap.name:null,m=d.makeRequire(a.parentMap,{enableBuildCallback:!0});return this.map.unnormalized?(c.normalize&&(k=c.normalize(k,function(a){return r(a,l,!0)})||""),f=v(a.prefix+"!"+k,this.map.parentMap),x(f,"defined",bind(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),i=getOwn(h,f.id),i&&(this.depMaps.push(f),this.events.error&&i.on("error",bind(this,function(a){this.emit("error",a)})),i.enable()),void 0):j?(this.map.url=d.nameToUrl(j),this.load(),void 0):(e=bind(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),e.error=bind(this,function(a){this.inited=!0,this.error=a,a.requireModules=[b],eachProp(h,function(a){0===a.map.id.indexOf(b+"_unnormalized")&&A(a.map.id)}),y(a)}),e.fromText=bind(this,function(c,f){var h=a.name,i=v(h),j=useInteractive;f&&(c=f),j&&(useInteractive=!1),w(i),hasProp(g.config,b)&&(g.config[h]=g.config[b]);try{req.exec(c)}catch(k){return y(makeError("fromtexteval","fromText eval for "+b+" failed: "+k,k,[b]))}j&&(useInteractive=!0),this.depMaps.push(i),d.completeLoad(h),m([h],e)}),c.load(a.name,m,e,g),void 0)})),d.enable(c,this),this.pluginMaps[c.id]=c},enable:function(){i[this.map.id]=this,this.enabled=!0,this.enabling=!0,each(this.depMaps,bind(this,function(a,b){var c,f,g;if("string"==typeof a){if(a=v(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap),this.depMaps[b]=a,g=getOwn(e,a.id))return this.depExports[b]=g(this),void 0;this.depCount+=1,x(a,"defined",bind(this,function(a){this.defineDep(b,a),this.check()})),this.errback&&x(a,"error",bind(this,this.errback))}c=a.id,f=h[c],hasProp(e,c)||!f||f.enabled||d.enable(a,this)})),eachProp(this.pluginMaps,bind(this,function(a){var b=getOwn(h,a.id);b&&!b.enabled&&d.enable(a,this)})),this.enabling=!1,this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]),c.push(b)},emit:function(a,b){each(this.events[a],function(a){a(b)}),"error"===a&&delete this.events[a]}},d={config:g,contextName:a,registry:h,defined:l,urlFetched:m,defQueue:k,Module:c,makeModuleMap:v,nextTick:req.nextTick,onError:y,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");var b=g.shim,c={paths:!0,bundles:!0,config:!0,map:!0};eachProp(a,function(a,b){c[b]?(g[b]||(g[b]={}),mixin(g[b],a,!0,!0)):g[b]=a}),a.bundles&&eachProp(a.bundles,function(a,b){each(a,function(a){a!==b&&(n[a]=b)})}),a.shim&&(eachProp(a.shim,function(a,c){isArray(a)&&(a={deps:a}),!a.exports&&!a.init||a.exportsFn||(a.exportsFn=d.makeShimExports(a)),b[c]=a}),g.shim=b),a.packages&&each(a.packages,function(a){var b,c;a="string"==typeof a?{name:a}:a,c=a.name,b=a.location,b&&(g.paths[c]=a.location),g.pkgs[c]=a.name+"/"+(a.main||"main").replace(currDirRegExp,"").replace(jsSuffixRegExp,"")}),eachProp(h,function(a,b){a.inited||a.map.unnormalized||(a.map=v(b))}),(a.deps||a.callback)&&d.require(a.deps||[],a.callback)},makeShimExports:function(a){function b(){var b;return a.init&&(b=a.init.apply(global,arguments)),b||a.exports&&getGlobal(a.exports)}return b},makeRequire:function(b,c){function f(g,i,j){var k,m,n;return c.enableBuildCallback&&i&&isFunction(i)&&(i.__requireJsBuild=!0),"string"==typeof g?isFunction(i)?y(makeError("requireargs","Invalid require call"),j):b&&hasProp(e,g)?e[g](h[b.id]):req.get?req.get(d,g,b,f):(m=v(g,b,!1,!0),k=m.id,hasProp(l,k)?l[k]:y(makeError("notloaded",'Module name "'+k+'" has not been loaded yet for context: '+a+(b?"":". Use require([])")))):(G(),d.nextTick(function(){G(),n=w(v(null,b)),n.skipMap=c.skipMap,n.init(g,i,j,{enabled:!0}),C()}),f)}return c=c||{},mixin(f,{isBrowser:isBrowser,toUrl:function(a){var c,e=a.lastIndexOf("."),f=a.split("/")[0],g="."===f||".."===f;return-1!==e&&(!g||e>1)&&(c=a.substring(e,a.length),a=a.substring(0,e)),d.nameToUrl(r(a,b&&b.id,!0),c,!0)},defined:function(a){return hasProp(l,v(a,b,!1,!0).id)},specified:function(a){return a=v(a,b,!1,!0).id,hasProp(l,a)||hasProp(h,a)}}),b||(f.undef=function(a){z();var c=v(a,b,!0),d=getOwn(h,a);s(a),delete l[a],delete m[c.url],delete j[a],eachReverse(k,function(b,c){b[0]===a&&k.splice(c,1)}),d&&(d.events.defined&&(j[a]=d.events),A(a))}),f},enable:function(a){var b=getOwn(h,a.id);b&&w(a).enable()},completeLoad:function(a){var b,c,d,e=getOwn(g.shim,a)||{},f=e.exports;for(z();k.length;){if(c=k.shift(),null===c[0]){if(c[0]=a,b)break;b=!0}else c[0]===a&&(b=!0);D(c)}if(d=getOwn(h,a),!b&&!hasProp(l,a)&&d&&!d.inited){if(!(!g.enforceDefine||f&&getGlobal(f)))return t(a)?void 0:y(makeError("nodefine","No define call for "+a,null,[a]));D([a,e.deps||[],e.exportsFn])}C()},nameToUrl:function(a,b,c){var e,f,h,i,j,k,l,m=getOwn(g.pkgs,a);if(m&&(a=m),l=getOwn(n,a))return d.nameToUrl(l,b,c);if(req.jsExtRegExp.test(a))j=a+(b||"");else{for(e=g.paths,f=a.split("/"),h=f.length;h>0;h-=1)if(i=f.slice(0,h).join("/"),k=getOwn(e,i)){isArray(k)&&(k=k[0]),f.splice(0,h,k);break}j=f.join("/"),j+=b||(/^data\:|\?/.test(j)||c?"":".js"),j=("/"===j.charAt(0)||j.match(/^[\w\+\.\-]+:/)?"":g.baseUrl)+j}return g.urlArgs?j+((-1===j.indexOf("?")?"?":"&")+g.urlArgs):j},load:function(a,b){req.load(d,a,b)},execCb:function(a,b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if("load"===a.type||readyRegExp.test((a.currentTarget||a.srcElement).readyState)){interactiveScript=null;var b=F(a);d.completeLoad(b.id)}},onScriptError:function(a){var b=F(a);return t(b.id)?void 0:y(makeError("scripterror","Script error for: "+b.id,a,[b.id]))}},d.require=d.makeRequire(),d}function getInteractiveScript(){return interactiveScript&&"interactive"===interactiveScript.readyState?interactiveScript:(eachReverse(scripts(),function(a){return"interactive"===a.readyState?interactiveScript=a:void 0}),interactiveScript)}var req,s,head,baseElement,dataMain,src,interactiveScript,currentlyAddingScript,mainScript,subPath,version="2.1.15",commentRegExp=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,cjsRequireRegExp=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,jsSuffixRegExp=/\.js$/,currDirRegExp=/^\.\//,op=Object.prototype,ostring=op.toString,hasOwn=op.hasOwnProperty,ap=Array.prototype,apsp=ap.splice,isBrowser=!("undefined"==typeof window||"undefined"==typeof navigator||!window.document),isWebWorker=!isBrowser&&"undefined"!=typeof importScripts,readyRegExp=isBrowser&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,defContextName="_",isOpera="undefined"!=typeof opera&&"[object Opera]"===opera.toString(),contexts={},cfg={},globalDefQueue=[],useInteractive=!1;if("undefined"==typeof define){if("undefined"!=typeof requirejs){if(isFunction(requirejs))return;cfg=requirejs,requirejs=void 0}"undefined"==typeof require||isFunction(require)||(cfg=require,require=void 0),req=requirejs=function(a,b,c,d){var e,f,g=defContextName;return isArray(a)||"string"==typeof a||(f=a,isArray(b)?(a=b,b=c,c=d):a=[]),f&&f.context&&(g=f.context),e=getOwn(contexts,g),e||(e=contexts[g]=req.s.newContext(g)),f&&e.configure(f),e.require(a,b,c)},req.config=function(a){return req(a)},req.nextTick="undefined"!=typeof setTimeout?function(a){setTimeout(a,4)}:function(a){a()},require||(require=req),req.version=version,req.jsExtRegExp=/^\/|:|\?|\.js$/,req.isBrowser=isBrowser,s=req.s={contexts:contexts,newContext:newContext},req({}),each(["toUrl","undef","defined","specified"],function(a){req[a]=function(){var b=contexts[defContextName];return b.require[a].apply(b,arguments)}}),isBrowser&&(head=s.head=document.getElementsByTagName("head")[0],baseElement=document.getElementsByTagName("base")[0],baseElement&&(head=s.head=baseElement.parentNode)),req.onError=defaultOnError,req.createNode=function(a){var d=a.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");return d.type=a.scriptType||"text/javascript",d.charset="utf-8",d.async=!0,d},req.load=function(a,b,c){var e,d=a&&a.config||{};if(isBrowser)return e=req.createNode(d,b,c),e.setAttribute("data-requirecontext",a.contextName),e.setAttribute("data-requiremodule",b),!e.attachEvent||e.attachEvent.toString&&e.attachEvent.toString().indexOf("[native code")<0||isOpera?(e.addEventListener("load",a.onScriptLoad,!1),e.addEventListener("error",a.onScriptError,!1)):(useInteractive=!0,e.attachEvent("onreadystatechange",a.onScriptLoad)),e.src=c,currentlyAddingScript=e,baseElement?head.insertBefore(e,baseElement):head.appendChild(e),currentlyAddingScript=null,e;if(isWebWorker)try{importScripts(c),a.completeLoad(b)}catch(f){a.onError(makeError("importscripts","importScripts failed for "+b+" at "+c,f,[b]))}},isBrowser&&!cfg.skipDataMain&&eachReverse(scripts(),function(a){return head||(head=a.parentNode),dataMain=a.getAttribute("data-main"),dataMain?(mainScript=dataMain,cfg.baseUrl||(src=mainScript.split("/"),mainScript=src.pop(),subPath=src.length?src.join("/")+"/":"./",cfg.baseUrl=subPath),mainScript=mainScript.replace(jsSuffixRegExp,""),req.jsExtRegExp.test(mainScript)&&(mainScript=dataMain),cfg.deps=cfg.deps?cfg.deps.concat(mainScript):[mainScript],!0):void 0}),define=function(a,b,c){var d,e;"string"!=typeof a&&(c=b,b=a,a=null),isArray(b)||(c=b,b=null),!b&&isFunction(c)&&(b=[],c.length&&(c.toString().replace(commentRegExp,"").replace(cjsRequireRegExp,function(a,c){b.push(c)}),b=(1===c.length?["require"]:["require","exports","module"]).concat(b))),useInteractive&&(d=currentlyAddingScript||getInteractiveScript(),d&&(a||(a=d.getAttribute("data-requiremodule")),e=contexts[d.getAttribute("data-requirecontext")])),(e?e.defQueue:globalDefQueue).push([a,b,c])},define.amd={jQuery:!0},req.exec=function(text){return eval(text)},req(cfg)}}(this);



// 默认情况下模块所在目录为起始目录
var baseUrl = '/common/js/';
require.config( {
    shim: {
        angular: {
            exports: 'angular'
        },
        "ngmodel.format": {
            deps : ['angular'],
            exports : 'ngmodelFormat'
        },
        "commonUtil":  ['jquery','jvalidator','FEUI'],
        "FEUI":  ['jquery']
    },
    paths: {
        "jquery": baseUrl + "inc/jquery.min",
        "angular": baseUrl + "framework/angular/angular.min",
        "ngmodel.format": baseUrl + "framework/angular/ngmodel.format",
        "jvalidator": baseUrl + "inc/jvalidator",// jq 表单验证
        "commonUtil": baseUrl + "util/commonUtil",
        "FEUI": baseUrl + "util/FEUI"// 自己的ui
    },
    urlArgs: "bust=" + (new Date()).getTime()  //TODO 防止读取缓存，调试阶段使用
} );