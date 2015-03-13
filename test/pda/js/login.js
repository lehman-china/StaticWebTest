var ionicApp = angular.module( 'ionicApp' );
ionicApp.controller( 'loginCtrl', function ( $scope, $state ) {
    $scope.signIn = function ( user ) {
        console.log( 'Sign-In', user );
        $state.go( 'tabs.home' );
    };
} );