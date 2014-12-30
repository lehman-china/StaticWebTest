/**
 * *************************Util*************************
 */
function Util() {
}

/** ***********************************************其他方法************************************** */
/** *********************************************************************************************** */

/**
 * @author 雷建军:2014-7-24 17:36:35
 * @description 把普通的请求,变成post请求并提交.列url:http://www.baidu.com/baidu?tn=monline_5_dg&ie=utf-8&wd=电商
 */
Util.postSubmit = function( url ) {
	// 请求路径
	var action = url.substring( 0, url.indexOf( '?' ) );
	// url中的参数到param对象中
	var params = new Object();
	if ( url.indexOf( "?" ) != -1 ) {
		url = url.substring( url.indexOf( '?' ) + 1 ); // 获取url中"?"符后的字串
		strs = url.split( "&" );
		for ( var i = 0; i < strs.length; i++ ) {
			var property = strs[i].split( "=" );
			params[property[0]] = property[1];
		}
	}
	// 创建表单
	var temp = document.createElement( "form" );
	temp.action = action;
	temp.method = "post";
	temp.style.display = "none";
	// 参数加入表单中
	for ( var x in params ) {
		var opt = document.createElement( "textarea" );
		opt.name = x;
		opt.value = params[x];
		temp.appendChild( opt );
	}
	document.body.appendChild( temp );
	temp.submit();
}
/**
 * 获取url中的参数,静态页面之间的传值 request.getParameter("dataType");
 */
Util.request = {
	getParameter : function( val ) {
		var uri = window.location.search;
		var re = new RegExp( "" + val + "=([^&?]*)", "ig" );
		return ((uri.match( re )) ? (uri.match( re )[0].substr( val.length + 1 )) : null);
	}
};

/** ************************************************************************************ */

/**
 * @description:在规定时间内,只执行一次代码,避免短时间内重复执行(闭包TimeOut)
 * @return 例: var runTimeOut = Util.TimeOut(500,func);使用 runTimeOut();
 */
Util.TimeOut = function( time, func ) {
	var index = null;
	return function() {
		index && clearTimeout( index )
		index = setTimeout( func, time );
	};
}
/**
 * @description 引入一个js或者css
 * @param argument
 */
function importFile( file ) {
	if ( file.match( /.*\.js$/ ) ) { // 以任意开头但是以.js结尾正则表达式
		document.write( '<script type="text/javascript" src="' + file + '"></script>' );
	} else if ( file.match( /.*\.css$/ ) ) {
		document.write( '<link rel="stylesheet" href="' + file + '" type="text/css" />' );
	}
}

/**
 * ***********************************************模拟java的集合类map 和
 * list**************************************
 */
/** *********************************************************************************************** */
/**
 * js实现map
 */
var Map = function( map ) {
	this.objects = map || new Object();

	// 加入元素
	this.put = function( key, value ) {
		this.objects[key] = value;
	};

	// 删除元素
	this.remove = function( key ) {
		this.objects[key] = undefined;
	};

	// 是否存在某键值
	this.containsKey = function( key ) {
		return this.objects[key] ? true : false;
	};

	// 获取某元素
	this.get = function( key ) {
		return this.objects[key];
	};

	// 是否存在某值
	this.containsValue = function( value ) {
		for ( var temp in this.objects ) {
			if ( this.objects[temp] == value ) {
				return true;
			}
		}

		return false;
	};

	// Key数组,类似java.util.Map.keySet();
	this.keys = function() {
		var keys = new Array();
		for ( var prop in objects ) {
			keys.push( prop );
		}
		return keys;
	};
	// 清空
	this.clear = function() {
		objects = new Object();
	};
	// 集合大小
	this.size = function() {
		var counter = 0;
		for ( var temp in this.objects ) {
			counter++;
		}
		return counter;
	};
};

/**
 * js实现list
 */
var List = function() {
	this.value = [];
	/* 添加 */
	this.add = function( obj ) {
		return this.value.push( obj );
	};

	/* 大小 */
	this.size = function() {
		return this.value.length;
	};

	/* 返回指定索引的值 */
	this.get = function( index ) {
		return this.value[index];
	};

	/* 删除指定索引的值 */
	this.remove = function( index ) {
		this.value.splice( index, 1 );
		return this.value;
	};

	/* 删除全部值 */
	this.removeAll = function() {
		return this.value = [];
	};

	/* 是否包含某个对象 */
	this.constains = function( obj ) {
		for ( var i in this.value ) {
			if ( obj == this.value[i] ) {
				return true;
			} else {
				continue;
			}
		}
		return false;
	};

	/* 显示所有 */
	this.getAll = function() {
		var allInfos = '';
		for ( var i in this.value ) {
			if ( i != (value.length - 1) ) {
				allInfos += this.value[i] + ",";
			} else {
				allInfos += this.value[i];
			}
		}
		alert( allInfos );
		return allInfos += this.value[i] + ",";;
	};

}
