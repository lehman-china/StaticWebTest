require.config( {
    shim: {
        avalon: {
            exports: 'avalon'
        }
        // 为这个插件加入jquery
    },
    // 默认情况下模块所在目录为起始目录
    baseUrl: '/bioec/pages/common/js',
    paths: {
        "jquery": "inc/jquery-1.8.3",
        "avalon": "framework/avalon/avalon",
        "FEUI": "util/FEUI"// 自己的ui
    }
} );
require( [ "jquery", "avalon" ], function () {
    /**
     * *************************Service*************************
     */
    function Service() {
    }

    /**
     * 购物车主要的动作操作(删除,关注,结算) service
     */
    Service.main = function ( vm ) {
        /**
         * 从购物车中删除一个商品
         */
        vm.deleteCart = function ( merichantId, cartId ) {
            $.ajax( {
                url: "deleteCart.ajax",
                type: "post",
                data: {
                    cartId: cartId
                },
                success: function () {
                    var merchant = vm.merchantOfCarts[ merichantId + "" ];
                    // view 同步删除
                    delete merchant.carts.$model[ cartId + "" ];
                    merchant.carts = avalon.mix( {}, merchant.carts.$model );

                    var isDeleteMerchant = true;
                    avalon.each( merchant.carts.$model, function () {
                        isDeleteMerchant = false;
                    } );
                    // 商家下的产品,删除完后, 商家框也删掉
                    if ( isDeleteMerchant ) {
                        var merchants = avalon.mix( {}, vm.merchantOfCarts.$model );
                        delete merchants[ merichantId + "" ];
                        vm.merchantOfCarts = merchants;
                        vm.merchantCount--;
                    }
                    // 刷新头部购物车信息
                    vm.$fire( "down!refreshShopCart" );
                }
            } );
        };

        /**
         * Author:雷建军 Time：2014-7-1 11:54:46 添加商品到关注产品
         */
        vm.addInterestProduct = function ( event, shop ) {
            var params = {
                "bioecMerchantMaterials.bioecMaterial.materialId": shop.bioecMerchantMaterials.bioecMaterial.materialId
            };
            // 请求服务器，添加关注产品
            $.ajax( {
                url: "addInterestProduct.ajax",
                type: "post",
                dataType: "json",
                data: params,
                success: function ( result ) {
                    console.log( result )
                    switch ( result.state ) {
                        case "UN_LOGIN" :// 添加失败,要求登陆
                            openLoginBoxEx();
                            break;
                        case "exist" :
                            layer.tips( "<div style='height:40px;'>收藏错误!</div>", $( event.target ), {
                                guide: 0,
                                time: 4
                            } );
                            break;
                        default :
                            layer.tips( "<div style='height:40px;'>收藏完成!</div>", $( event.target ), {
                                guide: 0,
                                time: 4
                            } );
                            break;
                    }

                }
            } );
        };
        /**
         * ****************************2 结算操作
         * **********************************
         */
        /**
         * 打开与关闭购物车多商家的提示
         */
        vm.openShopTips = function ( merchant ) {
            var count = 0;
            avalon.each( vm.$model.merchantOfCarts, function () {
                count++;
            } );
            if ( count > 1 ) {
                merchant.isShopTipsShow = true;
            } else {
                merchant.loading.openShopTips = true;
                vm.settleAccounts( merchant.merchantId );
            }
        };
        vm.closeShopTips = function ( merchant ) {
            merchant.isShopTipsShow = false;
        };

        /**
         * XXX 结算
         *
         * @time 2014-8-25 14:46:00
         */
        vm.settleAccounts = function ( merchantCode ) {
            window.location.href = "fill_in_order.html?merchantCode=" + merchantCode;
            // TODO 先不提交时验证!
            //var merchant = vm.merchantOfCarts[ merchantId ];
            //var carts = merchant[ "carts" ].$model;
            //
            //var params = {
            //    merchantId: merchantId,
            //    carts: []
            //};
            //// 精简一下购物车carts集合
            //avalon.each( carts, function ( k, cart ) {
            //    var obj = {};
            //    obj.id = cart.id;
            //    obj.bookQty = cart.bookQty;
            //    obj.stockQty = cart.stockQty;
            //    obj.materialId = cart.id;
            //    params.carts.push( obj );
            //} );
            //params.carts = JSON.stringify( params.carts );
            //merchant.loading.settleAccounts = true;
            //$.ajax( {
            //    url: "checkShopStock.ajax",
            //    type: "post",
            //    dataType: "json",
            //    data: params,
            //    success: function ( result ) {
            //        console.log( result )
            //        merchant.loading.settleAccounts = false;
            //        if ( result.state == "failure" ) {
            //            openLoginBox();
            //        }
            //        var isPass = true;
            //        avalon.each( result.states, function ( k, state ) {
            //            console.log( state )
            //            var shop = carts[ state.shopId ];
            //            shop.stockQty = state.stockQty;
            //            shop.bookQty = state.bookQty;
            //            shop.stock = state.stock;
            //            if ( shop.bookQty > shop.stock ) {
            //                isPass = false;
            //            }
            //        } );
            //        // 全部通过检测,才跳转页面
            //        if ( isPass ) {
            //            window.location.href = "fill_in_order.html?merchantId=" + result.merchantId;
            //        } else {
            //            vm.closeShopTips( merchant );
            //        }
            //    }
            //} );
        };
    };

    /**
     * 货物数量调整控制sevice
     */
    Service.controlQuantity = function ( vm ) {
        // 库存验证延时时间
        var DELAYED_TIME = 500;
        /**
         * 购物车数量 自增自减
         */
        vm.bookQtyAdd = function ( shop ) {
            shop.bookQty++;
        };
        vm.bookQtySub = function ( shop ) {
            shop.bookQty--;
        };
        vm.fQuantityAdd = function ( shop ) {
            shop.stockQty++;
        };
        vm.fQuantitySub = function ( shop ) {
            shop.stockQty--;
        };

        /**
         * 是否有提示
         */
        vm.isHasTips = function ( merchantOfShop ) {
            var isPOO = false;
            // 如果有提示,则不能点击提交
            avalon.each( merchantOfShop.carts, function ( k, shop ) {
                isPOO = (shop.bookQty > shop.stock) ? true : isPOO;
            } );
            if ( isPOO )
                vm.closeShopTips( merchantOfShop );
            return isPOO;
        };

        /**
         * 初始化所有商品数量的监视,用于和后端同步数量
         */
        function initQuantityWatch() {
            for ( pKey in vm.$model.merchantOfCarts ) {
                var merchantOfShop = vm.merchantOfCarts[ pKey ];
                for ( key in merchantOfShop.carts.$model ) {
                    var shop = merchantOfShop.carts[ key ];
                    watchQuantity( shop );
                }
            }
        }

        vm.$id && initQuantityWatch();

        /**
         * 数量控制 监视(修改商品数量)
         */
        function watchQuantity( cart ) {
            var changeQuantityTimeOut = Util.TimeOut( 500, function () {
                changeCartQuantity( cart );
            } );
            cart.$watch( "bookQty", function () {
                var least = cart.stockQty > 0 ? "0" : "1";
                var value = cart.bookQty.toString();
                value = (value == "" || value == "0") ? least : value;
                cart.bookQty = parseInt( value.replace( /\D/g, '' ) );
                changeQuantityTimeOut();
                refreshInfo();
            } );
            cart.$watch( "stockQty", function () {
                var least = cart.bookQty > 0 ? "0" : "1";
                var value = cart.stockQty.toString();
                value = (value == "" || value == "0") ? least : value;
                cart.stockQty = parseInt( value.replace( /\D/g, '' ) );
                changeQuantityTimeOut();
                refreshInfo();
            } );
        };

        /**
         * 修改商品数量方法集,存放各个商品对应的方法.在规定时间内只执行一次操作,不能放在局部作用域里
         */
        /**
         * @description XXX 修改购物车数量
         */
        function changeCartQuantity( shop ) {
            var params = {
                id: shop.id,
                bookQty: shop.bookQty,
                stockQty: shop.stockQty
            };
            $.ajax( {
                url: "changeShopQuantity.ajax",
                type: "post",
                dataType: "json",
                data: params,
                success: function ( result ) {
                    shop.stock = result.stock;// 库存数量
                }
            } );
        }

        /**
         * 刷新购物车的数量,金额的统计信息
         */
        function refreshInfo() {
            for ( key in vm.$model.merchantOfCarts ) {
                var merchantOfShop = vm.merchantOfCarts[ key ];
                var sQuantity = 0, sPrice = 0;
                for ( sKey in merchantOfShop.carts.$model ) {
                    var shop = merchantOfShop.carts[ sKey ];
                    var bookQty = parseInt( shop.stockQty ) + parseInt( shop.bookQty )
                    sQuantity += bookQty;
                    sPrice += shop.price * bookQty;
                }
                merchantOfShop.countQuantity = sQuantity;
                merchantOfShop.countPrice = sPrice;
            }
        }

        /**
         * **************************2
         * 缺货提示,上的操作*********************************
         */
        /**
         * 缺货提示上的操作:否(不改为期货)
         */
        vm.tishiNo = function ( shop ) {
            // <不改为期货>,现货等于库存数量
            shop.bookQty = shop.stock;
            // <不改为期货>,清空期货数
            shop.stockQty = 0;
        };
        /**
         * 缺货提示上的操作:是(改为期货)
         */
        vm.tishiYes = function ( shop ) {
            // <改为期货>:变更为期货数量
            shop.stockQty = shop.bookQty;
            // <改为期货>:现货数量清空
            shop.bookQty = 0;
        };
        /**
         * 缺货提示上的操作:详细设置(同时设置现货和期货)
         */
        vm.tishiAllYes = function ( shop ) {
            // <详细设置>, 期货数=数量-库存数
            shop.stockQty = shop.bookQty - shop.stock;
            // <详细设置>,现货数=最大库存
            shop.bookQty = shop.stock;
        };

    };

    /**
     * *************************Util*************************
     */

    function Util() {
    }

    /**
     * @description:在规定时间内,只执行一次代码,避免短时间内重复执行(闭包TimeOut)
     * @return 例: var runTimeOut = Util.TimeOut(500,func);使用
     *         runTimeOut();
     */
    Util.TimeOut = function ( time, func ) {
        var index = null;
        return function () {
            index && clearTimeout( index )
            index = setTimeout( func, time );
        };
    }

    // ////////////////////////////////////
    // ////////控制器
    // ////////////////////////////////////////////////
    var shopCart = avalon.define( "shopCartController", shopCartController );

    function shopCartController( vm ) {
        vm.merchantCount = 0;
        vm.merchantOfCarts = g_var.merchantOfCarts;
        // 增加必要的属性声明
        avalon.each( g_var.merchantOfCarts, function ( k, merchant ) {
            merchant.loading = {// 独立于不同商家loading 开关
                settleAccounts: false
            };
            vm.merchantCount++;
            // 购物车提交提示
            merchant.isShopTipsShow = false;
        } );

        /**
         * 购物车主要的动作操作(删除,关注,结算) service
         */
        Service.main( vm );
        /**
         * 货物数量调整控制sevice
         */
        Service.controlQuantity( vm );
    }

    avalon.scan();
} );
