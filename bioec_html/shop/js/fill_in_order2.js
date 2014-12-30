//定义全局变量
var g_var = !!g_var ? g_var : {};
g_var.products = [
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
];
g_var.addrs = [
    { id: 1, name: "刘德华", addr: "中国香港九龙92区", mobile: "10086" },
    { id: 2, name: "张学友", addr: "中国香港旺角12区", mobile: "13266720440" },
    { id: 3, name: "郭富城", addr: "中国香港洪兴11区", mobile: "13266720440" } ];

g_var.units = [ {
    id: 1, name: "北京航空航天大学",
    groups: [ { id: 1, name: '产品小组' }, { id: 2, name: '研发小组' } ]
}, {
    id: 2, name: "长沙县想呀医院",
    groups: [ { id: 3, name: '外科小组' }, { id: 4, name: '神经科小组' } ]
}, {
    id: 3, name: "深圳第一人民医院",
    groups: [ { id: 5, name: '骨科小组' }, { id: 6, name: '内科小组' } ]
} ];
for ( var k in g_var.units ) {
    var unit = g_var.units[ k ];
    unit.groups.push( { id: 0, name: "待定", newName: "" } );
    unit.groups.push( { id: -1, name: "新增", newName: "" } );
}

g_var.invoices = [
    { id: 1, invoiceType: 1, title: '长沙湘雅研究组', taxNo: "1001", registerBank: "中国银行", bankAccount: "222 555 131 222" },
    { id: 2, invoiceType: 0, title: '深圳大学', taxNo: "1003", registerBank: "建设银行", bankAccount: "222 555 141 222" },
    { id: 3, invoiceType: 1, title: '湖南大学', taxNo: "1005", registerBank: "工商银行", bankAccount: "222 555 151 222" }
];


require.config( {
    // 默认情况下模块所在目录为起始目录
    baseUrl: '/bioec_html/common/js',
    shim: {
        avalon: {
            exports: 'avalon'
        },
        "jquery.idTabs": [ "jquery" ]
        // 为这个插件加入jquery
    },

    paths: {
        "jquery": "inc/jquery-1.8.3",
        "avalon": "framework/avalon/avalon",
        "jquery.idTabs": "../../js/jquery.idTabs",
        "FEUI": "util/FEUI",
        "avalon.validation": "framework/oniui/validation/avalon.validation"
    }
} );

