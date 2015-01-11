/**
 * 独立出来的,地址验证,和地址填写功能
 */
define( [ "jquery", "jvalidator", "avalon", "region" ], function () {
    var inputAddrFormCtrl = avalon.define( "inputAddrFormCtrl", function ( vm ) {
        ///////////////////////////////////////选择地区///////////////////////////////
        vm.nullOption = "&"
        vm.provinceOptions = loadChildRegion( "" );
        vm.province = null;
        vm.city = null;
        vm.cityOptions = [];
        vm.town = null;
        vm.townOptions = [];
        vm.street = null;
        vm.streetOptions = [];
        vm.addrInfo = {
            id : null,
            name : "",
            regionId : "",
            addr : "",
            mobile : "",
            telephone : "0731-"
        };


        function loadRegionTmp( id, regions ) {
            for ( var key in regions ) {
                var region = regions[ key ];
                if ( region.id == id ) {
                    return region;
                }
            }
            return null;
        }

        /**
         * 保存实时的详细地址
         */
        vm.fullAddress = function ( bookRegionid ) {
            var region = [ vm.province, vm.city, vm.town, vm.street ];
            var fullTitle = "";
            for ( var i = 0; i < 4; i++ ) {
                try {
                    var title = region[ i ].split( "&" )[ 1 ]
                    fullTitle += typeof title == "undefined" ? '' : title;
                } catch ( e ) {
                    break;
                }
            }
            vm.addrInfo.regionId = bookRegionid;
            return vm.addrInfo.addr = fullTitle;
        };

        /**
         * XXX 选择省
         */
        vm.changeProvince = function () {
            vm.city = null;
            if ( vm.province == null ) {
                vm.cityOptions = null;
                return;
            }
            var id = vm.province.split( "&" )[ 0 ];
            vm.cityOptions = loadChildRegion( id );
            vm.city = null;
            vm.townOptions = vm.streetOptions = [];
            // 2
            vm.fullAddress( id );
        };

        /**
         * 选择市
         */
        vm.changeCity = function () {
            vm.town = null;
            if ( vm.city == null ) {
                vm.townOptions = null;
                return;
            }
            var id = vm.city.split( "&" )[ 0 ];
            vm.townOptions = loadChildRegion( id );
            vm.town = null;
            vm.streetOptions = [];

            // 2
            vm.fullAddress( id );
        };
        /**
         * 选择镇
         */
        vm.changeTown = function () {
            vm.street = null;
            if ( vm.town == null ) {
                vm.streetOptions = null;
                return;
            }
            var id = vm.town.split( "&" )[ 0 ];
            $.ajax( {
                url : "orderLoadChildRegion.ajax?regionId=" + id,
                dataType : "json",
                success : function ( streets ) {
                    vm.streetOptions = streets;
                    vm.street = null;
                }
            } );
            vm.fullAddress( id );
        };
        /**
         * 选择街道
         */
        vm.changeStreet = function () {
            if ( vm.street != null ) {
                vm.fullAddress( vm.street.split( "&" )[ 0 ] );
            }
        };
        /**
         * 初始化选择地区
         */
        vm.initSelectRegion = function ( regionId ) {
            if ( !regionId ) {//如果为 null 清空选择
                vm.cityOptions = vm.townOptions = vm.streetOptions = [];
                vm.province = "null";
                return;
            }
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
                url : "orderLoadChildRegion.ajax?regionId=" + tId,
                dataType : "json",
                success : function ( streets ) {
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
///////////***************/////////////////////////////////////////////////////////////////


        //*********************************************验证模块/////////////////////////////////

        /**
         * @memberOf addrCtrl
         * @description 收货地址表单初始化方法
         * @type function(formSelector,submitSelector, resultFn)
         */
        vm.initValiForm = (function () {
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
                    console.log( errors.getMessage() )
                    $el.css( "border-color", "red" );
                    $el.after( "<span class='error'>" + errors.getMessage() + "</span>" );
                }
            }

            function addVali( jv ) {
                // 选择地区
                jv.addPattern( 'addr_region', {
                    message : '请选择完整的地区',
                    validate : function ( value, done ) {
                        if ( value.length < 6 ) done( false );
                        else done( parseInt( value.substring( 4, 6 ) ) != 0 );
                    }
                } );
                // 2选1  TODO
                jv.addPattern( 'mobileOrTele', {
                    agrument : true,
                    message : '手机或电话须填写一个',
                    validate : function ( value, done ) {
                        var $form = this.element._field_validator.$form;
                        var pass = (!$form.find( ".mobile" ).next().hasClass() || !$form.find( ".telephone" ).next().hasClass());
                        done( false )
                    }
                } );
            }

            /**
             * 初始化收货地址表单验证
             * @param {string} formSelector  // 验证的元素选择器
             * @param {string} submitSelector //提交的标签选择器
             * @param {function(Boolan)} resultFn 验证通过与否的回调
             * @returns {JValidator}
             */
            function init( formSelector, submitSelector, resultFn ) {
                var $formSelector = $( formSelector );
                var jv = new JValidator( $formSelector );
                addVali( jv );
                $formSelector.find( "" );
                // 全部验证
                $( submitSelector ).click( function () {
                    jv.validateAll( function ( result, elements ) {
                        resultFn( result );
                    } );
                } );
                jv.when( [ 'blur' ] );
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
    } );
    // 注入到管理....
    /**
     * @memberOf avalon.spring
     */
    avalon.spring.inputAddrVM = inputAddrFormCtrl;
    avalon.scan();
} );


