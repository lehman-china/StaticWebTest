// TODO 主要是一个工厂,   提供联系人数据的.  全部联系人,或指定联系人
angular.module( 'uiRouterSample.contacts.service', [] )
    // A RESTful factory for retrieving contacts from 'contacts.json'
    //基于rest的工厂从“contacts.json”检索联系人
    .factory( 'contacts', [ '$http', 'utils', function ( $http, utils ) {
        // TODO ajax 取 联系人json 的数据
        var path = 'assets/contacts.json';
        var contacts = $http.get( path ).then( function ( resp ) {
            return resp.data.contacts;
        } );
        //  　TODO 查找全部联系人, 货指定联系人
        var factory = {};
        factory.all = function () {
            console.log( contacts  )
            return contacts;
        };
        factory.get = function ( id ) {

            return contacts.then( function () {
                console.log( contacts  )
                console.log( 123123  )
                return utils.findById( contacts, id );
            } )
        };
        return factory;
    } ] );
