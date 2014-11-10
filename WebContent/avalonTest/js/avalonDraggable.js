avalon.config( {
			debug : true
		} );
require( ["../avalon.oniui/draggable/avalon.draggable.js"], function() {
			avalon.define( "dragController", dragController );
			function dragController( vm ) {
				// 标记新位置
				vm.mark = {
					index : 0,
					varName : "unCompares"
				};

				vm.compares = [{
							id : 1,
							productName : "cd3"
						}, {
							id : 2,
							productName : "cd4"
						}, {
							id : 3,
							productName : "cd5"
						}];
				vm.unCompares = [{
							id : 4,
							productName : "cd6"
						}, {
							id : 5,
							productName : "cd7"
						}, {
							id : 6,
							productName : "cd8"
						}];
				var $exchange = $( ".exchange" );

				vm.draggable = {
					beforeStartFn : function( e, data ) {
						avalon.log( e.type + " beforeStart" )
						vm.mark.index = -1;
					},
					dragFn : function( e, data ) {
						var centerX = data.pageX, centerY = data.pageY;
						$( ".exchange" ).not( e.target ).each( function( index, item ) {
									var $item = $( item );
									var left1 = $item.offset().left;
									var left2 = left1 + $item.width();
									var top1 = $item.offset().top;
									var top2 = top1 + $item.height();

									if ( centerX > left1 && centerX < left2 && centerY > top1 && centerY < top2 ) {
										var index = $item.attr( "drag-index" );
										var varName = $item.attr( "drag-var-name" );
										// 与当前相同,则返回
										if ( vm.mark.index == index && vm.mark.varName == varName )
											return;
										// vm.mark.$target &&
										// vm.mark.$target.prev().remove();
										$( ".testclass" ).remove();
										vm.mark = {
											index : index,
											varName : varName,
											$target : $item.parent()
										};
										vm.mark.$target.prepend( "<div class='moveA testclass'></div>" );

									}
								} )

					},
					beforeStopFn : function( e, data ) {
						var $this = $( e.target );
						$this.css( {
									'opacity' : '',
									'position' : '',
									cursor : '',
									top : '',
									left : ''
								} );
						$( ".testclass" ).remove();
						if ( vm.mark.index == -1 )
							return;

						var cIndex = parseInt( $this.attr( "drag-index" ) );
						var cVarName = $this.attr( "drag-var-name" );
						console.log(cIndex)
						console.log(cVarName)
						var copy = avalon.mix( {}, vm[cVarName][cIndex].$model );
						// 删除旧位置
						vm[cVarName].splice( cIndex, 1 );
						// 放入新位置
						vm[vm.mark.varName].splice( vm.mark.index, 0, copy );

					}
				}
				// 在VM中，改变它们不会引起视图改变的属性，这包括以$开头的属性，其名字放在$skipArray中的属性，函数。
				vm.$skipArray = ["draggable"]
			}
			avalon.scan();
		} )
