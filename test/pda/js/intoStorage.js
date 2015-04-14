var ionicApp = angular.module( 'ionicApp' );
ionicApp.controller( 'intoStorageCtrl', function ( $scope ) {

    $scope.items = [];
    var time = new Date().getTime();
    for ( var i = 1; i <= 100; i++ ) {
        $scope.items.push( { val: '来料收货1' + i, createTime: time } );

    }
    $scope.getTime = function () {
        return new Date().getTime();
    }
} );

