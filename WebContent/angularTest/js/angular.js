$.plug( "ajax", function( $ ) {
			function _xhr() {
				if ( null != _xhrf )
					return _xhrf();
				for ( var e = 0, t = xhrs.length; t > e; e++ )
					try {
						var a = xhrs[e], r = a();
						if ( null != r )
							return _xhrf = a, r
					} catch ( n ) {
					}
				return function() {
				}
			}
			function _xhrResp( xhr, dataType ) {
				if ( dataType = (dataType || xhr.getResponseHeader( "Content-Type" ).split( ";" )[0]).toLowerCase(), dataType.indexOf( "json" ) >= 0 ) {
					var j = !1;
					return j = window.JSON ? window.JSON.parse( xhr.responseText ) : eval( xhr.responseText )
				}
				return dataType.indexOf( "script" ) >= 0 ? eval( xhr.responseText ) : dataType.indexOf( "xml" ) >= 0 ? xhr.responseXML : xhr.responseText
			}
			function ajax( e, t ) {
				var a, r = _xhr(), n = 0;
				"object" == typeof e ? t = e : t.url = e, t = $._defaults( t, {
							userAgent : "XMLHttpRequest",
							lang : "en",
							type : "GET",
							data : null,
							contentType : "application/x-www-form-urlencoded",
							dataType : null,
							processData : !0,
							headers : {
								"X-Requested-With" : "XMLHttpRequest"
							},
							cache : !0
						} ), t.timeout && (a = setTimeout( function() {
							r.abort(), t.timeoutFn && t.timeoutFn( t.url )
						}, t.timeout ));
				var s = $( t.context || document ), o = s;
				r.onreadystatechange = function() {
					if ( 4 == r.readyState ) {
						if ( a && clearTimeout( a ), r.status < 300 ) {
							var e, u = !0, c = t.dataType || "";
							try {
								e = _xhrResp( r, c, t )
							} catch ( i ) {
								u = !1, t.error && t.error( r, r.status, r.statusText ), o.trigger( s, "ajaxError", [r, r.statusText, t] )
							}
							t.success && u && (c.indexOf( "json" ) >= 0 || e) && t.success( e ), o.trigger( s, "ajaxSuccess", [r, e, t] )
						} else
							t.error && t.error( r, r.status, r.statusText ), o.trigger( s, "ajaxError", [r, r.statusText, t] );
						t.complete && t.complete( r, r.statusText ), o.trigger( s, "ajaxComplete", [r, t] )
					} else
						t.progress && t.progress( ++n )
				};
				var e = t.url, u = null, c = 1 == t.cache, i = "POST" == t.type || "PUT" == t.type;
				t.data && t.processData && "object" == typeof t.data && (u = $.formData( t.data )), !i && u && (e += "?" + u, u = null, c || (e = e + "&_=" + (new Date).getTime())), e = e + "?_=" + (new Date).getTime(), c = null, r.open( t.type, e );
				try {
					for ( var p in t.headers )
						r.setRequestHeader( p, t.headers[p] )
				} catch ( x ) {
					console.log( x )
				}
				i && (t.contentType.indexOf( "json" ) >= 0 && (u = t.data), r.setRequestHeader( "Content-Type", t.contentType )), r.send( u )
			}
			var xhrs = [function() {
						return new XMLHttpRequest
					}, function() {
						return new ActiveXObject( "Microsoft.XMLHTTP" )
					}, function() {
						return new ActiveXObject( "MSXML2.XMLHTTP.3.0" )
					}, function() {
						return new ActiveXObject( "MSXML2.XMLHTTP" )
					}], _xhrf = null;
			$.xhr = _xhr, $._xhrResp = _xhrResp, $.formData = function( e ) {
				var t = [], a = /%20/g;
				for ( var r in e )
					t.push( encodeURIComponent( r ).replace( a, "+" ) + "=" + encodeURIComponent( e[r].toString() ).replace( a, "+" ) );
				return t.join( "&" )
			}, $.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( e, t ) {
						$.fn[t] = function( e ) {
							return this.bind( t, e )
						}
					} ), $.ajax = ajax, $.getJSON = function( e, t, a, r ) {
				$.isFunction( t ) && (r = a, a = t, t = null), ajax( {
							url : e,
							data : t,
							success : a,
							dataType : "json"
						} )
			}, $.get = function( e, t, a, r ) {
				$.isFunction( t ) && (r = a, a = t, t = null), ajax( {
							url : e,
							type : "GET",
							data : t,
							success : a,
							dataType : r || "text/plain"
						} )
			}, $.post = function( e, t, a, r ) {
				$.isFunction( t ) && (r = a, a = t, t = null), ajax( {
							url : e,
							type : "POST",
							data : t,
							success : a,
							dataType : r || "text/plain"
						} )
			}, $.getScript = function( e, t ) {
				return $.get( e, void 0, t, "script" )
			}, window.JSON || $.loadAsync( "http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js" )
		} );
