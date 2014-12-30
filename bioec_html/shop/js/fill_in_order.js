/**
 * @type {g_var|*}
 */
var g_var = !!g_var ? g_var : {};
/**
 * @description 订单师视图数据
 * @memberOf g_var
 * @type {{merchant: {id: string, code: string, name: string, mobile: string, telephone: string, addr: string}, personal: {name: string, mobile: string}, products: {id: number, isSoldOut: number, isConfirmSoldOut: number, name: string, sn: string, spec: string, price: number, quantity: number, futuresQty: number, stock: number}[], addrs: {id: number, name: string, addr: string, mobile: string, telephone: string}[], units: {id: number, name: string, groups: {id: number, name: string}[]}[], invoices: {id: number, invoiceType: number, title: string, taxNo: string, registerBank: string, bankAccount: string}[]}}
 */
g_var.orderView = {
    merchant: {// 经销商
        id: "1",
        code: "SZDKW",
        name: "深圳达科为生物科技有限公司",
        mobile: "13632879450",
        telephone: "0731-86541769",
        addr: "深圳南山区沿山路佳利泰大厦"
    },
    personal: {//个人信息
        name: "雷建军",
        mobile: "13266720440"
    },
    products: [//产品集
        {
            id: 1,
            isSoldOut: 0,
            isConfirmSoldOut: 0,
            name: "cd1",
            sn: "007",
            spec: "200m",
            price: 560,
            quantity: 7,
            futuresQty: 1,
            stock: 4//库存
        },
        {
            id: 2,
            isSoldOut: 0,
            isConfirmSoldOut: 0,
            name: "cd3",
            sn: "002",
            spec: "100m",
            price: 500,
            quantity: 3,
            futuresQty: 0,
            stock: 4//库存
        },
        {
            id: 3,
            isSoldOut: 1,
            isConfirmSoldOut: 0,
            name: "cd19",
            sn: "005",
            spec: "400m",
            price: 200,
            quantity: 2,
            futuresQty: 1,
            stock: 4//库存
        }
    ],
    addrs: [//收货地址集
        { id: 1, name: "刘德华", addr: "中国香港九龙92区", mobile: "10086", telephone: "0731-86541769" },
        { id: 2, name: "张学友", addr: "中国香港旺角12区", mobile: "13266720440", telephone: "0731-86541712" },
        { id: 3, name: "郭富城", addr: "中国香港洪兴11区", mobile: "13266720440", telephone: "0731-86541755" } ],
    units: [ {//单位集,(订购组集)
        id: 1, name: "北京航空航天大学", groups: [ { id: 1, name: '产品小组' }, { id: 2, name: '研发小组' } ]
    }, {
        id: 2, name: "长沙县想呀医院", groups: [ { id: 3, name: '外科小组' }, { id: 4, name: '神经科小组' } ]
    }, {
        id: 3, name: "深圳第一人民医院", groups: [ { id: 5, name: '骨科小组' }, { id: 6, name: '内科小组' } ]
    } ],
    invoices: [ {//发票集
        id: 1,
        invoiceType: 1,
        title: '长沙湘雅研究组',
        taxNo: "1001",
        registerBank: "中国银行",
        bankAccount: "222 555 131 222"
    },
        { id: 2, invoiceType: 0, title: '深圳大学', taxNo: "1003", registerBank: "建设银行", bankAccount: "222 555 141 222" },
        { id: 3, invoiceType: 1, title: '湖南大学', taxNo: "1005", registerBank: "工商银行", bankAccount: "222 555 151 222" }
    ]
};

// 为单位增加,待定,和新增选项
for ( var k in g_var.orderView.units ) {
    var unit = g_var.orderView.units[ k ];
    unit.groups.push( { id: 0, name: "待定", newName: "" } );
    unit.groups.push( { id: -1, name: "新增", newName: "" } );
}
/**
 * @type {string} baseUrl='/bioec_html/common/js/'
 */
