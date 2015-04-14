var ionicApp = angular.module( 'ionicApp' );
ionicApp.controller( 'selectAccountBookCtrl', function ( $scope, $state ) {
    $scope.into = function () {
        $state.go( 'tabs.home' );
    };
} );