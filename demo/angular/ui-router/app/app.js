// TODO 主线模块名 = uiRouterSample
angular.module( "uiRouterSample", [ "uiRouterSample.contacts", "uiRouterSample.contacts.service", "uiRouterSample.utils.service", "ui.router", "ngAnimate" ] )
    // TODO  猜测 run  模块后的初始化.    $state,$stateParams 抛出到根空间
    .run( [ "$rootScope", "$state", "$stateParams", function ( $rootScope, $state, $stateParams ) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    } ] )
    .config( [ "$stateProvider", "$urlRouterProvider", function ( $stateProvider, $urlRouterProvider ) {
        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        // url的方法说,如果第一个参数,然后重定向到第二参数
        // 这里我们只是设置一些便利的url。
        // TODO 如果url 是第一个参数会自动重定向到 第二个参数url 这里只是方便用户 url 的输入.  无视.....
        $urlRouterProvider
            .when( "/c?id", "/contacts/:id" )
            .when( "/user/:id", "/contacts/:id" )
            .otherwise( "/" );
        // Use $stateProvider to configure your states.
        //使用$ stateProvider配置您的州。
        $stateProvider
            // Example of an inline template string. By default, templates
            // will populate the ui-view within the parent state's template.
            // For top level states, like this one, the parent template is
            // the index.html file. So this template will be inserted into the
            // ui-view within index.html.
            // 内联模板字符串的例子。默认情况下,模板
            //将在父的填充ui视图模板。
            //为顶级状态,这样,父模板
            // 索引。html文件。所以将插入到这个模板
            // index . html ui视图。
            //  TODO 首页 说明, 2个路由链接  无视.....
            .state( "home", {
                url: "/",
                template: '<p class="lead">Welcome to the UI-Router Demo</p>' + "<p>Use the menu above to navigate. " + "Pay attention to the <code>$state</code> and <code>$stateParams</code> values below.</p>" + '<p>Click these links—<a href="#/c?id=1">Alice</a> or ' + '<a href="#/user/42">Bob</a>—to see a url redirect in action.</p>'
            } )
            // TODO about关于页面 无子视图...无视....
            .state( "about", {
                url: "/about",
                templateProvider: [ "$timeout", function ( $timeout ) {
                    return $timeout( function () {
                        return '<p class="lead">UI-Router Resources</p><ul>' + '<li><a href="https://github.com/angular-ui/ui-router/tree/master/sample">Source for this Sample</a></li>' + '<li><a href="https://github.com/angular-ui/ui-router">Github Main Page</a></li>' + '<li><a href="https://github.com/angular-ui/ui-router#quick-start">Quick Start</a></li>' + '<li><a href="https://github.com/angular-ui/ui-router/wiki">In-Depth Guide</a></li>' + '<li><a href="https://github.com/angular-ui/ui-router/wiki/Quick-Reference">API Reference</a></li>' + "</ul>";
                    }, 100 );
                } ]
            } );
    } ] );