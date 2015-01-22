function contrastService() {
}
/**
 * 拖拽对比 service
 */
contrastService.draggable = function ( vm ) {
    // 管理栏
    vm.manage = [];
    // 对比栏
    vm.contrast = [];
    // 标记新位置
    vm.mark = {
        index : 0,
        varName : "manage"
    };

    // 清除临时的占位符
    function cleanTmp() {
        for ( var key in vm.$model[ "contrast" ] ) {
            if ( vm[ "contrast" ][ key ].id == -1 ) {
                vm[ "contrast" ].splice( key, 1 );
            }
        }
        for ( var key in vm.$model[ "manage" ] ) {
            if ( vm[ "manage" ][ key ].id == -1 ) {
                vm[ "manage" ].splice( key, 1 );
            }
        }
    }

    vm.draggable = {
        // 拖拽开始之前
        beforeStartFn : function ( e, data ) {
            vm.mark.index = -1;
            data.$element.css( {
                position : 'absolute',
                width : "351px",
                height : "46px",
                top : '',
                left : ''
            } );
        },
        // 拖拽时
        dragFn : function ( e, data ) {
            var centerX = data.pageX, centerY = data.pageY;
            var thisExchange = $( e.target ).parents( ".exchange" );
            $( ".exchange" ).not( thisExchange ).each( function ( index, item ) {
                var $item = $( item );
                // 位置区域
                var left1 = $item.offset().left;
                var left2 = left1 + $item.width();
                var top1 = $item.offset().top;
                var top2 = top1 + $item.height();
                // 判断鼠标指向的区域
                if ( centerX > left1 && centerX < left2 && centerY > top1 && centerY < top2 ) {
                    var index = $item.attr( "drag-index" );
                    var varName = $item.attr( "drag-var-name" );
                    // 与当前相同,则返回
                    if ( vm.mark.index == index && vm.mark.varName == varName )
                        return;
                    cleanTmp(); // 清除临时的占位符
                    vm.mark = {
                        index : index,
                        varName : varName
                    };
                    // 添加占位符
                    vm[ varName ].splice( index, 0, {
                        id : -1,
                        productName : "我是占位符"
                    } );
                }
            } )

        },
        // XXX 拖拽结束之前
        beforeStopFn : function ( e, data ) {
            var $this = $( e.target ).parents( ".exchange" );
            $this.css( {
                'opacity' : '',
                'position' : '',
                top : '',
                left : ''
            } );
            // 清除占位符
            cleanTmp();
            if ( vm.mark.index == -1 )
                return;

            var cIndex = parseInt( $this.attr( "drag-index" ) );
            var cVarName = $this.attr( "drag-var-name" );
            // 如果对比栏超过4个则不能添加对比
            if ( vm.contrast.length > 3 && cVarName == "manage" ) {
                return;
            }
            // 记录旧位置
            var copy = avalon.mix( {}, vm.$model[ cVarName ][ cIndex ] );
            // 删除旧位置
            vm[ cVarName ].splice( cIndex, 1 );
            // 如果是同栏,且 在新位置之前,要减去自身的一个位置.
            if ( vm.mark.varName == cVarName && vm.mark.index >= cIndex ) {
                vm.mark.index--;
            }
            // 放入新位置
            vm[ vm.mark.varName ].splice( vm.mark.index, 0, copy );
        }
    };

    /**
     * 清空管理
     */
    vm.isCleanManageOO = false;
    vm.cleanManage = function () {
        vm.manage = [];
        vm.isCleanManageOO = false;
    };

    /**
     * 删除管理
     */
    vm.deleteManage = function ( index ) {
        // 删除管理栏
        vm.manage.splice( index, 1 );
    };
    /**
     * 添加到对比
     */
    vm.addToContrast = function ( index ) {
        // 控制只能添加4个
        if ( vm.contrast.length >= 4 ) {
            return;
        }
        // 添加到对比栏
        vm.contrast.push( vm.$model.manage[ index ] );
        // 删除管理栏
        vm.manage.splice( index, 1 );

    };
    /**
     * 移除对比
     */
    vm.removeContrast = function ( index ) {
        // 添加到管理栏
        vm.manage.push( vm.contrast[ index ].$model );
        // 删除对比栏
        vm.contrast.splice( index, 1 );

    };

    // 对比管理层开关
    vm.contrastManageOO = false;
    /**
     * 打开对比管理
     */
    vm.openContrastManage = function () {
        // 展示的对比,转换为 数组
        var manage = [], contrast = [];
        avalon.each( vm.contrastVo.manage.$model, function ( k, v ) {
            manage.push( v );
        } );
        avalon.each( vm.contrastVo.contrast.$model, function ( k, v ) {
            contrast.push( v );
        } );
        vm.manage = manage;
        vm.contrast = contrast;
        vm.contrastManageOO = true;
    };
    /**
     * 保存设置
     */
    vm.saveSettings = function () {
        var params = {
            jsonManage : JSON.stringify( vm.manage.$model ),
            jsonContrast : JSON.stringify( vm.contrast.$model )
        };
        $.ajax( {
            url : "syncContrast.ajax",
            type : "post",
            dataType : "json",
            data : params,
            success : function ( res ) {
                if ( res.state == "SUCCESS" ) {
                    vm.contrastVo = res.contrastVo;
                    vm.rehreshContrast();
                    vm.contrastManageOO = false;
                } else if ( res.state == "ERROR" ) {
                    alert( "系统错误,请稍后再试" );
                }
            }
        } );

    };
    /**
     * 取消设置
     */
    vm.cancelSettings = function () {
        vm.contrastManageOO = false;
    };

    // 在VM中，改变它们不会引起视图改变的属性，这包括以$开头的属性，其名字放在$skipArray中的属性，函数。
    vm.$skipArray = [ "draggable" ]
}
/**
 * 增加新产品到对比
 */
