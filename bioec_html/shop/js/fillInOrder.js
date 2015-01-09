/**
 * @type {string} baseUrl='/bioec_html/common/js/'
 */
require.config( {
    // 默认情况下模块所在目录为起始目录
    baseUrl : '/bioec_html/common/js',
    shim : {
        avalon : {
            exports : 'avalon'
        },
        "jquery.idTabs" : [ "jquery" ], // 为这个插件加入jquery
        "jvalidator" : [ "jquery" ] // 为这个插件加入jquery
    },
    paths : {
        "jquery" : "" + "inc/jquery-1.8.3",
        "avalon" : "" + "framework/avalon/avalon",
        "jquery.idTabs" : "" + "inc/jquery.idTabs",
        "FEUI" : "" + "util/FEUI",
        "jvalidator" : "" + "inc/jvalidator",//jq 验证
        "region" : "" + "/bioec_html/shop/js/region", // 地区数据
        "deliverAddress" : "" + "/bioec_html/shop/js/deliverAddress"
    }
} );
/**
 * 一些初始化配置
 */
require( [ "avalon" ], function () {
    /**
     * @memberOf avalon
     */
    avalon.spring = {};//模拟spring管理
    //添加一个自然数拦截器
    avalon.duplexHooks.natural_num = {
        get : function ( str, data ) {
            var num = str.toString().replace( /\D/g, '' );
            num = num == '' ? '0' : num;
            if ( data.element.value != num ) data.element.value = num;//不做判断会死递归
            return parseInt( num );
        }
    }
    // 为单位增加,待定,和新增选项
    for ( var k in g_var.orderView.units ) {
        var unit = g_var.orderView.units[ k ];
        unit.groups.push( { id : 0, name : "待定", newName : "" } );
        unit.groups.push( { id : -1, name : "新增", newName : "" } );
    }
} );
require( [ "jquery", "jvalidator", "avalon", "FEUI", "region", "deliverAddress" ], function () {
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
    };

    /**
     * 订单信息常量
     */
    var constant = {
        KFP_ID : 0,//发票方式,开发票ID
        PTFP_ID : 1,//普通发票ID
        // 付款类型
        PAY_METHOD : [ {
            id : 0,
            value : '发货前付清全部货款'
        }, {
            id : 1,
            value : '发货后30天内付清货款'
        }, {
            id : 2,
            value : '订货时预付30%货款，发货前付清余款'
        }, {
            id : 3,
            value : '订货时预付50%货款，发货前付清余款'
        }, {
            id : 4,
            value : '订货时预付全款'
        } ],
        // 配送方式
        SHIPPING_METHOD : [ {
            id : 0,
            value : '现货、期货一起配送'
        }, {
            id : 1,
            value : '先配送现货'
        } ],
        // 发票信息选项
        INVOICE_METHOD : [ {
            id : 0,
            value : '开发票'
        }, {
            id : 1,
            value : '不开发票'
        }, {
            id : 2,
            value : '暂不开发票'
        } ],
        // 发票类型
        INVOICE_TYPES : [ {}, {
            id : 1,
            value : '普通发票'
        }, {
            id : 2,
            value : '17%增值谁发票'
        }, {
            id : 3,
            value : 'Invoice'
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
        vm.orderView = $.extend( {}, g_var.orderView, { addrs : [], invoices : [] } );
        /**
         * @memberOf fillOrderCtrl
         * @type {{isOrderGroup: boolean, isPassAuth: boolean, unit: {id: null, name: string, group: {id: number, name: string}}, deliverMethod: null, isUrgent: Array, orderRemark: string, addr: {id: null, name: string, addr: string, mobile: string, telephone: string}, invoice: {id: null, invoiceMethod: null, typeId: number, invoiceType: string, title: string, taxNo: string, registerBank: string, bankAccount: string, invoiceNeedCombine: null, invoiceLimit: null, invoiceLimitAmount: null}}}
         */
        vm.orderInfo = {
            isOrderGroup : true,// 是否是订购小组
            isPassAuth : false,//是否通过验证,商品,缺货,下降等
            merchant : g_var.orderView.merchant,
            unit : {//单位
                id : null, name : "单位",
                group : { id : 1, name : '小组' }
            },
            deliverMethod : null,// 配送方式
            isUrgent : [],//是否加急
            orderRemark : "", // 订单备注
            addr : { id : null, regionId : "", name : "", addr : "", mobile : "", telephone : "" },//收货信息
            invoice : {//发票信息
                id : null,// 发票抬头ID
                invoiceMethod : null,// 发票信息选择,开与不开发票
                typeId : 0,
                invoiceType : "",//发票类型
                title : "",//发票抬头
                taxNo : "",//识别号
                registerBank : "",//开户银行
                bankAccount : "",//开户帐号
                invoiceNeedCombine : null,// 发票是否合开
                invoiceLimit : null,// 是否限制金额
                invoiceLimitAmount : null// 限制金额
            }
        };

        // TODO 模拟Ajax载入个人的历史收货地址,发票.
        // 只是第一次获取才请求(闭包)
        var loadPersDataAjax = (function () {
            var orderView = null;
            return (function () {
                if ( orderView ) {
                    addrCtrl.addrs = orderView.addrs;
                    vm.orderView.invoices = orderView.invoices;
                } else {
                    $.ajax( {
                        url : "js/ajaxData.json",
                        type : "get",
                        dataType : "json",
                        success : function ( res ) {
                            if ( res.state ) {
                                orderView = {};
                                addrCtrl.addrs = orderView.addrs = res.addrs;
                                vm.orderView.invoices = orderView.invoices = res.invoices;
                            }
                        }
                    } );
                }
            });
        })();

        /**
         * 切换订购方式(小组,个人切换)
         */
        vm.chengeOrderMethod = function () {
            vm.orderInfo.isOrderGroup = !vm.orderInfo.isOrderGroup;
            // 切换后.地址归位,点击dom,切换一下,
            var tab = vm.orderInfo.isOrderGroup ? '#tab1' : '#tab2';
            $( "a[href=" + tab + "]" ).mousedown();//切换
            if ( !vm.orderInfo.isOrderGroup ) {
                loadPersDataAjax();// 载入个人的历史收货地址,发票.
            }
        };

        var chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

        function generateMixed( n ) {
            var res = "";
            for ( var i = 0; i < n; i++ ) {
                var id = Math.ceil( Math.random() * 35 );
                res += chars[ id ];
            }
            return res;
        }


        // TODO 模拟Ajax载入收货地址和发票信息
        function loadAdInAjax( unitId, groupId ) {
            $.ajax( {
                url : "js/ajaxData.json?groupId=" + groupId,
                type : "get",
                dataType : "json",
                success : function ( res ) {
                    if ( res.state ) {
                        addrCtrl.addrs = res.addrs;
                        vm.orderView.invoices = res.invoices;
                    }
                }
            } );
        }

        /**
         * @description 选择小组
         * @param {string} unitGroupId :5,3 单位id,小组id
         */
        vm.chooseGroup = function ( unitGroupId ) {
            var ids = unitGroupId.split( ',' );
            var unit, group, unitId = ids[ 0 ], groupId = ids[ 1 ];
            $.each( vm.$model.orderView.units, function ( k, v ) {
                if ( v.id == unitId ) unit = v;
            } );
            $.each( unit.groups, function ( k, v ) {
                if ( v.id == groupId ) group = v;
            } );
            // 设置选择的组
            $.extend( vm.orderInfo.unit, unit, { group : group } );
            delete vm.orderInfo.unit.groups;//删除掉展示的groups
            if ( groupId != 0 && groupId != -1 ) {
                loadAdInAjax( unit.id, group.id );//Ajax载入收货地址和发票信息
            } else {
                // 切换后.地址归位,点击dom,切换一下,
                $( "a[href=#tab3]" ).mousedown();//切换
            }
        };
        /**
         * 选择发票
         */
        vm.chooseInvoice = function ( invoice ) {
            $.extend( vm.orderInfo.invoice, invoice.$model );
            try {// 启动自身验证
                document.getElementById( "hi_vali_invo" )._field_validator.check();
            } catch ( e ) {
            }
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
         * 打开预览订单层
         */
        function openOrderPreviewLayer() {
            // 如果是个人获取发票抬头
            if ( !vm.orderInfo.isOrderGroup ) {
                vm.orderInfo.invoice.title = $( "#tabs2" ).find( ":radio:checked" ).next().val()
            }
            vm.orderPreviewLayerOO = true;
        }

        // TODO 提交订单
        vm.submitOrder = function () {


        };

        /**
         * --------------------------验证模块分割线-------------------------------
         */


        /**
         * @description 表单验证的初始化
         * @returns {jvalidator}
         */
        function initForm() {
            var $orderForm = $( "#vali_order" );
            var jv = new JValidator( "#vali_order" );

            //*****************************1 设置自定义验证规则********************************
            // 为真的验证,自定义验证 own[param]  参数则是提示语
            jv.addPattern( 'own', {
                argument : true,
                message : '%argu',
                validate : function ( value, done ) {
                    done( !!value );
                }
            } );

            //*************************2 验证样式处理************************************
            /**
             * @description 移除验证样式
             * @param el
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
                var $el = $( el );
                removeStyle( el );// 1 先移除验证的样式
                if ( isPass ) {
                } else {
                    var $shopMainC = $el.parents( ".shop_main_c" );
                    $shopMainC.addClass( "yellow_border" );
                    $shopMainC.prepend( "<div class='error'>" + errors.getMessage() + "</div>" );
                }
            }


            //***********************************3 验证初始化***********************************

            // 全部验证
            function validateAll() {
                jv.validateAll( function ( result, elements ) {
                    if ( result ) {
                        openOrderPreviewLayer();//打开预览层
                    } else {
                        var msg = [ '验证未通过.' ]
                        for ( var i = 0; i < elements.length; i++ ) {
                            msg.push( elements[ i ].getMessage() )
                        }
                        // 如果有错误,则滚动到错误区域
                        setTimeout( function () {
                            // 页面滚动到错误区域
                            $( "html,body" ).animate( {
                                scrollTop : $( ".yellow_border:visible :eq(0)" ).offset().top - 120
                            }, 200 );
                        }, 25 );
                    }
                } );
            }

            $orderForm.find( '.success_btn1' ).on( 'click', validateAll );

            jv.when( [ 'click', "blur" ] );

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
     * 发票操作 控制器
     */
    var invoiceCtrl = avalon.define( "invoiceCtrl", function ( vm ) {
        vm.newInvoice = {
            id : 1,
            invoiceType : null,
            title : '',
            taxNo : "",
            registerBank : "",
            bankAccount : ""
        };

        ////////////////////////////////////////////////////////新增发票验证////////////////////////
        /**
         * @memberOf invoiceCtrl
         * @description 收货地址表单初始化方法
         * @type function(formSelector,submitSelector, resultFn)
         */
        var initNewInvoiceValiForm = (function () {
            /**
             * @description 移除验证样式
             * @param {element} el
             */
            function removeStyle( $el ) {
                $el.nextAll( ".error" ).remove();
            }

            /**
             * @description 设置验证样式
             * @param {boolean} isPass 是否通过验证
             * @param {element}  el 元素
             * @param {Object} errors 验证组建的对象.data.getMessage()获得错误提示
             */
            function authStyle( isPass, $el, errors ) {
                removeStyle( $el );// 1 先移除验证的样式
                if ( isPass ) {
                    $el.css( "border-color", "green" );
                } else {
                    $el.css( "border-color", "red" );
                    $el.after( "<span class='error'>" + errors.getMessage() + "</span>" );
                }
            }

            // 添加自定义验证
            function addVali( jv ) {
                //不能为空
                jv.addPattern( 'requi', {
                    argument : true,
                    message : '%argu',
                    validate : function ( value, done ) {
                        done( !!value );
                    }
                } );
            }

            /**
             * 发票表单验证
             * @param {string} formSelector  // 验证的元素选择器
             * @param {string} submitSelector// 提交元素选择器
             * @param {function} resultFunc// 验证回调
             * @returns {JValidator}
             */
            function init( formSelector, submitSelector, resultFunc ) {
                var $formSelector = $( formSelector );
                var jv = new JValidator( $formSelector );
                addVali( jv );
                $( submitSelector ).click( function () {
                    jv.validateAll( resultFunc );
                } );

                jv.when( [ 'blur' ] );
                jv.when( "#hi_vali_invo_type", [ 'keyup' ] );

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
        //
        var jv = initNewInvoiceValiForm( "#vali_invoice", "#vali_invoice .company_btn", function ( isPass, elements ) {
            if ( isPass )  $.extend( fillOrderCtrl.orderInfo.invoice, vm.newInvoice.$model, { id : -1 } );
        } );
    } );

    /**
     * 收货地址功能模块
     */
    var addrCtrl = avalon.define( "addrCtrl", function ( vm ) {
        var inputAddrVM = avalon.spring.inputAddrVM;
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

        vm.addrs = [];

        /**
         * @description  使用收货地址
         * @memberOf addrCtrl
         * @type {{id: number, name: string, addr: string, mobile: string,telephone:string}|*}
         */
        vm.useAddr = fillOrderCtrl.orderInfo.addr;

        /**
         * @description  选择收货地址收货地址
         * @memberOf addrCtrl
         * @type {function()}
         */
        vm.chooseAddr = function ( addr ) {
            $.extend( vm.useAddr, addr.$model );
            try {
                document.getElementById( "hi_vali_addr" )._field_validator.check();
            } catch ( e ) {
            }
        };
        /**
         * @description  修改地址层开关
         * @type {function(Object,Number)}
         */
        vm.openChangeAddr = function ( addr, $index ) {
            vm.changeAddrOO = true;
            inputAddrVM.addrInfo = $.extend( { $index : $index }, addr.$model );
            inputAddrVM.initSelectRegion( inputAddrVM.addrInfo.regionId );
        };
        vm.closeChangeAddr = function () {
            vm.changeAddrOO = false;
        };

        /**
         * 修改地址
         */
        function changeAddr() {
            // 数据修改
            var index = inputAddrVM.addrInfo.$index;
            delete inputAddrVM.addrInfo.$model.$index;
            vm.addrs.splice( index, 1, inputAddrVM.addrInfo.$model );
            vm.closeChangeAddr();
        }

        vm.openAddAddr = function () {
            inputAddrVM.addrInfo = { id : -1, name : "", regionId : "", addr : "", mobile : "", telephone : "" };
            inputAddrVM.initSelectRegion( null );
        };

        // 添加收货地址
        function addAddr() {
            if ( fillOrderCtrl.orderInfo.isOrderGroup ) {
                $.extend( vm.useAddr, inputAddrVM.addrInfo.$model, { id : -1 } );
            } else {
                $.extend( vm.useAddr, inputAddrVM.addrInfo.$model, { id : -2 } );
            }
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
         * *******************************************个人订购的操作
         */
        vm.chooseOldAddrOO = false;
        vm.closeChooseOldAddr = function () {
            vm.chooseOldAddrOO = false;
        };
        // 打开个人旧地址
        vm.openChooseOldAddr = function ( addr ) {
            vm.chooseOldAddrOO = true;
            inputAddrVM.addrInfo = $.extend( {}, addr.$model );
            inputAddrVM.initSelectRegion( inputAddrVM.addrInfo.regionId );
        };
        // 确定选择个人旧地址
        function chooseOldAddr() {
            vm.chooseOldAddrOO = false;
            $.extend( vm.useAddr, inputAddrVM.addrInfo.$model );
        }

        //初始化表单验证
        vm.$id && $( function () {
            // 新增地址验证
            inputAddrVM.initValiForm( "#vali_addr", "#vali_addr .company_btn", function ( isPass ) {
                if ( isPass ) addAddr();
            } );
            // 小组修改地址验证
            inputAddrVM.initValiForm( "#vali_change", "#vali_change .company_btn", function ( isPass ) {
                if ( isPass ) changeAddr();
            } );
            // 小组修改地址验证
            inputAddrVM.initValiForm( "#vali_old_addr", "#vali_old_addr .company_btn", function ( isPass ) {
                if ( isPass ) chooseOldAddr();
            } );
        } );

    } );

    /**
     * 预览订单部分
     */
    var orderPreviewCtrl = avalon.define( "orderPreviewCtrl", function ( vm ) {
        /**
         * 运费
         * @memberOf orderPreviewCtrl
         * @type {number}
         */
        vm.freight = g_var.orderView.freight;
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
                url : "confirmShopSoldOut.ajax?id=" + product.id,
                type : "post",
                dataType : "json",
                data : vm.$model.orderPreviewInfo,
                success : function ( res ) {
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
            if ( fillOrderCtrl.orderInfo.isPassAuth ) {
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
} )
;

// jquery,tab层切换插件
require( [ "jquery.idTabs" ], function () {
    $( "#tabs1" ).idTabs( "!mousedown" );
    $( "#tabs2" ).idTabs( "!mousedown" );
} );


/////////////////////////////////////////////TODO 数据模拟  //////////////////////////////////////

/**
 * @type {g_var|*}
 */
var g_var = !!g_var ? g_var : {};
/**
 * @description 订单师视图数据
 * @memberOf g_var
 * @type {{merchant: {id: string, code: string, name: string, mobile: string, telephone: string, addr: string}, personal: {name: string, mobile: string}, products: {id: number, isSoldOut: number, isConfirmSoldOut: number, name: string, sn: string, spec: string, price: number, quantity: number, futuresQty: number, stock: number}[], addrs: {id: number, name: string, regionId: string, addr: string, mobile: string, telephone: string}[], units: {id: number, name: string, groups: {id: number, name: string}[]}[], invoices: {id: number, invoiceType: number, title: string, taxNo: string, registerBank: string, bankAccount: string}[]}}
 */
g_var.orderView = {
    freight : 300,//运费
    merchant : {// 经销商
        id : "1",
        code : "SZDKW",
        name : "深圳达科为生物科技有限公司",
        mobile : "13632879450",
        telephone : "0731-86541769",
        addr : "深圳南山区沿山路佳利泰大厦"
    },
    personal : {//个人信息
        name : "雷建军",
        mobile : "13266720440"
    },
    products : [//产品集
        {
            id : 1,
            isSoldOut : 0,
            isConfirmSoldOut : 0,
            mfgName : "Agrisera",
            name : "cd1",
            sn : "007",
            spec : "200m",
            price : 560,
            quantity : 7,
            futuresQty : 1,
            stock : 4//库存
        },
        {
            id : 2,
            isSoldOut : 0,
            isConfirmSoldOut : 0,
            mfgName : "BLG",
            name : "cd3",
            sn : "002",
            spec : "100m",
            price : 500,
            quantity : 3,
            futuresQty : 0,
            stock : 4//库存
        },
        {
            id : 3,
            isSoldOut : 1,
            isConfirmSoldOut : 0,
            mfgName : "深圳达科为",
            name : "cd19",
            sn : "005",
            spec : "400m",
            price : 200,
            quantity : 2,
            futuresQty : 1,
            stock : 4//库存
        }
    ],
    addrs : [],//收货地址集

    units : [ {//单位集,(订购组集)
        id : 1, name : "北京航空航天大学", groups : [ { id : 1, name : '产品小组' }, { id : 2, name : '研发小组' } ]
    }, {
        id : 2, name : "长沙县想呀医院", groups : [ { id : 3, name : '外科小组' }, { id : 4, name : '神经科小组' } ]
    }, {
        id : 3, name : "深圳第一人民医院", groups : [ { id : 5, name : '骨科小组' }, { id : 6, name : '内科小组' } ]
    } ],
    invoices : []
};

