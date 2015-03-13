// 默认情况下模块所在目录为起始目录
var baseUrl = '/test/pda/common/js/';
require.config( {
    shim: {
        "ionic.bundel": {
            exports: 'angular'
        },
        "ngmodel.format": {
            deps: [ 'angular' ],
            exports: 'ngmodelFormat'
        },
        "commonUtil": [ 'jquery', 'jvalidator', 'FEUI' ],
        "FEUI": [ 'jquery' ]
    },
    paths: {
        "ionic.bundel": baseUrl + "framework/ionic/ionic.bundle.min",
        "ngmodel.format": baseUrl + "framework/angular/ngmodel.format",
        "jvalidator": baseUrl + "inc/jvalidator",// jq 表单验证
        "jquery": baseUrl + "inc/jquery",
        "commonUtil": baseUrl + "util/commonUtil",
        "FEUI": baseUrl + "util/FEUI"// 自己的ui
    },
    urlArgs: "bust=" + (new Date()).getTime()  //TODO 防止读取缓存，调试阶段使用
} );

require( [ "ionic.bundel" ], function () {
    var viewPath = "/test/pda/";
    angular.module( 'ionicApp', [ 'ionic' ] )
        .config( function ( $stateProvider, $urlRouterProvider ) {
            $stateProvider
                .state( 'login', {
                    url: "/login",
                    templateUrl: viewPath + "login.html",
                    controller: 'loginCtrl'
                } )
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

                .state( 'tabs.home', {
                    url: "/home",
                    views: {
                        'home-tab': {
                            templateUrl: viewPath + "home.html",
                            controller: 'HomeTabCtrl'
                        }
                    }
                } )
                .state( 'tabs.facts', {
                    url: "/facts",
                    views: {
                        'home-tab': {
                            templateUrl: "facts.html"
                        }
                    }
                } )
                .state( 'tabs.facts2', {
                    url: "/facts2",
                    views: {
                        'home-tab': {
                            templateUrl: "facts2.html"
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
                } )
                .state( 'tabs.navstack', {
                    url: "/navstack",
                    views: {
                        'about-tab': {
                            templateUrl: "nav-stack.html"
                        }
                    }
                } )
                .state( 'tabs.contact', {
                    url: "/contact",
                    views: {
                        'contact-tab': {
                            templateUrl: "contact.html"
                        }
                    }
                } );

            // 否则进入
            $urlRouterProvider.otherwise( "/login" );
        } );

    // 载入各个模板的控制器,然后启动angular编译页面
    var ctrls = [ "home", "login" ];

    var ctrlPath = '/test/pda/js/';
    for ( var i = 0; i < ctrls.length; i++ ) {
        ctrls[ i ] = ctrlPath + ctrls[ i ] + ".js";
    }
    require( ctrls, function () {
        // require加载器,需要用bootstrap来启动angular编译页面
        angular.bootstrap( document.getElementsByTagName( "body" ), [ 'ionicApp' ] );
    } );
} );
