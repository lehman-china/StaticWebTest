require.config( {
    // 默认情况下模块所在目录为起始目录
    baseUrl: '/common/js',

    paths: {
        "angular": "" + "framework/angular/angular1.2.28",
        "shivAndJson2": "" + "inc/shivAndJson2",
        "jquery": "" + "inc/jquery-1.8.3"
    }
} );

require( [ "angular" ], function () {
    var app = angular.module( 'myapp', [] );
    app.controller( "dragController", function ( $scope ) {
        $scope.user = {
            name: "lehman",
            age: 22
        };
        $scope.show = function () {
            return $scope.user.name;
        }
    } );

} );
