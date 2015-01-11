avalon.config( {
    loader: false,
    debug: true
} )


// 方便查看对象数据类型, 方便调试,要加入 | html 过滤去.列: { object | json | html }
avalon.filters.json = function ( obj ) {
    // obj = obj.$model ? obj.$model : obj;
    var JsonUti = {
        n: "\n",
        t: "	",
        convertToString: function ( a ) {
            return JsonUti.__writeObj( a, 1 )
        },
        __writeObj: function ( a, b, c ) {
            var d, e, f, g, h, i, j, k, l, m, n;
            if ( null == a )return "null";
            if ( a.constructor == Number || a.constructor == Date || a.constructor == String || a.constructor == Boolean )return d = a.toString(), e = c ? JsonUti.__repeatStr( JsonUti.t, b - 1 ) : "", a.constructor == String || a.constructor == Date ? e + ('"' + d + '"') : a.constructor == Boolean ? e + d.toLowerCase() : e + d;
            f = [];
            for ( g in a.$model ) {
                if ( h = [], i = JsonUti.__repeatStr( JsonUti.t, b ), h.push( i ), h.push( g + " : " ), j = a[ g ], null == j )h.push( "null" ); else if ( k = j.constructor, k == Array ) {
                    for ( h.push( JsonUti.n + i + "[" + JsonUti.n ), l = b + 2, m = [], n = 0; n < j.length; n++ )m.push( JsonUti.__writeObj( j[ n ], l, !0 ) );
                    h.push( m.join( "," + JsonUti.n ) ), h.push( JsonUti.n + i + "]" )
                } else k == Function ? h.push( "[Function]" ) : h.push( JsonUti.__writeObj( j, b + 1 ) );
                f.push( h.join( "" ) )
            }
            return (b > 1 && !c ? JsonUti.n : "") + JsonUti.__repeatStr( JsonUti.t, b - 1 ) + "{" + JsonUti.n + f.join( "," + JsonUti.n ) + JsonUti.n + JsonUti.__repeatStr( JsonUti.t, b - 1 ) + "}"
        }, __isArray: function ( a ) {
            return a ? a.constructor == Array : !1
        }, __repeatStr: function ( a, b ) {
            var d, c = [];
            if ( b > 0 )for ( d = 0; b > d; d++ )c.push( a );
            return c.join( "" )
        }
    };
    JsonUti.n = "<br />";
    JsonUti.t = "&nbsp;&nbsp;&nbsp;&nbsp;";
    return JsonUti.convertToString( obj );
}
