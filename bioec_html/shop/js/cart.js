var g_var = g_var || {};

// 默认情况下模块所在目录为起始目录
var baseUrl = '/bioec_html/common/js/';
require.config( {
    shim : {
        avalon : {
            exports : 'avalon'
        }
    },
    paths : {
        "jquery" : baseUrl + "inc/jquery-1.8.3",
        "avalon" : baseUrl + "framework/avalon/avalon",
        "commonUtil" : baseUrl + "util/commonUtil",
        "FEUI" : baseUrl + "util/FEUI"// 自己的ui
    }
} );


/**
 * 一些初始化配置
 */
require( [ "avalon" ], function () {
    //添加一个自然数拦截器
    avalon.duplexHooks.natural_num = {
        get : function ( str, data ) {
            var num = str.toString().replace( /\D/g, '' );
            num = num == '' ? '0' : num;
            if ( data.element.value != num ) data.element.value = num;//不做判断会死递归
            return parseInt( num );
        }
    }

} );

require( [ "jquery", "avalon","commonUtil" ], function () {
    var cartVM = avalon.define( {
        $id : "cartCtrl",
        view : {},
        // 商品数量调整
        addQuantity : function ( product ) {
            product.quantity++;
        },
        subQuantity : function ( product ) {
            product.quantity--;
        },
        addFuturesQty : function ( product ) {
            product.futuresQty++;
        },
        subFuturesQty : function ( product ) {
            product.futuresQty--;
        },
        //切换购买勾选
        changeBuy : function ( product, target ) {
            product.isBuy = !product.isBuy;
            // 去除勾选提示
            $( target ).parents( ".repeat-merchants" ).find( ".reque" ).removeClass( "bored" );
            $( target ).parents( ".repeat-merchants" ).find( ".detmx" ).hide( "bored" );
        },
        //切换购买勾选,全选
        changeAllBuy : function ( merchant, isAllBuy, target ) {
            avalon.each( merchant.products, function ( k, v ) {
                v.isBuy = !isAllBuy;
            } );
            // 去除勾选提示
            $( target ).parents( ".repeat-merchants" ).find( ".reque" ).removeClass( "bored" );
            $( target ).parents( ".repeat-merchants" ).find( ".detmx" ).hide( "bored" );
        },
        //获得merchant下products勾选的数量
        getCheckNum : function ( merchant ) {
            var checkNum = 0;
            avalon.each( merchant.products, function ( k, v ) {
                if ( v.isBuy ) checkNum++;
            } );
            return checkNum;
        },
        //获得选中商品的合计金额
        getCheckMoney : function ( merchant ) {
            var tMoney = 0;
            avalon.each( merchant.products, function ( k, v ) {
                v.quantity + v.futuresQty;// avalon要预读一次,好让avalon感知数量变动
                if ( v.isBuy ) tMoney += (v.quantity + v.futuresQty) * v.fPrice;
            } );
            return tMoney;
        },
        //获得选中商品的总件数
        getCheckProductNum : function ( merchant ) {
            var allQty = 0;
            avalon.each( merchant.products, function ( k, v ) {
                v.quantity + v.futuresQty;// avalon要预读一次,好让avalon感知数量变动
                if ( v.isBuy ) allQty += (v.quantity + v.futuresQty);
            } );
            return allQty;
        },
        //判断是否全部勾选,
        isAllBuy : function ( merchant ) {
            return cartVM.getCheckNum( merchant ) == merchant.products.length;
        },
        //判断是否可以结算
        isPass : function ( merchant ) {
            var isPass = true;
            // 库存是否合法
            avalon.each( merchant.products, function ( k, v ) {
                v.quantity + v.futuresQty;// avalon要预读一次,好让avalon感知数量变动
                if ( v.isBuy ) isPass = v.quantity <= v.stock ? isPass : false;
            } );
            return isPass;
        },
        //未勾选点击结算,提示勾选
        jieSuanNull : function ( target ) {
            // 标红,提示勾选
            $( target ).parents( ".repeat-merchants" ).find( ".reque" ).addClass( "bored" );
            $( target ).parents( ".shop_unmn" ).find( ".detmx" ).show();
        }
    } );


    $.ajax( {
        url : "js/cartAjaxData/personalOrderA.json",
        type : "get",
        dataType : "json",
        success : function ( res ) {
            cartVM.view = res;
        }
    } );
    avalon.scan();
} )
;
