var app = angular.module( 'myapp', [] );

// 自定义helloWorld指令
app.directive( 'drag', function() {
			return {
				restrict : 'AE',
				replace : true,
				template : '<div style="width:50px;height:50px;background-color:red;border-style: solid;border-width: 1px;"></div>',
				link : function( scope, elem, attr ) {
					var _this = elem;
					_this.on( "mousedown", function( e ) {
								var _thisTop = _this.css( "top" );
								var x = e.pageX;
								var y = e.pageY - _thisTop;
								_this.css( {
											'opacity' : '0.3',
											'position' : 'absolute'
										} );
								$( document ).on( "mousemove", function( e ) {
											e = e || window.event;
											_this.css( {
														'left' : e.clientX + "px",
														'top' : e.clientY + "px"
													} );
										} );
								$( document ).on( "mouseup", function() {
											_this.unbind( "mousemove" );
											$( document ).unbind( "mousemove" ).unbind( "mouseup" );
											_this.css( 'opacity', '' );
										} );

							} );

				}
			}
		} );

app.controller( "dragController", dragController );
function dragController() {

}