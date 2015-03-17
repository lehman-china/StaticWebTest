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


//************************************jvalidator 验证表单*************
/**
 * 用于全局表单验证
 * class,vali_area标志提示区域,
 * data-jvalidator-publ_vali="requi[请添加产品]" 标识元素
 *
 *  <!-- 验证angular变量用-->
 *  <input type="hidden" ng-value="form.products.length?'1':''" data-jvalidator-publ_vali="requi[请添加产品]"/>
 */
Util.publicValiForm = (function () {
    /**
     * @description 移除验证样式
     * @param {element} el
     */
    function removeStyle( $el ) {
        $el.closest( ".vali_area" ).removeClass( "prompt" );
        if ( $el[ 0 ].tips ) {
            $el[ 0 ].tips.close();// 关闭气泡
            $el[ 0 ].tips = null;
        }
    }


    /**
     * @description 设置验证样式
     * @param {boolean} isPass 是否通过验证
     * @param {element}  el 元素
     * @param {Object} errors 验证组建的对象.data.getMessage()获得错误提示
     */
    function authStyle( isPass, $el, errors ) {
        removeStyle( $el );// 1 先移除验证的样式
        var $valiArea = $el.closest( ".vali_area" );
        if ( isPass ) {

        } else {
            $valiArea.addClass( "prompt" );
            $el[ 0 ].tips = FEUI.tips( { html: errors.getMessage(), follow: $valiArea[ 0 ] } );
            //   $el.closest( "span" ).after( "<div class='error_text'>" + errors.getMessage() + "</div>" );
        }
    }

    // 添加自定义验证
    function addVali( jv ) {
        //不能为空,自定义提示语
        jv.addPattern( 'requi', {
            argument: true,
            message: '%argu',
            validate: function ( value, done ) {
                done( !!value );
            }
        } );
    }

    /**
     * 表单验证
     * @param {string} formSelector  // 验证局域,元素选择器
     * @param {string} submitSelector// 提交元素选择器
     * @param {function} resultFunc// 验证回调
     * @returns {JValidator}
     */
    function init( formSelector, submitSelector, resultFunc ) {
        var $formSelector = $( formSelector );
        var jv = new JValidator( $formSelector );
        addVali( jv ); // 添加自定义验证
        $( submitSelector ).click( function () {// 提交按钮验证全部
            jv.validateAll( function ( isPass ) {
                // 如果有错误,则滚动到错误区域
                try {
                    // 页面滚动到错误区域
                    $( "html,body" ).animate( {
                        scrollTop: $( ".prompt:visible:eq(0)" ).offset().top - 120
                    }, 200 );
                } catch ( e ) {
                }
                resultFunc( isPass );
            } );
        } );
        jv.setContinueCheck( false );// 遇到错误不继续向下验证
        jv.when( [ 'blur' ] );//离开事件验证自身

        jv.success( function ( $event ) {
            authStyle( true, $( this.element ) );
        } );
        jv.fail( function ( $event, errors ) {
            authStyle( false, $( this.element ), errors );
        } );
        return jv;
    }

    return init;
})();


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
Util.syncAjax = function ( url, data ) {
    var result;
    $.ajax( {
        url: url,
        type: "post",
        async: false,
        timeout: 3000, //超时时间设置，单位毫秒
        complete: function ( XMLHttpRequest, status ) { //请求完成后最终执行参数
            if ( status == 'timeout' ) {//超时,status还有success,error等值的情况
                result = { state: "超时,time out" };
                console.error( "超时,time out" );
            }
        },
        data: data,
        dataType: "json",
        success: function ( res ) {
            result = res;
        }
    } );
    return result;
};

/**
 *查询sql 例: query( "values(?,?,?,?,?)", [ '1', 2, 3, 4, '5' ] );
 * @param sql {string}
 * @param parem {array}
 * @returns {array}
 */
Util.query = function ( sql, parem ) {
    if ( parem ) sql = Util.moBanTiHuan( sql, parem );
    return Util.syncAjax( "/query.ajax", { sql: sql } );
};

/**
 * 执行sql 例:execute( "values(?,?,?,?,?)", [ '1', 2, 3, 4, '5' ] );
 * @param sql {string}
 * @param parem {array}
 * @returns {array}
 */
Util.execute = function ( sql, parem ) {
    if ( parem ) sql = Util.moBanTiHuan( sql, parem );
    return Util.syncAjax( "/execute.ajax", { sql: sql } );
};

// application 和 session
Util.application = function ( parem ) {
    return Util.syncAjax( "/application.ajax", parem || {} );
};
Util.session = function ( parem ) {
    return Util.syncAjax( "/session.ajax", parem || {} );
};

