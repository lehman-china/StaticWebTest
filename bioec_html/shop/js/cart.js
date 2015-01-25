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

require( [ "jquery", "avalon", "commonUtil" ,"FEUI"], function () {
    var cartVM = avalon.define( {
        $id : "cartCtrl",
        view : { merchants : [ { products : [ {} ] } ] },
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
        //删除购物车
        delCartProduct : function ( merchanInx, productInx ) {
            function yesDel() {
                var products = cartVM.view.merchants[ merchanInx ].products;
                var product = products[ productInx ];
                $.ajax( {
                    url : "js/cartAjaxData/actionSuccess.json?id=" + product.id,
                    type : "get",
                    dataType : "json",
                    success : function ( res ) {
                        if ( res.state = "SUCCESS" ) {
                            console.log( products.$model.length );
                            // 删除之前标记删除产品
                            (function ( products ) {
                                for ( var i = 0, len = products.$model.length; i < len; i++ ) {
                                    console.log( products[ i ].isDel );
                                    if ( products[ i ].isDel ) {
                                        products.splice( i, 1 );
                                        return arguments.callee( products );
                                    }
                                }
                            })( products );
                            product.isDel = true;
                            // 如果一个商家下所有商品被删除则移除商家栏
                            if ( products.length == 0 ) {
                                cartVM.view.merchants.splice( merchanInx, 1 );
                            }
                        }
                    }
                } );
            }
            console.log(FEUI)
            FEUI.layer( {
                html : "确定要删除该商品吗?",
                yes : yesDel
            } );

        },
        //撤销删除
        repealDel : function ( product ) {
            $.ajax( {
                url : "js/cartAjaxData/actionSuccess.json?id=" + product.id,
                type : "get",
                dataType : "json",
                success : function ( res ) {
                    if ( res.state = "SUCCESS" ) {
                        product.isDel = false;
                    }
                }
            } );
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
                v.isBuy + v.isDel;
                if ( v.isBuy && !v.isDel ) checkNum++;
            } );
            return checkNum;
        },
        //获得选中商品的合计金额
        getCheckMoney : function ( merchant ) {
            var tMoney = 0;
            avalon.each( merchant.products, function ( k, v ) {
                v.isDel + v.quantity + v.futuresQty;// avalon要预读一次,好让avalon感知数量变动
                if ( v.isBuy && !v.isDel ) tMoney += (v.quantity + v.futuresQty) * v.fPrice;
            } );
            return tMoney;
        },
        //获得选中商品的总件数
        getCheckProductNum : function ( merchant ) {
            var allQty = 0;
            avalon.each( merchant.products, function ( k, v ) {
                v.isDel + v.quantity + v.futuresQty;// avalon要预读一次,好让avalon感知数量变动
                if ( v.isBuy && !v.isDel ) allQty += (v.quantity + v.futuresQty);
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
            avalon.each( merchant.products, function ( k, v ) {
                v.quantity + v.futuresQty;// avalon要预读一次,好让avalon感知数量变动
                // 库存是否合法
                if ( v.isBuy ) isPass = v.quantity <= v.stock ? isPass : false;
                // 数量不能为0
                if ( v.isBuy ) isPass = (v.quantity + v.futuresQty) > 0 ? isPass : false;
            } );
            return isPass;
        },
        //未勾选点击结算,提示勾选
        jieSuanNull : function ( target ) {
            // 标红,提示勾选
            $( target ).parents( ".repeat-merchants" ).find( ".reque" ).addClass( "bored" );
            $( target ).parents( ".shop_unmn" ).find( ".detmx" ).show();
        },
        // 去结算
        jieSuan : function ( merchant ) {
            // TODO 模拟锁定库存,如果锁定失败,则不能去结算
            queryStock( function () {
                if ( cartVM.isPass( merchant ) ) {
                    location.href = "/bioec_html/shop/fill.html";
                } else {
                    alert( "请检查库存~" );
                }
            } );
        }
    } );

    // 初始化(调整数量,同步勾选)
    function checkWatch() {
        avalon.each( cartVM.view.merchants, function ( k, merchant ) {
            avalon.each( merchant.products, function ( k, product ) {
                product.$watch( "quantity", function () {
                    product.isBuy = (product.quantity + product.futuresQty) > 0;
                } );
                product.$watch( "futuresQty", function () {
                    product.isBuy = (product.quantity + product.futuresQty) > 0;
                } );
            } );
        } );
    }

    var actionName = Util.request.getParameter( "action" );
    actionName = !!actionName ? actionName : "unitOrderA";
    // TODO 模拟数据
    $.ajax( {
        url : "js/cartAjaxData/" + actionName + ".json",
        type : "get",
        dataType : "json",
        success : function ( res ) {
            cartVM.view = res;
            // 模拟查询库存
            queryStock();
            checkWatch();// 初始化(调整数量,同步勾选)
        }
    } );
    // TODO 模拟查询库存
    function queryStock( backCall ) {
        $.ajax( {
            url : "js/cartAjaxData/stock.json",
            type : "get",
            dataType : "json",
            success : function ( res ) {
                avalon.each( cartVM.view.merchants, function ( k, merchant ) {
                    avalon.each( merchant.products, function ( k, product ) {
                        product.stock = res[ product.id ].stock;
                    } );
                } );
                backCall && backCall();//回调
            }
        } );
    }

    avalon.scan();
} )
;
