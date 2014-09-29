var app = angular.module( 'myapp', [] );

// 自定义helloWorld指令
app.directive( 'drag', function( $document ) {
			return {
				restrict : 'AE',
				replace : true,
				transclude : true,// 指令模板(template) 嵌入 html中的内容
				scope : {// 演示 scope 取 指令上的属性.
					/*
					 * =： 指令中的属性取值为Controller中对应$scope上属性的取值。 @：
					 * 指令中的取值为html中的字面量/直接量
					 * &：指令中的取值为Controller中对应$scope上的属性，但是这个属性必须为一个函数回调
					 */
					drData : '@'
				},

				template : '<div>' + 'id:{{drData}}<div ng-transclude></div></div>',
				link : function( scope, element, attr ) {
					var startX = 0, startY = 0, x = 0, y = 0;
					element.on( 'mousedown', function( event ) {
								// Prevent default dragging of selected content
								event.preventDefault();

								element.css( {
											'opacity' : '0.3',
											'position' : 'absolute',
											cursor : 'pointer'
										} );

								startX = event.screenX - x;
								startY = event.screenY - y;
								$document.on( 'mousemove', mousemove );
								$document.on( 'mouseup', mouseup );
							} );

					function mousemove( event ) {
						var e = event || window.event;
						element.css( {
									'left' : e.clientX + "px",
									'top' : e.clientY + "px"
								} );
					}
					function mouseup() {
						$document.unbind( 'mousemove', mousemove );
						$document.unbind( 'mouseup', mouseup );
						element.css( {
									'opacity' : '',
									'position' : '',
									cursor : '',
									top : '',
									left : ''
								} );
					}
				}
			}
		} );

app.controller( "dragController", dragController );
function dragController( $scope ) {
	$scope.compares = [{
				id : 1,
				productName : "cd3"
			}, {
				id : 2,
				productName : "cd4"
			}, {
				id : 3,
				productName : "cd5"
			}];
	$scope.unCompares = [{
				id : 4,
				productName : "cd6"
			}, {
				id : 5,
				productName : "cd7"
			}, {
				id : 6,
				productName : "cd8"
			}];
	$scope.addCompare = function() {
		$scope.compares.push( {
					id : 6,
					productName : 'cd9'
				} );
	};
}