require.config( {
    // 默认情况下模块所在目录为起始目录
    baseUrl: '/bioec_html/common/js',
    shim: {
        avalon: {
            exports: 'avalon'
        },
        "jquery.idTabs": [ "jquery" ], // 为这个插件加入jquery
        "jvalidator": [ "jquery" ] // 为这个插件加入jquery
    },
    paths: {
        "jquery": "" + "inc/jquery-1.8.3",
        "avalon": "" + "framework/avalon/avalon",
        "jquery.idTabs": "" + "inc/jquery.idTabs",
        "FEUI": "" + "util/FEUI",
        "jvalidator": "" + "inc/jvalidator.min"
    }
} );

require( [ "jquery", "jvalidator", "avalon", "FEUI" ], function () {
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

    /**
     * 订单信息常量
     */
    var constant = {
        // 付款类型
        PAY_METHOD: [ {
            id: 0,
            value: '发货前付清全部货款'
        }, {
            id: 1,
            value: '发货后30天内付清货款'
        }, {
            id: 2,
            value: '订货时预付30%货款，发货前付清余款'
        }, {
            id: 3,
            value: '订货时预付50%货款，发货前付清余款'
        }, {
            id: 4,
            value: '订货时预付全款'
        } ],
        // 配送方式
        SHIPPING_METHOD: [ {
            id: 0,
            value: '现货、期货一起配送'
        }, {
            id: 1,
            value: '先配送现货'
        } ],
        // 发票信息选项
        INVOICE_METHOD: [ {
            id: 0,
            value: '开发票'
        }, {
            id: 1,
            value: '不开发票'
        }, {
            id: 2,
            value: '暂不开发票'
        } ],
        // 发票类型
        INVOICE_TYPES: [ {
            id: 0,
            value: '普通发票'
        }, {
            id: 1,
            value: '17%增值谁发票'
        } ]
    };


    // ////////////////////////////////////////////
    // //////////控制器在最底部
    // //////////////////////////////////////////////

    /**
     * XXX 1 控制器
     */
    var fillOrderCtrl = avalon.define( "fillOrderCtrl", function ( vm ) {
        /**订单信息常量
         * @memberOf fillOrderCtrl
         * @type {{PAY_METHOD: {id: number, value: string}[], SHIPPING_METHOD: {id: number, value: string}[], INVOICE_METHOD: {id: number, value: string}[], INVOICE_TYPES: {id: number, value: string}[]}}
         */
        vm.constant = constant;
        /**
         * @type {{merchant: {id: string, code: string, name: string, mobile: string, telephone: string, addr: string}, personal: {name: string, mobile: string}, products: {id: number, isSoldOut: number, isConfirmSoldOut: number, name: string, sn: string, spec: string, price: number, quantity: number, futuresQty: number, stock: number}[], addrs: {id: number, name: string, addr: string, mobile: string, telephone: string}[], units: {id: number, name: string, groups: {id: number, name: string}[]}[], invoices: {id: number, invoiceType: number, title: string, taxNo: string, registerBank: string, bankAccount: string}[]}}
         */
        vm.orderView = g_var.orderView;
        /**
         * @memberOf fillOrderCtrl
         * @type {{isOrderGroup: boolean, isPassAuth: boolean, unit: {id: null, name: string, group: {id: number, name: string}}, deliverMethod: null, isUrgent: Array, orderRemark: string, addr: {id: null, name: string, addr: string, mobile: string, telephone: string}, invoice: {id: null, invoiceMethod: null, typeId: number, invoiceType: string, title: string, taxNo: string, registerBank: string, bankAccount: string, invoiceNeedCombine: null, invoiceLimit: null, invoiceLimitAmount: null}}}
         */
        vm.orderInfo = {
            isOrderGroup: true,// 是否是订购小组
            isPassAuth: true,//是否通过验证,商品,缺货,下降等
            unit: {//单位
                id: null, name: "单位",
                group: { id: 1, name: '小组' }
            },
            deliverMethod: null,// 配送方式
            isUrgent: [],//是否加急
            orderRemark: "", // 订单备注
            addr: { id: null, name: "", addr: "", mobile: "", telephone: "" },//收货信息
            invoice: {//发票信息
                id: null,// 发票抬头ID
                invoiceMethod: null,// 发票信息选择,开与不开发票
                typeId: 0,
                invoiceType: "",//发票类型
                title: "",//发票抬头
                taxNo: "",//识别号
                registerBank: "",//开户银行
                bankAccount: "",//开户帐号
                invoiceNeedCombine: null,// 发票是否合开
                invoiceLimit: null,// 是否限制金额
                invoiceLimitAmount: null// 限制金额
            }
        };

        /**
         * 切换订购方式(小组,个人切换)
         */
        vm.chengeOrderMethod = function () {
            vm.orderInfo.isOrderGroup = !vm.orderInfo.isOrderGroup;
            // 切换后.点击dom,切换一下
            var tab = vm.orderInfo.isOrderGroup ? '#tab1' : '#tab2';
            $( "a[href=" + tab + "]" ).mousedown();//切换
        };
        /**
         * @description 选择小组
         * @param {string} unitGroupId :5,3 单位id,小组id
         */
        vm.chooseGroup = function ( unitGroupId ) {
            console.log( unitGroupId );
            var ids = unitGroupId.split( ',' );
            var unit = null;
            $.each( vm.$model.orderView.units, function ( k, v ) {
                if ( v.id == ids[ 0 ] ) unit = v;
            } );
            var group = null;
            $.each( unit.groups, function ( k, v ) {
                if ( v.id == ids[ 1 ] ) group = v;
            } );
            $.extend( vm.orderInfo.unit, unit, { group: group } );
            delete vm.orderInfo.unit.groups;
        };
        /**
         * 选择发票
         */
        vm.chooseInvoice = function ( invoice ) {
            $.extend( vm.orderInfo.invoice, invoice.$model );
        };
        /**
         * 重新选择发票
         */
        vm.reChooseInvoice = function () {
            vm.orderInfo.invoice.id = null;
        };

        /**
         * 弹出预览订单层
         */
        vm.orderPreviewLayerOO = false;
        /**
         * 关闭预览订单层
         */
        vm.closeOrderPreviewLayer = function () {
            vm.orderPreviewLayerOO = false;
        };

        /**
         * --------------------------验证模块分割线-------------------------------
         */

            // 为真的验证,自定义验证 own[param]  参数则是提示语
        $.jvalidator.addPattern( 'own', {
            argument: true,
            message: '%argu',
            validate: function ( value, done ) {
                console.log( "own: " + value + ",typeof:" + typeof(value) )
                done( !!value );
            }
        } );
        // 选择发票后为真的验证,自定义验证 own[param]  参数则是提示语
        $.jvalidator.addPattern( 'invoice_own', {
            argument: true,
            message: '%argu',
            validate: function ( value, done ) {
                console.log( "own: " + value + ",,,typeof:" + typeof(value) )
                done( vm.orderInfo.invoice.invoiceType == 0 || !!value );
            }
        } );
        /**
         * @description 移除验证样式
         * @param {element) el
         */
        function removeStyle( el ) {
            var $el = $( el );
            var $shopMainC = $el.parents( ".shop_main_c" );
            $shopMainC.removeClass( "yellow_border" );
            $shopMainC.find( ".error" ).remove();
        }

        /**
         * @description 设置验证样式
         * @param {boolean} isPass 是否通过验证
         * @param {element}  el 元素
         * @param {Object} errors 验证组建的对象.data.getMessage()获得错误提示
         */
        function authStyle( isPass, el, errors ) {
            console.log( "验证:" + isPass )
            var $el = $( el );
            removeStyle( el );// 1 先移除验证的样式
            if ( isPass ) {
            } else {
                console.log( errors.getMessage() )
                var $shopMainC = $el.parents( ".shop_main_c" );
                $shopMainC.addClass( "yellow_border" );
                console.log( $shopMainC )
                $shopMainC.prepend( "<div class='error'>" + errors.getMessage() + "</div>" );
            }
        }

        /**
         * @description 表单验证的初始化
         * @returns {jvalidator}
         */
        function initForm() {
            var $orderForm = $( "#order_form" );
            var jv = $orderForm.jvalidator();
            // 全部验证
            function validateAll() {
                jv.validateAll( function ( result, elements ) {
                    if ( result ) {
                        vm.orderPreviewLayerOO = true;//打开预览层

                    } else {
                        var msg = [ '验证未通过.' ]
                        for ( var i = 0; i < elements.length; i++ ) {
                            msg.push( elements[ i ].getMessage() )
                        }
                        // 如果有错误,则滚动到错误区域
                        setTimeout( function () {
                            // 页面滚动到错误区域
                            $( "html,body" ).animate( {
                                scrollTop: $( ".yellow_border:visible :eq(0)" ).offset().top - 120
                            }, 200 );
                        }, 25 );
                    }
                } );
            }

            $orderForm.find( '.success_btn1' ).on( 'click', validateAll );

            jv.when( [ 'click' ] );

            jv.success( function ( $event ) {
                authStyle( true, this.element );
            } );

            jv.fail( function ( $event, errors ) {
                authStyle( false, this.element, errors );
            } );
            return jv;
        }

        //初始化表单验证
        $( function () {
            initForm();
        } );
    } );

    /**
     * 收货地址功能模块
     */
    var addrCtrl = avalon.define( "addrCtrl", function ( vm ) {
        var _this = this;
        /**
         * 修改地址层开关
         * @type {boolean}
         */
        vm.changeAddrOO = false;

        /**
         * @memberOf addrCtrl
         * @type {{id: number, name: string, addr: string, mobile: string}[]|Array}
         */
        vm.addrs = fillOrderCtrl.orderView.addrs.$model;

        /**
         * @description  使用收货地址
         * @memberOf addrCtrl
         * @type {{id: number, name: string, addr: string, mobile: string,telephone:string}|*}
         */
        vm.useAddr = fillOrderCtrl.orderInfo.addr;
        /**
         * @description  收货地址缓存,用于修改地址,新增地址时的缓冲.
         * @memberOf addrCtrl
         * @type {{id: number, name: string, addr: string, mobile: string,telephone:string}|*}
         */
        vm.addrCache = { id: -1, name: "", addr: "", mobile: "", telephone: "" };
        /**
         * @description  选择收货地址收货地址
         * @memberOf addrCtrl
         * @type {function()}
         */
        vm.chooseAddr = function ( addr ) {
            $.extend( vm.useAddr, addr.$model );
            $( ".success_btn1:eq(0)" ).click();
        };
        /**
         * @description  修改地址层开关
         * @type {function(Object,Number)}
         */
        vm.openChangeAddr = function ( addr, $index ) {
            vm.changeAddrOO = true;
            vm.addrCache = $.extend( { $index: $index }, addr.$model );
        };
        vm.closeChangeAddr = function () {
            vm.changeAddrOO = false;
        };
        /**
         * 修改地址
         */
        vm.changeAddr = function () {
            // 数据修改
            var index = vm.addrCache.$index;
            delete vm.$model.addrCache.$index;
            vm.addrs.splice( index, 1, vm.$model.addrCache );
            vm.closeChangeAddr();
        };

        vm.openAddAddr = function () {
            vm.addrCache = { id: -1, name: "", addr: "", mobile: "", telephone: "" };
        };

        vm.addAddr = function () {
            $.extend( vm.useAddr, vm.$model.addrCache );
        };

        /**
         * @description  选择收货地址收货地址
         * @memberOf addrCtrl
         * @type {function()}
         */
        vm.reChooseAddr = function () {
            vm.useAddr.id = null;
            $( "a[href=#tab1],a[href=#tab2]" ).filter( ":visible" ).mousedown();
        };


        /**
         * *******************************************个人订购操作
         */
        vm.choosePersAddrOO = false;
        vm.closeChoosePersAddr = function () {
            vm.choosePersAddrOO = false;
        };
        // 打开个人地址
        vm.openChoosePersAddr = function ( addr ) {
            vm.choosePersAddrOO = true;
            $.extend( vm.addrCache, addr.$model );
        };
        // 确定选择个人地址
        vm.choosePersAddr = function () {
            vm.choosePersAddrOO = false;
            $.extend( vm.useAddr, vm.$model.addrCache );
        };

        /**
         * 验证模块
         */
        ///**
        // * @description 移除验证样式
        // * @param {element} el
        // */
        //function removeStyle( el ) {
        //    var $el = $( el );
        //    $el.nextAll( ".error" ).remove();
        //}
        //
        ///**
        // * @description 设置验证样式
        // * @param {boolean} isPass 是否通过验证
        // * @param {element}  el 元素
        // * @param {Object} errors 验证组建的对象.data.getMessage()获得错误提示
        // */
        //function authStyle( isPass, el, errors ) {
        //    console.log( "验证:" + isPass )
        //    console.log( el )
        //    var $el = $( el );
        //    removeStyle( el );// 1 先移除验证的样式
        //    if ( isPass ) {
        //        $el.css( "border", "1px  solid #D5D5D5" );
        //    } else {
        //        console.log( errors.getMessage() )
        //        $el.css( "border", "1px  solid red" );
        //        $el.after( "<span class='error'>" + errors.getMessage() + "</span>" );
        //    }
        //}
        //
        ///**
        // * @description 表单验证的初始化
        // * @returns {jvalidator}
        // */
        //function initForm() {
        //    var $orderForm = $( "#addr_form" );
        //    var jv = $orderForm.jvalidator();
        //    // 全部验证
        //    function validateAll() {
        //        jv.validateAll( function ( result, elements ) {
        //            if ( result ) {
        //
        //
        //            } else {
        //                var msg = [ '验证未通过.' ]
        //                for ( var i = 0; i < elements.length; i++ ) {
        //                    msg.push( elements[ i ].getMessage() )
        //                }
        //            }
        //        } );
        //    }
        //
        //    $orderForm.find( '.company_btn' ).on( 'click', validateAll );
        //
        //    jv.when( [ 'click' ] );
        //
        //    jv.success( function ( $event ) {
        //        authStyle( true, this.element );
        //    } );
        //
        //    jv.fail( function ( $event, errors ) {
        //        authStyle( false, this.element, errors );
        //    } );
        //    return jv;
        //}
        //
        ////初始化表单验证
        //$( function () {
        //    initForm();
        //} );
    } );

    /**
     * 预览订单部分
     */
    var orderPreviewCtrl = avalon.define( "orderPreviewCtrl", function ( vm ) {
        /**
         * @memberOf orderPreviewCtrl
         * @type {{id: number, isSoldOut: number, isConfirmSoldOut: number, name: string, sn: string, spec: string, price: number, quantity: number, futuresQty: number, stock: number}[]|Array}
         */
        vm.products = g_var.orderView.products;
        /**
         * @description 确认下架操作
         * @memberOf orderPreviewCtrl
         * @param {{id: number, isSoldOut: number, isConfirmSoldOut: number, name: string, sn: string, spec: string, price: number, quantity: number, futuresQty: number, stock: number}} product
         */
        vm.confirmSoldOut = function ( product ) {
            return product.isConfirmSoldOut = 1;
            $.ajax( {
                url: "confirmShopSoldOut.ajax?id=" + product.id,
                type: "post",
                dataType: "json",
                data: vm.$model.orderPreviewInfo,
                success: function ( res ) {
                    product.isConfirmSoldOut = 1;
                    if ( res.state == "ERROR" ) {
                        alert( "系统错误,下架失败.请稍后再试" );
                    }
                }
            } );
        };
        /**
         * @description 订单预览层是否有错误,
         * @memberOf orderPreviewCtrl
         * @returns {boolean}
         */
        vm.isPreviewError = function () {
            var isPass = true;
            // 检测是否所有调整通过检测
            for ( var key in vm.$model.products ) {
                var product = vm.products[ key ];
                isPass = product.stock >= product.quantity && ( !product.isSoldOut || product.isConfirmSoldOut)
                    ? isPass : false;
            }
            //如果有错误
            if ( fillOrderCtrl.orderInfo.isPassChack ) {
                return false;
            }
            return !isPass;
        };
        //统计金额
        vm.totalPrice = function () {
            var totalPrice = 0;
            for ( var k in vm.$model.products ) {
                var product = vm.products[ k ];
                totalPrice += product.price * (product.quantity + product.futuresQty);
            }
            return totalPrice;
        }

    } );
    avalon.scan();
} );


// jquery,tab层切换插件
require( [ "jquery.idTabs" ], function () {
    $( "#tabs1" ).idTabs( "!mousedown" );
    $( "#tabs2" ).idTabs( "!mousedown" );
} );
