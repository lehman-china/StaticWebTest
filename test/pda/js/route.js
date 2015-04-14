require( [ "ionic.bundel","FEUI","jvalidator" ], function () {
    var viewPath = "/test/pda/";
    angular.module( 'ionicApp', [ 'ionic' ] )
        .config( function ( $stateProvider, $urlRouterProvider ) {
            $stateProvider
                // 登录
                .state( 'login', {
                    url: "/login",
                    templateUrl: viewPath + "login.html",
                    controller: 'loginCtrl'
                } )
                // 选择账套
                .state( 'selectAccountBook', {
                    url: "/select-account-book",
                    templateUrl: viewPath + "select-account-book.html",
                    controller: 'selectAccountBookCtrl'
                } )
                // 忘记密码
                .state( 'forgotpassword', {
                    url: "/forgot-password",
                    templateUrl: "forgot-password.html"
                } )
                // 底座
                .state( 'tabs', {
                    url: "/tab",
                    abstract: true,
                    templateUrl: "tabs.html"
                } )

                .state( 'tabs.into_storage', {
                    url: "/into_storage",
                    views: {
                        'intoStorage-tab': {
                            templateUrl: viewPath + "into_storage.html",
                            controller: 'intoStorageCtrl'
                        }
                    }
                } )
                .state( 'tabs.home', {
                    url: "/home",
                    views: {
                        'home-tab': {
                            templateUrl: viewPath + "home.html",
                            controller: 'HomeTabCtrl'
                        }
                    }
                } )
                .state( 'tabs.about', {
                    url: "/about",
                    views: {
                        'about-tab': {
                            templateUrl: "about.html"
                        }
                    }
                } );

            // 否则进入
            $urlRouterProvider.otherwise( "/login" );
        } );

    // 这里配置路由的控制器js,载入各个模板的控制器,然后启动angular编译页面
    var ctrls = [ "home", "login","selectAccountBook","intoStorage" ];

    var ctrlPath = '/test/pda/js/';
    for ( var i = 0; i < ctrls.length; i++ ) {
        ctrls[ i ] = ctrlPath + ctrls[ i ] + ".js";
    }
    require( ctrls, function () {
        // require加载器,需要用bootstrap来启动angular编译页面
        angular.bootstrap( document.getElementsByTagName( "body" ), [ 'ionicApp' ] );
    } );
} );