require( [ "jquery", "avalon", "FEUI", "avalon.validation" ], function () {
    /**
     * *************************Service*************************
     */
    function fillOrderService() {
    }

    fillOrderService.impl = function () {
    }

    fillOrderService.group = function ( vm ) {
        // 选定的小组
        vm.selectedGroup = {
            id: 0,
            groupName: null
        };

        // 选择小组
        vm.selGroup = function ( id, groupName ) {
            vm.selectedGroup.id = id;
            vm.selectedGroup.groupName = groupName;
            $.ajax( {
                url: "orderQueryAddress.ajax?groupId=" + id,
                type: "post",
                dataType: "json",
                success: function ( res ) {
                    vm.userOfAddress = res;
                }
            } );
        };

        // 重新选择
        vm.reSleGroup = function () {
            vm.selectedGroup.id = 0;
            vm.reselectAddress();
        };

    };


    /**
     * 地址操作实现:个人地址操作
     */
    fillOrderService.impl.personAddress = function ( vm ) {
        var _this = this;
        // 继承
        fillOrderService.impl.groupAddress.call( this, vm );
        /**
         * 个人选择修改收货地址
         */
        vm.selChangeAddress = function ( el ) {
            // 切换到 新建地址层
            $( "#new_address" ).mousedown();

            avalon.mix( vm.selAddress, el.$model );
            // 初始化地区选择
            _this.initSelectRegion();
            vm.changeAddressOO = true;
        };

        /**
         * 新增收货地址
         */
        vm.addAddress = function () {
            // 表单检测
            if ( !vm.checkAddress() )
                return;
            // tab 切换到选择层
            $( "#tabs1 .tab_nav a:eq(0)" ).mousedown();
            vm.selAddressOO = true;
        };
    }

    fillOrderService.address = function ( vm ) {
        // 根据是否是小组订购,使用具体那个实现
        var impl = vm.isGroup ? fillOrderService.impl.groupAddress : fillOrderService.impl.personAddress;
        impl.call( this, vm );
    }

    /**
     * 验证表单
     */
    fillOrderService.checkForm = function ( vm ) {
        /**
         * 订单信息填写错误区域
         */
        vm.orderErrorArea = null;
        // 是否打开检测表单.(预览时开启检测表单)
        vm.isOpenCheck = false;
        vm.invoiceErrorMsg = null;
        /**
         * 检测订单的表单
         */
        vm.checkForm = function () {
            if ( !vm.isOpenCheck )// 未开启检测返回
                return;
            // 0 检测订购小组(订购组下单才检测)
            if ( !vm.selectedGroup.id && vm.isGroup ) {
                vm.orderErrorArea = "GROUP";
                return false;
            } else {
                vm.orderErrorArea = null;
            }
            // 1 收货地址区域*****************************************
            // 收货地址-未选择错误
            if ( !vm.selAddressOO ) {
                vm.orderErrorArea = "ADDRESS";
                return false;
            } else {
                vm.orderErrorArea = null;
            }

            // 2 配送区域*****************************************
            if ( null == vm.orderInfo.shippingMethod ) {
                vm.orderErrorArea = "DELI";
                return false;
            } else {
                vm.orderErrorArea = null;// 关闭区域错误样式
            }

            // 3 发票区域*****************************************
            if ( null == vm.orderInfo.invoiceMethod ) {
                vm.orderErrorArea = "INVOICE";
                vm.invoiceErrorMsg = "请选择发票信息";
                return false;
            } else {
                vm.orderErrorArea = vm.invoiceErrorMsg = null;// 关闭区域错误样式
            }
            // 小组下单并且选择"开发票",才执行以下检测
            if ( vm.orderInfo.invoiceMethod == 0 && vm.isGroup ) {
                if ( !vm.selInvoiceOO ) {
                    vm.orderErrorArea = "INVOICE";
                    vm.invoiceErrorMsg = "请选择发票抬头";
                    return false;
                } else {
                    vm.orderErrorArea = vm.invoiceErrorMsg = null;// 关闭区域错误样式
                }
                if ( vm.orderInfo.invoiceNeedCombine == null || vm.orderInfo.invoiceLimit == null
                        // 判断是否填写发票限制金额
                    || (vm.orderInfo.invoiceLimit && !vm.orderInfo.invoiceLimitAmount) ) {
                    vm.orderErrorArea = "INVOICE";
                    vm.invoiceErrorMsg = "请选择发票合开和限制金额";
                    return false;
                } else {
                    vm.orderErrorArea = vm.invoiceErrorMsg = null;// 关闭区域错误样式
                }
            }
            return true;
        }
        function watchList( _this, objs, func ) {
            for ( var i = 0, len = objs.length; i < len; i++ ) {
                _this.$watch( objs[ i ], func );
            }
        }

        /**
         * 初始化,监视,检查的对象.(检查表单事件,就是每当解决一个区域的错误,就重新运行检查)
         */
        if ( vm.selectedGroup.$watch ) {
            vm.$watch( "selAddressOO", vm.checkForm );
            vm.selectedGroup.$watch( "id", vm.checkForm );
            // 监视多个变量(订单信息)
            watchList( vm.orderInfo, //
                [ "shippingMethod", "invoiceId", "invoiceMethod", "invoiceType", "invoiceNeedCombine", "invoiceLimit", "invoiceLimitAmount" ], vm.checkForm );
        }

    };

    /**
     * XXX 发票操作实现:小组发票操作
     */
    fillOrderService.impl.groupInvoice = function ( vm ) {
        // 发票抬头
        vm.listInvoice = g_var.listInvoice;
        // 当前选择的发票抬头
        vm.selInvoice = {
            id: 0,
            invoiceTitle: "",
            invoiceType: 0,
            taxpayerNum: null,
            bank: null,
            bankAccount: null
        };
        /**
         * 选择发票抬头
         */
        vm.selInvoiceOO = false;
        vm.onSelInvoice = function ( el ) {
            vm.selInvoiceOO = true;
            avalon.mix( vm.selInvoice, el.$model );
            vm.orderInfo.invoiceId = el.id;
        };
        vm.reSelInvoice = function () {
            vm.selInvoiceOO = false;
        };

        /**
         * 新增发票
         */
        vm.addInvoice = function () {

        };
    };

    /**
     * 发票操作实现:个人发票操作
     */
    fillOrderService.impl.personInvoice = function ( vm ) {
        var _this = this;
        // 继承
        fillOrderService.impl.groupInvoice.call( this, vm );
        // 增加一个 空的位置,用于新增

        if ( vm.$id && !vm.isGroup ) {
            vm.listInvoice.push( {
                invoiceTitle: ""
            } );
        }
        // 选择发票
        vm.onSelInvoice = function ( $event, invoice ) {
            vm.selInvoice = invoice;
            var input = $( $event.target ).parent().find( "input" );
            input.eq( 0 ).click();
            input.eq( 1 ).focus();
        };
    };

    /**
     * 发票操作
     */
    fillOrderService.invoice = function ( vm ) {

        // 根据是否是小组订购,使用具体那个实现
        var impl = vm.isGroup ? fillOrderService.impl.groupInvoice : fillOrderService.impl.personInvoice;
        impl.call( this, vm );

    };

    /**
     * 预览订单
     */
    fillOrderService.orderPreview = function ( vm ) {
        //vm.showAddress = function () {
        //    var res = "{<br>";
        //    for ( var k in vm.$model.selAddress ) {
        //        res += "&nbsp;&nbsp;" + k + " : " + vm.selAddress[ k ] + "<br>";
        //    }
        //    return res + "}";
        //};

        /**
         * 创建提交订单的参数对象
         * 返回:参数对象,如果有错误返回false.错误信息存储在document.g_variable.message
         */
        function createParam() {

            /**
             * private String consigneeName; private String
             * consigneeMobile; private String consigneeTel; private
             * String consigneePostman; private String consigneeEmail;
             * private String consigneeRegion; private String
             * consigneeAddress;
             *
             *
             * bookId : 443 bookName : 123 bookAddress : 123 bookMobile :
             * 13511211122 bookPhone : bookEmail : bioecRegion : [object
             * Object] bookRegion : 河北省秦皇岛市北戴河区海滨镇
             */

            // url的参数列表
            var param = {
                "bioecZcGroup.id": vm.selectedGroup.id,
                // ***************地址信息
                "bioecRegion.id": vm.selAddress.bioecRegion.id,
                addressbookid: vm.selAddress.bookId,
                consigneeName: vm.selAddress.bookName,
                consigneeMobile: vm.selAddress.bookMobile,
                consigneeTel: vm.selAddress.bookPhone,
                consigneeEmail: vm.selAddress.bookEmail,
                consigneeRegion: vm.selAddress.bookRegion,
                consigneeAddress: vm.selAddress.bookAddress,

                // **********发票参数
                invoiceid: vm.selInvoice.id,
                invoiceTitle: vm.selInvoice.invoiceTitle,
                invoiceType: vm.selInvoice.invoiceType,
                invoiceTaxpayerNum: vm.selInvoice.taxpayerNum,
                invoiceBank: vm.selInvoice.bank,
                invoiceBankAccount: vm.selInvoice.bankAccount
            };
            avalon.mix( param, vm.orderInfo.$model );
            return vm.checkForm() ? param : false;
        }

        /**
         * 弹出预览订单层
         */
        vm.orderPreviewLayerOO = false;
        vm.openOrderPreviewLayer = function () {
            vm.orderPreviewLayerOO = true;
        };
        /**
         * 关闭预览订单层
         */
        vm.closeOrderPreviewLayer = function () {
            vm.orderPreviewLayerOO = false;
        };
        /**
         * @author 雷建军
         * @time 2014-8-14 16:08:48
         * @Description: XXX 预览订单
         */
        vm.previewOrder = function ( event ) {
            // 点击预览后,开启表单检测
            vm.isOpenCheck = true;
            var params = createParam();
            // 如果有错误,则滚动到错误区域
            if ( !params ) {
                setTimeout( function () {
                    // 页面滚动到错误区域
                    $( "html,body" ).animate( {
                        scrollTop: $( ".yellow_border:visible" ).offset().top - 120
                    }, 200 );
                }, 25 );
                return;
            }

            vm.loading.previewOrder = true;
            $.ajax( {
                url: "perviewOrder.ajax?merchantId=" + g_var.merchantId,
                type: "post",
                dataType: "json",
                data: params,
                success: function ( res ) {
                    vm.loading.previewOrder = false;
                    if ( res.state == "SUCCESS" ) {
                        vm.isPassChack = true;
                    } else if ( res.state == "UNDER_STOCK" ) {// 库存不足
                        var checkResult = res.checkResult;
                        vm.isPassChack = false;
                        // 库存和上架信息,同步到数据中
                        avalon.each( vm.shops, function ( key, shop ) {
                            var checkRes = checkResult[ shop.bioecMerchantMaterials.id + "" ];
                            if ( checkRes ) {
                                shop.stock = checkRes.stock;
                                shop.isSoldOut = checkRes.isSoldOut;
                                shop.isConfirmSoldOut = checkRes.isConfirmSoldOut;
                            } else {
                                shop.isSoldOut = 0;
                            }
                        } );
                    } else if ( res.state == "SYSTEM_ERROR" ) {
                        alert( "系统错误,预览失败.请稍后再试" );
                        return;
                    }
                    vm.orderPreviewInfo = params;
                    vm.openOrderPreviewLayer();
                }
            } );
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
        /**
         * 订单信息常量
         */
        vm.constant = constant;
        vm.units = g_var.units;//单位,小组集
        vm.invoices = g_var.invoices;//发票集
        /**
         * 订单信息
         */
        vm.orderInfo = {
            isOrderGroup: true,// 是否是订购小组
            isPassAuth: true,//是否通过验证,商品,缺货,下降等
            orderGroup: "",
            deliverMethod: null,// 配送方式
            isUrgent: [],//是否加急
            addr: { id: 0, name: "", addr: "", mobile: "" },
            invoice: {//发票信息
                id: 0,// 发票抬头ID
                invoiceMethod: null,// 发票信息选择,开与不开发票
                typeId: 0,
                invoiceType: "",//发票类型
                title: "",//发票抬头
                taxNo: "",//识别号
                registerBank: "",//开户银行
                registerAccount: "",//开户帐号
                invoiceNeedCombine: null,// 发票是否合开
                invoiceLimit: null,// 是否限制金额
                invoiceLimitAmount: null// 限制金额

            }
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
            vm.orderInfo.invoice.id = 0;
        };

        /**
         * 预览订单
         */
        fillOrderService.orderPreview( vm );
        return;
        // 追加 3个检测属性
        !vm.shops.$id && avalon.each( vm.shops, function ( k, v ) {
            v.stock = 0;
            v.isSoldOut = 0;
            v.isConfirmSoldOut = 0;
        } );
        // 购物车商品价格统计
        vm.shopTotalPrice = 0;


        /**
         * 订单预览信息
         */
        vm.orderPreviewInfo = {};

        // *****************************Service********************/
        /**
         * 选择小组 Service
         */
        fillOrderService.group( vm );
        /**
         * 收货地址 操作 Service
         */
        fillOrderService.address( vm );
        /**
         * 发票信息
         */
        fillOrderService.invoice( vm );
        /**
         * 验证表单
         */
        fillOrderService.checkForm( vm );
        /**
         * 预览订单
         */
        fillOrderService.orderPreview( vm );

        /**
         * ajax请求,loading
         */
        vm.loading = {
            previewOrder: false,
            submitOrder: false
        };
        /**
         * init 初始区域
         */
        vm.$id && (function () {
            refreshInfo();
            initQuantityWatch();
        })();
        /** ********************************************************************************* */
        /** ***********************************提交订单区************************************ */
        /** ********************************************************************************* */

        /**
         * 初始化所有商品数量的监视,用于和后端同步数量
         */
        function initQuantityWatch() {
            for ( key in vm.$model.shops ) {
                var shop = vm.shops[ key ];
                watchQuantity( shop );
            }
        }

        /**
         * 数量控制 监视(修改商品数量)
         */
        function watchQuantity( shop ) {
            var changeQuantityTimeOut = Util.TimeOut( 500, function () {
                changeCartQuantity( shop );
            } );
            // 现货数量监视
            shop.$watch( "quantity", function () {
                var least = shop.futuresQuantity > 0 ? "0" : "1";
                var value = '' + shop.quantity;
                value = (value == "" || value == "0") ? least : value;
                value = parseInt( value.replace( /\D/g, '' ) );
                if ( shop.quantity * 1 == value ) // 防止递归
                    return;
                shop.quantity = value;
                changeQuantityTimeOut();
            } );
            // 期货数量控制 监视
            shop.$watch( "futuresQuantity", function () {
                var least = shop.quantity > 0 ? "0" : "1";
                var value = shop.futuresQuantity.toString();
                value = (value == "" || value == "0") ? least : value;
                value = parseInt( value.replace( /\D/g, '' ) );
                if ( shop.futuresQuantity * 1 == value ) // 防止递归
                    return;
                shop.futuresQuantity = value;
                changeQuantityTimeOut();
            } );
        }

        /**
         * 刷新购物车的数量,金额的统计信息
         */
        function refreshInfo() {
            var sQuantity = 0, sPrice = 0;
            for ( key in vm.$model.shops ) {
                var shop = vm.shops[ key ];
                var quantity = parseInt( shop.futuresQuantity ) + parseInt( shop.quantity )
                sQuantity += quantity;
                sPrice += shop.price * quantity;
            }
            vm.shopTotalPrice = sPrice;
            return sPrice;
        }

        /**
         * @description XXX 修改购物车数量
         */
        function changeCartQuantity( shop ) {
            var params = {
                shopId: shop.shopId,
                quantity: shop.quantity,
                futuresQuantity: shop.futuresQuantity
            };
            $.ajax( {
                url: "changeOrderShopQuantity.ajax",
                type: "post",
                dataType: "json",
                data: params,
                success: function ( res ) {
                    if ( res.state == "FAILURE" ) {
                        alrt( "系统错误,修改数量失败" )
                    }
                }
            } );
        }


        // 是否通过检测
        vm.isPassChack = true;
        /**
         * 订单预览层是否有错误,
         */
        vm.isPreviewError = function () {
            var isPass = true;
            // 检测是否所有调整通过检测
            for ( var key in vm.$model.shops ) {
                var shop = vm.shops[ key ];
                isPass = shop.stock >= shop.quantity || shop.isConfirmSoldOut ? isPass : false;

            }
            if ( vm.isPassChack ) {
                return false;
            }
            return !isPass;
        };

        /**
         * XXX 提交保存订单方法
         */
        vm.submitOrder = function () {
            vm.loading.submitOrder = true;
            $.ajax( {
                url: "saveOrder.ajax?merchantId=" + g_var.merchantId,
                type: "post",
                dataType: "json",
                data: vm.$model.orderPreviewInfo,
                success: function ( res ) {
                    vm.loading.submitOrder = false;
                    if ( res.state == "SUCCESS" ) {
                        // 提交成功后进入成功页面
                        document.location.href = "generate_order.html?id=" + res.id;
                    } else if ( res.state == "FAILURE" ) {// 未通过检测
                        vm.isPassChack = false;
                        var checkResult = res.checkResult;
                        // 库存和上架信息,同步到数据中
                        avalon.each( vm.shops, function ( key, shop ) {
                            var checkRes = checkResult[ shop.bioecMerchantMaterials.id + "" ];
                            if ( checkRes ) {
                                shop.stock = checkRes.stock;
                                shop.isSoldOut = checkRes.isSoldOut;
                                shop.isConfirmSoldOut = checkRes.isConfirmSoldOut;
                            } else {
                                shop.isSoldOut = 0;
                            }
                        } );
                    } else if ( res.state == "ERROR" ) {
                        alert( "系统错误,请稍后再试" )
                    }

                }
            } );
        };
    } );

    /**
     * 收货地址功能模块
     */
    avalon.define( "addrCtrl", function ( vm ) {
        var _this = this;
        vm.addrs = g_var.addrs;
        /**
         * 使用收货地址
         */
        vm.useAddr = fillOrderCtrl.orderInfo.addr;
        if ( vm.$id ) {

        }
        // 选呢收货地址
        vm.chooseAddr = function ( addr ) {
            $.extend( vm.useAddr, addr.$model );
        };
        vm.reChooseAddr = function () {
            vm.useAddr.id = 0;
        };

        return;
        // 收货地址层
        vm.addressOO = false;
        /**
         * 检测收货地址表单
         */
        DeliveAddressService.checkAddress( vm );
        /**
         * 地区选择
         */
        DeliveAddressService.region( vm );

        /**
         * 用户的所在的订购单位
         */
        vm.orderUnitId = g_var.userGroupId == "" ? null : g_var.userGroupId;
        // 是否是订购组身份 TODO 默认为组
        vm.isGroup = !!g_var.orderUnitId;

        // 用户的收货地址
        vm.userOfAddress = g_var.userOfAddress;

        var nullAddress = {
            bookId: -1,
            bookName: "",
            bookAddress: "",
            bookMobile: "",
            bookPhone: "",
            bookEmail: "",
            bioecRegion: {
                id: -1
            },
            bookRegion: ""
        };
        // 单前选择,操作的 的地址对象
        vm.selAddress = nullAddress;
        // 地址选择是否完成
        vm.selAddressOO = false;
        /**
         * 选择个人地址
         */
        vm.onSelMeAddress = function ( obj ) {
            vm.selAddressOO = true;
            avalon.mix( vm.selAddress, obj.$model );
        };
        /**
         * 重新选择收货地址
         */
        vm.reselectAddress = function () {
            vm.selAddressOO = false;
        };

        /**
         * 选择订购组地址
         */
        vm.selGroupAddressOO = false;
        vm.onSelGroupAddress = function ( obj ) {
            vm.selGroupAddressOO = true;
            avalon.mix( vm.selAddress, obj.$model );
            _this.initSelectRegion();
        };
        /**
         * 确定使用 订购组地址
         */
        vm.affirmGroupAddress = function () {
            // 表单检测
            if ( !vm.checkAddress() )
                return;
            vm.selAddressOO = true;
        };
        /**
         * 重新选择订购组收货地址
         */
        vm.reselectGroupAddress = function () {
            vm.selGroupAddressOO = false;
        };

        /**
         * 选择table 新增地址,
         */
        vm.selAddAddress = function () {
            // 清空表单
            vm.selAddress = nullAddress;
            // 地区
            vm.province = vm.city = vm.town = vm.street = null;
            vm.streetOptions = vm.townOptions = vm.cityOptions = [];
        };
        /**
         * 选择table 同组地址,
         */
        vm.selGroupAddress = function () {
            vm.selGroupAddressOO = false;
        };

        /**
         * 选择修改地址
         */
        vm.changeAddressOO = false;
        vm.selChangeAddress = function ( el ) {
            avalon.mix( vm.selAddress, el.$model );
            // 记录view 修改的对象.方便ajax回调同步修改view
            vm.selAddress.changeMark = el;
            _this.initSelectRegion();
            vm.changeAddressOO = true;
        };
        vm.closeChangeAddress = function () {
            vm.changeAddressOO = false;
        };

        /**
         * 新增收货地址
         */
        vm.addAddress = function () {
            // 表单检测
            if ( !vm.checkAddress() )
                return;
            var params = avalon.mix( {}, vm.selAddress.$model );
            params[ "bioecRegion.id" ] = vm.selAddress.bioecRegion.id;
            params[ "bioecZcGroup.id" ] = vm.selectedGroup.id;
            delete params.bioecRegion;

            $.ajax( {
                url: "orderAddAddress.ajax",
                type: "post",
                dataType: "json",
                data: params,
                success: function ( address ) {
                    vm.userOfAddress.push( address );
                    // jq tab 切换到选择地址
                    $( "#tabs1 .tab_nav a:eq(0)" ).mousedown();
                }
            } );

        };

        /**
         * 修改收货地址
         */
        vm.changeAddress = function () {
            // 表单检测
            if ( !vm.checkAddress() )
                return;
            var params = avalon.mix( {}, vm.selAddress.$model );
            params[ "bioecRegion.id" ] = vm.selAddress.bioecRegion.id;
            params[ "bioecZcGroup.id" ] = vm.selectedGroup.id;
            delete params.bioecRegion;
            $.ajax( {
                url: "orderChangeAddress.ajax",
                type: "post",
                dataType: "json",
                data: params,
                success: function ( res ) {
                    if ( res.state == "CHANGE_SUCCESS" ) {
                        avalon.mix( vm.selAddress.changeMark, vm.selAddress.$model );
                        vm.closeChangeAddress();
                    }
                }
            } );
        };

        /**
         * 初始化选择地区
         */
        this.initSelectRegion = function () {
            var regionId = vm.selAddress.bioecRegion.id + "";
            // 解析出各层 地区ID
            var pId = regionId.substring( 0, 2 ) + "0000";
            var cId = regionId.substring( 0, 4 ) + "00";
            var tId = regionId.substring( 0, 6 );
            var sId = regionId;
            // 初始地区,省
            var province = loadRegion( pId );
            vm.province = province.id + "&" + province.title;
            // 初始市
            vm.cityOptions = loadChildRegion( pId );
            var city = loadRegion( cId );
            vm.city = city.id + "&" + city.title;
            // 初始镇
            vm.townOptions = loadChildRegion( cId );
            var town = loadRegion( tId );
            vm.town = town.id + "&" + town.title;
            // 初始街道
            $.ajax( {
                url: "orderLoadChildRegion.ajax?regionId=" + tId,
                dataType: "json",
                success: function ( streets ) {
                    vm.streetOptions = streets;
                    var isSelectStreet = false;
                    // 初始街道
                    for ( var key in streets ) {
                        var street = streets[ key ];
                        if ( street.id == sId ) {
                            vm.street = street.id + "&" + street.title;
                            isSelectStreet = true;
                        }
                    }
                    if ( !isSelectStreet )
                        vm.street = vm.streetOptions[ 0 ].id;
                }
            } );
        };

    } );


    avalon.define( "orderPreviewCtrl", function ( vm ) {
        vm.products = g_var.products;
        /** 确认下架操作** */
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
         * 订单预览层是否有错误,
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
