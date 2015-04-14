/**
 * *************************Util*************************
 */
var Util = Util || function () {
    };

/** ***********************************************其他方法************************************** */
/** *********************************************************************************************** */

/**
 * @author 雷建军:2014-7-24 17:36:35
 * @description 把普通的请求,变成post请求并提交.列url:http://www.baidu.com/baidu?tn=monline_5_dg&ie=utf-8&wd=电商
 */
Util.postSubmit = function ( url ) {
    // 请求路径
    var action = url.substring( 0, url.indexOf( '?' ) );
    // url中的参数到param对象中
    var params = new Object();
    if ( url.indexOf( "?" ) != -1 ) {
        url = url.substring( url.indexOf( '?' ) + 1 ); // 获取url中"?"符后的字串
        strs = url.split( "&" );
        for ( var i = 0; i < strs.length; i++ ) {
            var property = strs[ i ].split( "=" );
            params[ property[ 0 ] ] = property[ 1 ];
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
        opt.value = params[ x ];
        temp.appendChild( opt );
    }
    document.body.appendChild( temp );
    temp.submit();
}
/**
 * 获取url中的参数,静态页面之间的传值 request.getParameter("dataType");
 */
Util.request = {
    getParameter: function ( val ) {
        var uri = window.location.search;
        var re = new RegExp( "" + val + "=([^&?]*)", "ig" );
        return ((uri.match( re )) ? (uri.match( re )[ 0 ].substr( val.length + 1 )) : null);
    }
};

// 获得随机数
Util.getRandomNum = function ( Min, Max ) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round( Rand * Range ));
};
/** ************************************************************************************ */

/**
 * @description:在规定时间内,只执行一次代码,避免短时间内重复执行(闭包TimeOut)
 * @return 例: var runTimeOut = Util.TimeOut(500,func);使用 runTimeOut();
 */
Util.TimeOut = function ( time, func ) {
    var index = null;
    return function () {
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
 * 字符串替换模板,替换字符串中的字段. 例:var str = substitute('<li><em>规格</em>{spec}</li>',{spec:"100m"});
 * @param {String} str 模版字符串
 * @param {Object} o json data
 * @param {RegExp} [regexp] 匹配字符串的正则表达式
 */
Util.substitute = function ( str, o, regexp ) {
    return str.replace( regexp || /\\?\{([^{}]+)\}/g, function ( match, name ) {
        return (o[ name ] === undefined) ? '' : o[ name ];
    } );
};

/**
 * 为一组对象,加入属性.属性用object描述
 * @param array{Array}
 * @param addObj{object}
 */
Util.eachAddProperty = function ( array, addObj ) {
    for ( var i = 0; i < array.length; i++ ) {
        var obj = array[ i ];
        for ( var key in addObj ) {
            obj[ key ] = addObj[ key ];
        }
    }
};

// 全局分页对象
// varName $scope.page对象变量名称,默认为page
function createPage( $scope, varName ) {
    // 产品分页对象
    var page = {
        index: 1,
        showCount: 5,
        datas: null,
        maxPage: 1, //最大页
        count: 0,
        pageSql: null,//分页sql语句
        countSql: null//分页数据条数sql语句
    };
    // 翻页
    page.pPage = function () {
        if ( page.index > 1 ) {
            page.index--;
            page.queryPage();
        }
    };
    page.nPage = function () {
        if ( page.index < page.maxPage ) {
            page.index++;
            page.queryPage();
        }
    };

    //切换显示行数查询
    $scope.$watch( (varName || "page") + ".showCount", function ( current, old ) {
        if ( !current ) return;
        page.index = 1;
        page.queryPage();
    } );


    //查询分页
    page.queryPage = function () {
        if ( !page.pageSql || !page.countSql ) return;
        var index = page.index;
        var showCount = page.showCount;

        var limitInx = page.pageSql.indexOf( "LIMIT" );
        if ( limitInx > -1 )
            page.pageSql = page.pageSql.substring( 0, limitInx );

        page.pageSql += "  LIMIT " + ((index - 1) * showCount) + "," + showCount;

        var result = Util.query( page.countSql );
        page.count = result[ 0 ].count;
        page.maxPage = parseInt( page.count / page.showCount ) + ((page.count % page.showCount) ? 1 : 0);
        // 数据集
        page.datas = Util.query( page.pageSql );

    };
    return page;
}

//********************************sqlitl 封装
// 例: moBanTiHuan( "values(?,?,?,?,?)", [ '1', 2, 3, 4, '5' ] );
// 结果:values('1',2,3,4,'5')
Util.moBanTiHuan = function ( str, param ) {
    var inx = 0;
    str = str.replace( /\?/g, function () {
        var val = param[ inx++ ];
        if ( typeof(val) == 'undefined' ) val = null;
        if ( typeof(val) == 'string' )
            val = "'" + val + "'";
        return val;
    } );
    if ( inx != param.length )
        throw new Error( "参数和?数量不对应" );
    return str;
};
// 获得10位的时间戳
Util.getTime = function () {
    return parseInt( new Date().getTime() / 1000 );
};

// 同步的ajax
Util.syncAjax = function ( param ) {
    var result;
    $.ajax( {
        url: param.url,
        type: param.type || "post",
        async: false,
        timeout: param.timeout || 3000, //超时时间设置，单位毫秒
        complete: param.complete || function ( XMLHttpRequest, status ) { //请求完成后最终执行参数
            if ( status != 'success' ) {
                alert( status );
            }
        },
        data: param.data || {},
        dataType: param.dataType || "json",
        success: param.success || function ( res ) {
            result = res;
        }
    } );

    return result;
};


/**
 * jquery ajax的一点儿小包装
 * @param param jquery 一样的 对象参数, 不设置则包装方法默认的参数
 * @returns {{state: string}|*}
 */
Util.ajax = function ( param ) {
    $.ajax( {
        url: param.url,
        type: param.type || "post",
        timeout: param.timeout || 3000, //超时时间设置，单位毫秒
        complete: param.complete || function ( XMLHttpRequest, status ) { //请求完成后最终执行参数
            if ( status != 'success' ) {
                alert( status );
            }
        },
        data: param.data || {},
        dataType: param.dataType || "json",
        success: param.success || function ( res ) {
            if ( param.success ) param.success( res );
        }
    } );
};


/**
 *查询sql 例: query( "values(?,?,?,?,?)", [ '1', 2, 3, 4, '5' ] );
 * @param sql {string}
 * @param param {array}
 * @returns {array}
 */
Util.query = function ( sql, param ) {
    if ( param ) sql = Util.moBanTiHuan( sql, param );
    return Util.syncAjax( { url: "/query.ajax", data: { sql: sql } } );
};

/**
 * 执行sql 例:execute( "values(?,?,?,?,?)", [ '1', 2, 3, 4, '5' ] );
 * @param sql {string}
 * @param param {array}
 * @returns {array}
 */
Util.execute = function ( sql, param ) {
    if ( param ) sql = Util.moBanTiHuan( sql, param );
    return Util.syncAjax( { url: "/execute.ajax", data: { sql: sql } } );
};

// application 和 session
Util.application = function ( param ) {
    for ( var key in param ) {
        param[ key ] = JSON.stringify( param[ key ] );
    }
    return Util.syncAjax( { url: "/application.ajax", data: param } );
};
Util.session = function ( param ) {
    for ( var key in param ) {
        param[ key ] = JSON.stringify( param[ key ] );
    }
    return Util.syncAjax( { url: "/session.ajax", data: param } );
};

