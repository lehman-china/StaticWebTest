var app = angular.module( 'myapp', [] );

// 移动块指令
app.directive( 'drag', function( $document ) {
			return {
				restrict : 'AE',
				replace : true,
				transclude : true,// 指令模板(template) 嵌入 html中的内容
				scope : true,
				template : '<div><div ng-transclude></div></div>',
				link : function( scope, element, attr ) {
					element.on( 'mousedown', function( event ) {
								// 点击后不可选择文字
								event.preventDefault();

								element.css( {
											'opacity' : '0.3',
											'position' : 'absolute',
											cursor : 'move'
										} );

								$document.on( 'mouseup', mouseup );
								$document.on( 'mousemove', mousemove );

							} );
					element.on( "mouseover", mouseover );
					function mouseover( e ) {
						// 事件停止冒泡
						if ( document.attachEvent ) {// ie
							window.event.cancelBubble = true;
						} else {
							e.stopPropagation();
						}
						scope.mark.drVarName = attr.drVarName;
						scope.mark.drIndex = attr.drIndex;
						scope.$apply();
					}
					function mousemove( event ) {
						var e = event || window.event;
						console.log( e.clientX )
						element.css( {
									'left' : (e.clientX + 20) + "px",
									'top' : (e.clientY + 20) + "px"
								} );
					}
					function mouseup() {
						var currentObj = scope[attr.drVarName][attr.drIndex];

						var copy = angular.copy( currentObj );
						scope[attr.drVarName].splice( attr.drIndex, 1 );

						scope[scope.mark.drVarName].splice( scope.mark.drIndex, 0, copy );

						scope.$apply();
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
	$scope.mark = {};
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
					id : new Date().getTime(),
					productName : 'cd' + (new Date().getTime())
				} );
	};
	$scope.testA = function() {
		$scope.mark.drVarName = 'compares';
		$scope.mark.drIndex = $scope.compares.length;
	};
	$scope.testB = function() {
		$scope.mark.drVarName = 'unCompares';
		$scope.mark.drIndex = $scope.unCompares.length;
	};
}