contrastService.addNewContrast = function ( vm ) {
    vm.keyWord = null;
    vm.productCount = 0;
    vm.listProduct = [];
    // 管理栏目,和对比栏目副本
    var manageCopy = [];
    var contrastCopy = [];

    vm.queryProductTop3 = function () {
        $.ajax( {
            url : "contrastQueryProduct.ajax",
            data : {
                keyWord : vm.keyWord
            },
            dataType : "json",
            success : function ( res ) {
                if ( res.state == "SUCCESS" ) {
                    vm.productCount = res.result.count;
                    vm.listProduct = res.result.listProduct;
                } else if ( res.state == "ERROR" ) {
                    alert( "系统错误请稍后再试." );
                }
            }

        } );
    };
    vm.refreshIsContrast = 1;
    /**
     * 检测商品是否在对比中了.
     */
    vm.isContrast = function ( materialId ) {

        vm.refreshIsContrast;
        for ( var i = 0, len = manageCopy.length; i < len; i++ ) {
            if ( manageCopy[ i ].materialId == materialId ) {
                return true;
            }
        }
        for ( var i = 0, len = contrastCopy.length; i < len; i++ ) {
            if ( contrastCopy[ i ].materialId == materialId ) {
                return true;
            }
        }

        return false;
    };
    // 添加新对比层 开关
    vm.addNewContrastOO = false;
    /**
     * 打开添加新对比层
     */
    vm.openAddNewContrast = function () {
        vm.queryProductTop3();
        vm.addNewContrastOO = true;
        // 保存副本
        manageCopy = vm.$model.contrastVo.manage.concat();
        contrastCopy = vm.$model.contrastVo.contrast.concat();
    };
    /**
     * 添加新对比
     */
    vm.addNewContrast = function ( material ) {
        var materialId = material.materialId + '';
        // 是否已经在对比中,已存在则移除
        if ( vm.isContrast( materialId ) ) {
            var delRunCode = "";
            for ( var i = 0, len = manageCopy.length; i < len; i++ ) {
                manageCopy[ i ].materialId == materialId && (delRunCode = 'manageCopy.splice( ' + i + ', 1 )');
            }
            for ( var i = 0, len = contrastCopy.length; i < len; i++ ) {
                contrastCopy[ i ].materialId == materialId && (delRunCode = 'contrastCopy.splice( ' + i + ', 1 )');
            }
            eval( delRunCode );
        } else { // 不存在,新增
            var newContrast = {
                materialId : material.materialId,
                productname : material.productname,
                packingSpec : material.packingSpec
            };

            // 如果对比栏少于4就加入到到对比栏,否则加入到管理栏目
            if ( contrastCopy.length < 4 ) {
                contrastCopy.push( newContrast );
            } else {
                manageCopy.push( newContrast );
            }
        }
        vm.refreshIsContrast++;
    };

    /**
     * [确定]保存新对比
     */
    vm.saveNewContrast = function () {

        vm.contrastVo = {
            manage : manageCopy,
            contrast : contrastCopy
        };

        // 和后端同步对比
        vm.syncContrast( function () {
            vm.addNewContrastOO = false;
        } );
    };
};

