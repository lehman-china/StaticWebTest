var g_users = {};
var app = angular.module( 'myapp', [] );
/* js 代码, 就是个方法.  称做:angular的控制器  */

var app2 = angular.module( 'myapp2', [] )
app2.controller( "test2Ctrl", function ( $scope ) {
    $scope.isShow2 = true;

} );

app.controller( "testCtrl", function ( $scope ) {
    $scope.isShow = true;

    $scope.datas = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

    $scope.btn = "1";

    $scope.selUser = {};

    // 数据源
    $scope.users = [];

    $scope.editUser = function ( $index ) {
        $scope.selUser = $scope.users[ $index ];
    };
    $scope.deleteUser = function ( $index ) {
        $scope.users.splice( $index, 1 );
    };

    $scope.addUser = function () {
        var user = {
            id: new Date().getTime(),
            name: $scope.selUser.name,
            age: $scope.selUser.age
        };

        $scope.users.push( user );
    };

    $scope.order = function ( title ) {
        $scope.users.sort( function ( a, b ) {
            return a[ title ] > b[ title ] ? 1 : -1;
        } );
    };


    // 监听变量, 变更 selUser.age 年龄 的值就会响应方法
    $scope.$watch( 'selUser.age', function () {
        if ( $scope.selUser.age == "22" ) {
            alert( "你为什么要添加 22 岁?" );
        }
    } );

} );
