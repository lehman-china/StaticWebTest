angular.module( 'uiRouterSample.utils.service', [] )
    .factory( 'utils', function () {
        return {
            // Util for finding an object by its 'id' property among an array
            // Util寻找对象的id的属性数组
            findById: function findById( a, id ) {
                for ( var i = 0; i < a.length; i++ ) {
                    if ( a[ i ].id == id ) return a[ i ];
                }
                return null;
            },

            // Util for returning a random key from a collection that also isn't the current key
            // 生成一个随机的内容ID ,且不是当前的内容ID
            newRandomKey: function newRandomKey( coll, key, currentKey ) {
                var randKey;
                do {
                    randKey = coll[ Math.floor( coll.length * Math.random() ) ][ key ];
                } while ( randKey == currentKey );
                return randKey;
            }
        };
    } );