require.config( {
    shim : {
        jslibs : {
            exports : 'avalon'
        }
    },
    // 默认情况下模块所在目录为起始目录
    baseUrl : '/bioec/pages/common/js',
    paths : {
        "avalon.draggable" : ""+"framework/oniui/draggable/avalon.draggable"
    }
} );

require( [ "jslibs", "avalon.draggable" ], function () {
    avalon.define( "contrastController", function ( vm ) {
        vm.contrastVo = g_var.contrastVo;
        // 对比栏,空列数组
        vm.contrastLack = [];
        // 对比栏的商家ID集合
        vm.merchantIds = {};
        /**
         * 拖拽管理对比 service
         */
        contrastService.draggable( vm );
        /**
         * 添加新对比 service
         */
        contrastService.addNewContrast( vm );

        /**
         * 神方法..用eval执行指定的代码
         */
        vm.eval2 = function ( code ) {
            return eval( code );
        };
        /**
         * 刷新对比栏一些信息,如空列数量.商家信息等
         */
        vm.rehreshContrast = function () {
            var count = 0;
            // 所有产品的商家ID
            var merchantIds = {};
            var contrast = vm.$model.contrastVo.contrast;
            for ( var i = 0, len = contrast.length; i < len; i++ ) {
                count++;
                // 收集所有商家ID
                avalon.each( contrast[ i ].merchants, function ( mk, merchant ) {
                    merchantIds[ merchant.companyId + "" ] = merchant.companyname;
                } );
            }
            vm.merchantIds = merchantIds;
            // 用于统计空列数量
            vm.contrastLack = [];
            for ( ; count < 4; count++ )
                vm.contrastLack.push( count );
        };
        // 初始刷新
        vm.$id && setTimeout( function () {
            vm.rehreshContrast();
        }, 10 );
        /**
         * 取消对比
         */
        vm.cancelContrast = function ( index ) {
            // 先赋值到 管理栏
            vm.$model.contrastVo.manage.push( vm.$model.contrastVo.contrast[ index ] );
            // 删掉对比栏
            vm.$model.contrastVo.contrast.splice( index, 1 );
            // 和后端同步对比
            vm.syncContrast();
        };
        /**
         * 和后端同步对比,
         *
         * @params overBackCall ,同步完成后的回调
         */
        vm.syncContrast = function ( overBackCall ) {
            // 转换为 后端所需数组
            var manage = [], contrast = [];
            avalon.each( vm.$model.contrastVo.manage, function ( k, v ) {
                manage.push( v );
            } );
            avalon.each( vm.$model.contrastVo.contrast, function ( k, v ) {
                contrast.push( v );
            } );
            $.ajax( {
                url : "syncContrast.ajax",
                type : "post",
                dataType : "json",
                data : {
                    jsonManage : JSON.stringify( manage ),
                    jsonContrast : JSON.stringify( contrast )
                },
                success : function ( res ) {
                    if ( res.state == "SUCCESS" ) {
                        vm.contrastVo = res.contrastVo;
                        vm.rehreshContrast();
                        // 回调方法
                        overBackCall && overBackCall();
                    } else if ( res.state == "ERROR" ) {
                        alert( "系统错误,请稍后再试" );
                    }
                }
            } );
        };
    } );
    avalon.scan();
} );
