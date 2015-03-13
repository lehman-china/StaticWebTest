var ionicApp = angular.module( 'ionicApp' );
ionicApp.controller( 'HomeTabCtrl', function ( $scope ) {
    $scope.items = [ "扫码入库", "扫码出库", "库存盘点", "特殊出入库" ];
    console.log( 'HomeTabCtrl' );
} )