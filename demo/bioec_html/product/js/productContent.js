/**
 *  循环dom标签(多个标签,只留第一个作为复制模板)
 * @param el 要复制的元素, jquery的选择器
 * @param obj 循环的对象,
 * @param onBackCall 每次循环的回调.$el 每次循环的元素,  k,v 每次循环对象的键和值
 */
function eachTag( el, obj, onBackCall ) {
    var $el = $( el ).show();
    if ( $el.length == 0 ) throw new Error( "未选中标签" );
    else if ( $el.length > 1 ) {// 如果选中多个标签,则删除
        $el.filter( ":gt(0)" ).remove();// 1 删除多余的标签
        $el = $el.eq( 0 );
    }
    // 开始复制标签
    var $clone = $el,index = 0;
    for ( var key in obj ) {
        var $previous = $clone; // 记录上一个复制的元素
        $clone = $el.clone(); // 复制元素
        $previous.after( $clone ); // 每次追加到上一个后面
        onBackCall($clone, key, obj[key], {
            $index: index++
        }); // 回调方法
    }
    $el.hide();//隐藏模板标签
}

/**
 * 初始化地区数据
 */
function initRegion() {


}
$( function () {
    add_hover();


    require( [ "js/region" ], function () {
        var provincesData = regionConstant.provincesData;
        var citysData = regionConstant.citysData;

        var $chooseRegion = $( ".add_tab_nav a" );
        var $chooseProvince = $chooseRegion.eq( 0 );
        var $chooseCity = $chooseRegion.eq( 1 );


        /**
         * 载入子地区
         */
        function loadChildRegion( pId ) {
            var childs = [];
            var regions = citysData;
            for ( var i = 0, len = regions.length; i < len; i++ ) {
                var region = regions[ i ];
                pId == region[ 2 ] && childs.push( region );
            }
            return childs;
        }

        /**
         * 显示城市
         */
        function showCity( citys ) {
            eachTag( ".add_shi span", citys, function ( $el, k, v ) {
                    $el.find( "a" ).html( v[ 1 ] ); // 字母索引
                }
            );
        }

        /**
         * 显示县,区
         */
        function showTown( towms ) {
            eachTag( ".add_xian span", towms, function ( $el, k, v ) {
                    $el.find( "a" ).html( v[ 1 ] ); // 字母索引
                }
            );
        }

        /**
         * 选择省
         */
        function chooseProvince( province ) {

            showCity( citys );
            $chooseCity.mousedown();// 点击切换到
        }


        // 显示选择的地址
        function showSelectRegion() {
            var detailRegion = "";
            for ( var i = 0, len = vm.region.length; i < len; i++ ) {
                var title = vm.region[ i ].sel[ 1 ];
                if ( title && title != '请选择' ) {
                    detailRegion += title;
                    vm.selRegion.id = vm.region[ i ].sel[ 0 ];
                }
            }
            vm.selRegion.title = detailRegion;
        }

        /**
         * 选择地区
         * @param sel 选择中的地区对象
         * @param tier 层级
         */
        function chooseRegion( sel, tier ) {
            var childs = loadChildRegion( sel[ 0 ] );// 获得下一级要显示的数据
            var $clone = $( ".add_tab_main" ).eq( tier + 1 ).find( "span" );// 选择到下一级要复制的元素
            // 以数据复制元素
            eachTag( $clone, childs, function ( $el, k, v ) {
                    var $a = $el.find( "a" );
                    $a.html( v[ 1 ] );
                    $a.click( function () {
                        chooseRegion( v, tier + 1 );
                    } );
                }
            );
            // 切换下一层
            $( ".add_tab_nav a" ).eq( tier + 1 ).mousedown();
        }

        /**
         * 显示省
         */
        eachTag( ".add_sheng dl", provincesData, function ( $el, k, v ) {
                $el.find( "dt" ).html( k ); // 字母索引
                eachTag( $el.find( "dd span" ), v, function ( $el, k, v ) {
                        var $a = $el.find( "a" );
                        $a.html( v[ 1 ] );
                        $a.click( function () {
                            chooseRegion( v, 0 );
                        } );// 添加选择事件
                    }
                );
            }
        );


        function showSheng( provincesData ) {
            var $sheng = $( ".add_sheng" );
            var $clone = $sheng.children().clone();// 复制要循环的元素
            $sheng.children().remove();//删除被复制元素
            // 便利元素
            for ( var key in provincesData ) {
                $clone = $clone.clone();
                $clone.children( "dt" ).html( key );
                $sheng.append( $clone );


                console.log( key );
                console.log( $clone );

            }

        }


    } );
} );
