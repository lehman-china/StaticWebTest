define("mmRequest",["avalon","mmPromise"],function(avalon){var global=window,DOC=global.document,r20=/%20/g,rCRLF=/\r?\n/g,encode=encodeURIComponent,decode=decodeURIComponent,rheaders=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,rlocalProtocol=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,rnoContent=/^(?:GET|HEAD)$/,rquery=/\?/,rurl=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,curl=DOC.URL,segments=rurl.exec(curl.toLowerCase())||[],isLocal=rlocalProtocol.test(segments[1]),head=DOC.head||DOC.getElementsByTagName("head")[0],s=["XMLHttpRequest","ActiveXObject('Msxml2.XMLHTTP.6.0')","ActiveXObject('Msxml2.XMLHTTP.3.0')","ActiveXObject('Msxml2.XMLHTTP')"];if(!"1"[0]){s[0]=location.protocol==="file:"?"!":s[0]}for(var i=0,axo;axo=s[i++];){try{if(eval("new "+axo)){avalon.xhr=new Function("return new "+axo);break}}catch(e){}}var accepts={xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript",script:"text/javascript, application/javascript","*":["*/"]+["*"]},defaults={type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",async:true,jsonp:"callback"};function ajaxExtend(opts){opts=avalon.mix({},defaults,opts);if(typeof opts.crossDomain!=="boolean"){var parts=rurl.exec(opts.url.toLowerCase());opts.crossDomain=!!(parts&&(parts[1]!==segments[1]||parts[2]!==segments[2]||(parts[3]||(parts[1]==="http:"?80:443))!==(segments[3]||(segments[1]==="http:"?80:443))))}var querystring=typeof opts.data==="string"?opts.data:avalon.param(opts.data);opts.querystring=querystring||"";opts.url=opts.url.replace(/#.*$/,"").replace(/^\/\//,segments[1]+"//");opts.type=opts.type.toUpperCase();opts.hasContent=!rnoContent.test(opts.type);if(!opts.hasContent){if(querystring){opts.url+=(rquery.test(opts.url)?"&":"?")+querystring}if(opts.cache===false){opts.url+=(rquery.test(opts.url)?"&":"?")+"_time="+(new Date-0)}}return opts}function parseXML(data,xml,tmp){try{var mode=document.documentMode;if(window.DOMParser&&(!mode||mode>8)){tmp=new DOMParser();xml=tmp.parseFromString(data,"text/xml")}else{xml=new ActiveXObject("Microsoft.XMLDOM");xml.async="false";xml.loadXML(data)}}catch(e){xml=undefined}if(!xml||!xml.documentElement||xml.getElementsByTagName("parsererror").length){avalon.error("Invalid XML: "+data)}return xml}var head=document.getElementsByTagName("head")[0]||document.head;function parseJS(code){var indirect=eval;code=code.trim();if(code){if(code.indexOf("use strict")===1){var script=document.createElement("script");script.text=code;head.appendChild(script).parentNode.removeChild(script)}else{indirect(code)}}}avalon.ajax=function(opts,promise){if(!opts||!opts.url){avalon.error("参数必须为Object并且拥有url属性")}opts=ajaxExtend(opts);var XHRProperties={responseHeadersString:"",responseHeaders:{},requestHeaders:{},querystring:opts.querystring,readyState:0,uniqueID:setTimeout("1"),status:0};var _reject,_resolve;var promise=new Promise(function(resolve,reject){_resolve=resolve,_reject=reject});promise.options=opts;promise._reject=_reject;promise._resolve=_resolve;avalon.mix(promise,XHRProperties,XHRMethods);promise.then(opts.success,opts.error);"success error".replace(avalon.rword,function(name){delete opts[name]});var dataType=opts.dataType;var transports=avalon.ajaxTransports;if(dataType==="json"&&opts.type==="GET"&&opts.crossDomain){dataType=opts.dataType="jsonp"}var name=opts.form?"upload":dataType;var transport=transports[name]||transports.xhr;avalon.mix(promise,transport);if(promise.preproccess){dataType=promise.preproccess()||dataType}if(opts.contentType&&name!=="upload"){promise.setRequestHeader("Content-Type",opts.contentType)}promise.setRequestHeader("Accept",accepts[dataType]?accepts[dataType]+", */*; q=0.01":accepts["*"]);for(var i in opts.headers){promise.setRequestHeader(i,opts.headers[i])}if(opts.async&&opts.timeout>0){promise.timeoutID=setTimeout(function(){promise.abort("timeout")},opts.timeout)}promise.request();return promise};"get,post".replace(avalon.rword,function(method){avalon[method]=function(url,data,callback,type){if(typeof data==="function"){type=type||callback;callback=data;data=void 0}return avalon.ajax({type:method,url:url,data:data,success:callback,dataType:type})}});function isValidParamValue(val){var t=typeof val;return val==null||(t!=="object"&&t!=="function")}avalon.mix({ajaxTransports:{xhr:{request:function(){var self=this;var opts=this.options;avalon.log("XhrTransport.request.....");var transport=this.transport=new avalon.xhr;if(opts.crossDomain&&!("withCredentials" in transport)){avalon.error("本浏览器不支持crossdomain xhr")}if(opts.username){transport.open(opts.type,opts.url,opts.async,opts.username,opts.password)}else{transport.open(opts.type,opts.url,opts.async)}if(this.mimeType&&transport.overrideMimeType){transport.overrideMimeType(this.mimeType)}this.requestHeaders["X-Requested-With"]="XMLHttpRequest";for(var i in this.requestHeaders){transport.setRequestHeader(i,this.requestHeaders[i])}var dataType=this.options.dataType;if("responseType" in transport&&/^(blob|arraybuffer|text)$/.test(dataType)){transport.responseType=dataType;this.useResponseType=true}transport.send(opts.hasContent&&(this.formdata||this.querystring)||null);if(!opts.async||transport.readyState===4){this.respond()}else{if(transport.onerror===null){transport.onload=transport.onerror=function(e){this.readyState=4;this.status=e.type==="load"?200:500;self.respond()}}else{transport.onreadystatechange=function(){self.respond()}}}},respond:function(event,forceAbort){var transport=this.transport;if(!transport){return}try{var completed=transport.readyState===4;if(forceAbort||completed){transport.onreadystatechange=avalon.noop;if("onerror" in transport){transport.onerror=transport.onload=null}if(forceAbort){if(!completed&&typeof transport.abort==="function"){transport.abort()}}else{var status=transport.status;this.responseText=transport.responseText;try{var xml=transport.responseXML}catch(e){}if(this.useResponseType){this.response=transport.response}if(xml&&xml.documentElement){this.responseXML=xml}this.responseHeadersString=transport.getAllResponseHeaders();try{var statusText=transport.statusText}catch(e){this.error=e;statusText="firefoxAccessError"}if(!status&&isLocal&&!this.options.crossDomain){status=this.responseText?200:404}else{if(status===1223){status=204}}this.dispatch(status,statusText)}}}catch(err){if(!forceAbort){this.dispatch(500,err)}}}},jsonp:{preproccess:function(){var opts=this.options;var name=this.jsonpCallback=opts.jsonpCallback||"jsonp"+setTimeout("1");opts.url=opts.url+(rquery.test(opts.url)?"&":"?")+opts.jsonp+"=avalon."+name;avalon[name]=function(json){avalon[name]=json};return"script"}},script:{request:function(){var opts=this.options;var node=this.transport=DOC.createElement("script");avalon.log("ScriptTransport.sending.....");if(opts.charset){node.charset=opts.charset}var load=node.onerror===null;var self=this;node.onerror=node[load?"onload":"onreadystatechange"]=function(){self.respond()};node.src=opts.url;head.insertBefore(node,head.firstChild)},respond:function(event,forceAbort){var node=this.transport;if(!node){return}var execute=/loaded|complete|undefined/i.test(node.readyState);if(forceAbort||execute){node.onerror=node.onload=node.onreadystatechange=null;var parent=node.parentNode;if(parent){parent.removeChild(node)}if(!forceAbort){var args=typeof avalon[this.jsonpCallback]==="function"?[500,"error"]:[200,"success"];this.dispatch.apply(this,args)}}}},upload:{preproccess:function(){var opts=this.options;var formdata=new FormData(opts.form);avalon.each(opts.data,function(key,val){formdata.append(key,val)});this.formdata=formdata}}},ajaxConverters:{text:function(text){return text||""},xml:function(text,xml){return xml!==void 0?xml:parseXML(text)},html:function(text){return avalon.parseHTML(text)},json:function(text){if(!avalon.parseJSON){avalon.log("avalon.parseJSON不存在,请升级到最新版")}return avalon.parseJSON(text)},script:function(text){parseJS(text)},jsonp:function(){var json=avalon[this.jsonpCallback];delete avalon[this.jsonpCallback];return json}},getScript:function(url,callback){return avalon.get(url,null,callback,"script")},getJSON:function(url,data,callback){return avalon.get(url,data,callback,"json")},upload:function(url,form,data,callback,dataType){if(typeof data==="function"){dataType=callback;callback=data;data=void 0}return avalon.ajax({url:url,type:"post",dataType:dataType,form:form,data:data,success:callback})},param:function(json,bracket){if(!avalon.isPlainObject(json)){return""}bracket=typeof bracket==="boolean"?bracket:!0;var buf=[],key,val;for(key in json){if(json.hasOwnProperty(key)){val=json[key];key=encode(key);if(isValidParamValue(val)){buf.push(key,"=",encode(val+""),"&")}else{if(Array.isArray(val)&&val.length){for(var i=0,n=val.length;i<n;i++){if(isValidParamValue(val[i])){buf.push(key,(bracket?encode("[]"):""),"=",encode(val[i]+""),"&")}}}}}}buf.pop();return buf.join("").replace(r20,"+")},unparam:function(url,query){var json={};if(!url||!avalon.type(url)==="string"){return json}url=url.replace(/^[^?=]*\?/ig,"").split("#")[0];var pairs=url.split("&"),pair,key,val,i=0,len=pairs.length;for(;i<len;++i){pair=pairs[i].split("=");key=decode(pair[0]);try{val=decode(pair[1]||"")}catch(e){avalon.log(e+"decodeURIComponent error : "+pair[1],3);val=pair[1]||""}key=key.replace(/\[\]$/,"");var item=json[key];if(item===void 0){json[key]=val}else{if(Array.isArray(item)){item.push(val)}else{json[key]=[item,val]}}}return query?json[query]:json},serialize:function(form){var json={};Array.prototype.filter.call(form.getElementsByTagName("*"),function(el){return rinput.test(el.nodeName)&&el.name&&!el.disabled&&(rcheckbox.test(el.type)?el.checked:true)}).forEach(function(el){var val=avalon(el).val(),vs;val=Array.isArray(val)?val:[val];val=val.map(function(v){return v.replace(rCRLF,"\r\n")});vs=json[el.name]||(json[el.name]=[]);vs.push.apply(vs,val)});return avalon.param(json,false)}});var rinput=/select|input|button|textarea/i;var rcheckbox=/radio|checkbox/;var transports=avalon.ajaxTransports;avalon.mix(transports.jsonp,transports.script);avalon.mix(transports.upload,transports.xhr);var XHRMethods={setRequestHeader:function(name,value){this.requestHeaders[name]=value;return this},getAllResponseHeaders:function(){return this.readyState===4?this.responseHeadersString:null},getResponseHeader:function(name,match){if(this.readyState===4){while((match=rheaders.exec(this.responseHeadersString))){this.responseHeaders[match[1]]=match[2]}match=this.responseHeaders[name]}return match===undefined?null:match},overrideMimeType:function(type){this.mimeType=type;return this},abort:function(statusText){statusText=statusText||"abort";if(this.transport){this.respond(0,statusText)}return this},dispatch:function(status,nativeStatusText){var statusText=nativeStatusText;if(!this.transport){return}this.readyState=4;var isSuccess=status>=200&&status<300||status===304;if(isSuccess){if(status===204){statusText="nocontent"}else{if(status===304){statusText="notmodified"}else{if(typeof this.response==="undefined"){var dataType=this.options.dataType||this.options.mimeType;if(!dataType){dataType=this.getResponseHeader("Content-Type")||"";dataType=dataType.match(/json|xml|script|html/)||["text"];dataType=dataType[0]}try{this.response=avalon.ajaxConverters[dataType].call(this,this.responseText,this.responseXML)}catch(e){isSuccess=false;this.error=e;statusText="parsererror"}}}}}this.status=status;this.statusText=statusText+"";if(this.timeoutID){clearTimeout(this.timeoutID);delete this.timeoutID}this._transport=this.transport;if(isSuccess){this._resolve(this.response,statusText,this)}else{this._reject(this,statusText,this.error||statusText)}var completeFn=this.options.complete;if(typeof completeFn==="function"){completeFn.call(this,this,statusText)}delete this.transport}};if(!window.FormData){var str='Function BinaryToArray(binary)\r\n                 Dim oDic\r\n                 Set oDic = CreateObject("scripting.dictionary")\r\n                 length = LenB(binary) - 1\r\n                 For i = 1 To length\r\n                     oDic.add i, AscB(MidB(binary, i, 1))\r\n                 Next\r\n                 BinaryToArray = oDic.Items\r\n              End Function';execScript(str,"VBScript");avalon.fixAjax=function(){avalon.ajaxConverters.arraybuffer=function(){var body=this.tranport&&this.tranport.responseBody;if(body){return new VBArray(BinaryToArray(body)).toArray()}};function createIframe(ID){var iframe=avalon.parseHTML("<iframe  id='"+ID+"' name='"+ID+"' style='position:absolute;left:-9999px;top:-9999px;'/>").firstChild;return(DOC.body||DOC.documentElement).insertBefore(iframe,null)}function addDataToForm(form,data){var ret=[],d,isArray,vs,i,e;for(d in data){isArray=Array.isArray(data[d]);vs=isArray?data[d]:[data[d]];for(i=0;i<vs.length;i++){e=DOC.createElement("input");e.type="hidden";e.name=d;e.value=vs[i];form.appendChild(e);ret.push(e)}}return ret}avalon.ajaxTransports.upload={request:function(){var self=this;var opts=this.options;var ID="iframe-upload-"+this.uniqueID;var form=opts.form;var iframe=this.transport=createIframe(ID);var backups={target:form.target||"",action:form.action||"",enctype:form.enctype,method:form.method};var fields=opts.data?addDataToForm(form,opts.data):[];form.target=ID;form.action=opts.url;form.method="POST";form.enctype="multipart/form-data";avalon.log("iframe transport...");this.uploadcallback=avalon.bind(iframe,"load",function(event){self.respond(event)});form.submit();for(var i in backups){form[i]=backups[i]}fields.forEach(function(input){form.removeChild(input)})},respond:function(event){var node=this.transport,child;if(!node){return}if(event&&event.type==="load"){var doc=node.contentWindow.document;this.responseXML=doc;if(doc.body){this.responseText=doc.body.innerHTML;if((child=doc.body.firstChild)&&child.nodeName.toUpperCase()==="PRE"&&child.firstChild){this.responseText=child.firstChild.nodeValue}}this.dispatch(200,"success")}this.uploadcallback=avalon.unbind(node,"load",this.uploadcallback);delete this.uploadcallback;setTimeout(function(){node.parentNode.removeChild(node);avalon.log("iframe.parentNode.removeChild(iframe)")})}};delete avalon.fixAjax};avalon.fixAjax()}return avalon});
