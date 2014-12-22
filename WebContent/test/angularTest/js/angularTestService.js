var module = angular.module( "my.new.module", [] );

function ctrl( $scope ) {
	$scope.value = "";
}

module.controller( "books.list", ctrl );

function func() {
	var v = $( "#myText" ).val();
	$( "#myText" ).val( v + "" + 8 );
	$( "#myText" ).keyup();

}

function TestCtrl( $scope ) {
	$scope.colors = [{
				name : 'black',
				shade : 'dark'
			}, {
				name : 'white',
				shade : 'light'
			}, {
				name : 'red',
				shade : 'dark'
			}, {
				name : 'blue',
				shade : 'dark'
			}, {
				name : 'yellow',
				shade : 'light'
			}];
	$scope.color = $scope.colors[2];
}