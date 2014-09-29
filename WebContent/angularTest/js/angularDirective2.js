var app = angular.module( 'myapp', [] );

// 自定义helloWorld指令
app.directive( 'drag', function( $document ) {
			return {
				restrict : 'AE',
				replace : true,
				template : '<div style="width:50px;height:50px;background-color:red;border-style: solid;border-width: 1px;"></div>',
				link : function( scope, element, attr ) {
					var startX = 0, startY = 0, x = 0, y = 0;

					element.css( {
								position : 'relative',
								border : '1px solid red',
								backgroundColor : 'lightgrey',
								cursor : 'pointer'
							} );

					element.on( 'mousedown', function( event ) {
								// Prevent default dragging of selected content
								event.preventDefault();
								startX = event.screenX - x;
								startY = event.screenY - y;
								$document.on( 'mousemove', mousemove );
								$document.on( 'mouseup', mouseup );
							} );

					function mousemove( event ) {
						y = event.screenY - startY;
						x = event.screenX - startX;
						element.css( {
									top : y + 'px',
									left : x + 'px'
								} );
					}

					function mouseup() {
						$document.unbind( 'mousemove', mousemove );
						$document.unbind( 'mouseup', mouseup );
					}
				}
			}
		} );

app.controller( "dragController", dragController );
function dragController() {

}