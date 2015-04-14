var g_users = {};
var app = angular.module( 'myapp', [] );
/* js 代码, 就是个方法.  称做:angular的控制器  */
app.controller( "userController", function ( $scope, $http ) {
    $scope.selUser = {};

    // 数据源
    $scope.users = [];

    $http( {
        url: "data/users.json",
        method: "get"
    } ).success( function ( res ) {
        console.log( res );
        console.log( angular.toJson( res ) );
    } );

    g_users = $scope.users;
    $scope.editUser = function ( id ) {
        $scope.selUser = $scope.users[ getIndex( id ) ];
    };
    $scope.deleteUser = function ( id ) {
        $scope.users.splice( getIndex( id ), 1 );
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
    /**
     * 以userID ,查询对象在数组的索引位置
     */
    function getIndex( id ) {
        for ( var i in $scope.users ) {
            var user = $scope.users[ i ];
            if ( user.id == id ) {
                return i;
            }
        }
        return null;
    }

    /*// 监听变量, 变更 selUser 的值就会响应方法
     $scope.$watch( 'selUser', function() {
     alert( "测试监听指令:" );
     } );
     */
} );
function deleteUser2() {
    delete g_users.splice( 1, 1 );
}
