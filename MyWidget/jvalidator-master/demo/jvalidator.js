// TODO 10封装一下,使其可以验证嵌套区域
var JValidator = function ( formSelector ) {
    var Async = function () {
        this.reqs = [];
        this.status = 0;    //0-waithing,1-running
    };
    Async.prototype.addRequest = function ( func ) {
        if ( this.status != 0 ) return;
        this.reqs.push( func );
    };

    Async.prototype.go = function () {
        if ( this.status != 0 ) return;

        this.status = 1;
        var self = this;
        var reqs = this.reqs;
        var len = this.reqs.length;

        for ( var i = 0; i < reqs.length; i++ ) {
            var req = reqs[ i ];

            if ( this.status == 0 ) return;
            req( function () {
                //async_continue
                len--;
                if ( len == 0 ) {
                    self.finish();
                }
            } );

        }
    };

    Async.prototype.finish = function () {
        this.status = 0;
        if ( this.onfinished ) {
            this.onfinished();
        }
    };

    Async.prototype.clear = function () {
        if ( this.status != 0 ) return;
        this.reqs = [];
    };

//**********************************************************************************************************************
    var PARSER = {};

    function _tokenized( str ) {
        var s = [];
        for ( var i = 0; i < str.length; i++ ) {
            var chr = str.charAt( i );
            switch ( chr ) {
                case '(':
                case ')':
                case '!':
                case '&':
                case '|':
                    s.push( chr );
                    s.push( '' );
                    break;
                default:
                    s.length ? s[ s.length - 1 ] += chr : s.push( chr );
                    break;
            }
        }
        return s;
    }

    var regName = /^(@?[\w\-]+)(\[.+\])?$/;

    function _parse( tokens ) {
        var ast = [];
        var o = null;
        var token;
        while ( (token = tokens.shift() ) !== void 0 ) {
            if ( !token ) {
                continue;
            }
            switch ( token ) {
                case '(':
                case ')':
                case '!':
                case '&':
                case '|':
                    ast.push( token );
                    break;
                default:
                    var a = token.match( regName );
                    if ( !a ) continue;
                    if ( a[ 1 ].charAt( 0 ) == '@' ) {
                        o = { name: '@', elemName: a[ 1 ].replace( '@', '' ) };
                    } else {
                        o = { name: a[ 1 ] };
                    }
                    if ( !PARSER[ o.name ] ) {
                        throw "not found parser's name : " + o.name;
                    }
                    if ( a[ 2 ] ) o.value = a[ 2 ].replace( '[', '' ).replace( ']', '' );
                    ast.push( o );
                    o = null;
                    break;
            }
        }
        return ast;
    }

    var parser = {
// 增加解析器
// *name* 解析器名称
// *options.argument* 带有参数，默认没有
        add: function ( name, options ) {
            PARSER[ name ] = options || {};
            PARSER[ name ].name = name;
        },
        parse: function ( str ) {
            var tokens = _tokenized( str );
            var ast = _parse( tokens );
            return ast;
        }
    };
//**********************************************************************************************************************
    var $valiTag = null;// TODO 修改点1 要验证的元素,以前只能验证form
    var PATTERNS = {}
    var CONSTANT = {
        PATTERN: "",
        PLACEHOLDER: "jvalidator-placeholder",
        CNAME: "jvalidator-cname",
        MESSAGE_ATTR: "__jvalidator_messages__",
        FIELD_EVENTS: "__jvalidator_events__",
        DEBUG: "jvalidator-debug"
    }

// ## 字段检查器
// 绑定到某个字段后，对其进行检查等操作
    function FieldChecker( element ) {
        this.element = element;
        this.$element = $( element );
        this.$form = this.$element.closest( $valiTag );
        this.async = new Async();
    }

    FieldChecker.prototype = {

        _getPatternMessage: function ( results ) {
            var rstr = [];
            for ( var i = 0; i < results.length; i++ ) {
                var p = results[ i ];
                if ( p.name ) {
                    rstr.push( p.getMessage() );
                } else {
                    switch ( p ) {
                        case '&&':
                            rstr.push( ' 并且 ' );
                            break;
                        case '||':
                            rstr.push( ' 或者 ' );
                            break;
                        case '!':
                            rstr.push( '不' );
                            break;
                    }
                }
            }
            return rstr.join( '' );
        },

        // 检查生成结果并返回错误信息
        // return errors
        _checkPatternResult: function ( str, results ) {
            var self = this;
            var rstr = [];
            for ( var i = 0; i < results.length; i++ ) {
                var p = results[ i ];
                if ( p.name ) {
                    rstr.push( p.result );
                } else {
                    rstr.push( p );
                }
            }

            if ( this.$form.attr( "data-" + CONSTANT.DEBUG ) ) {
                console.info( this, this.element, str, rstr.join( '' ) )
            }

            var all = eval( rstr.join( '' ) );
            if ( all ) {
                return [];
            } else {
                var arr = $.grep( results, function ( e, idx ) {
                    return e.name && e.result === false;
                } );
                arr.getMessage = function () {
                    return self._getPatternMessage( results );
                }
                return arr;
            }
        },

        // 验证自身的 pattern 是否合法以及是否满足所有项，以供开发自测使用
        checkPattern: function () {
            var $e = this.$element;
            var rule_str = $e.attr( "data-" + CONSTANT.PATTERN );
            try {
                var patterns = parser.parse( rule_str );
            } catch ( e ) {
                console.error( this.element, '验证器语法有错误，请检查', rule_str );
                console.error( '错误可能是：', e );
            }
        },

        // * done *
        //  可以不传，即为触发检查
        //  `checkResult` boolean 检查结果
        //  `evt` 为触发的事件，可以没有
        //  `errors` array 错误信息
        check: function ( $event, checkCallback ) {

            var self = this;
            var async = this.async;
            var e = this.element;
            var $e = this.$element;
            var value = this.value();
            var rule_str = $e.attr( "data-" + CONSTANT.PATTERN );
            var patterns = parser.parse( rule_str );

            async.clear();
            async.onfinished = function () {
                var errors = self._checkPatternResult( rule_str, patterns );

                self.after_check( errors.length == 0, errors, $event );
                if ( checkCallback ) {
                    checkCallback( errors.length == 0, errors );
                }
            };

            $.each( patterns, function () {
                // 跳过所有计算变量
                if ( !this.name ) return;

                // p 其中包括
                // argument - 可能有
                // message - 原始的message设置
                // validate - 验证规则
                // rule_str解析出来的内容 name(同patternName) , elemName(@才会有) , value(pattern的属性值)
                // element - 对应的 element
                // result - 验证后，会对该项设置 true 或 false
                var p = $.extend( this, {
                    element: self.element,
                    $element: self.$element,
                    $form: self.$form,
                    getMessage: function () {
                        return self._getMessage.call( this, value );
                    },
                    // 用来解析 parsedstr(它是带有@的内容) 的值，解析成功就返回那个 element ，否则返回 null
                    parseNameSymbol: function ( parsedstr ) {
                        if ( parsedstr.charAt( 0 ) !== '@' ) return null;
                        return this.$form.find( _parse_selector_syntax( parsedstr ) )[ 0 ];
                    },

                    // 当 pattern 是 @xx[xx] 时， 则可以通过该方法取得 @ 对应的元素
                    getNameSymbol: function () {
                        return this.parseNameSymbol( '@' + this.elemName );
                    },

                    // 当 pattern 是 xx[xx] 时， 则可以通过该方法取得括号中的值
                    // 如果值为 @xxx , 则返回该元素
                    // 否则返回值
                    getValueSymbol: function () {
                        var el = this.parseNameSymbol( this.value );
                        return el ? el : this.value;
                    },

                    getElementValue: function ( el ) {
                        el = $( el )[ 0 ]
                        if ( !el ) return "";
                        var jv = _getFieldValidator( el )
                        return jv ? jv.value() : self.value.call( {
                            element: el,
                            $element: $( el ),
                            $form: self.$form
                        } );
                    },

                    // 得到元素的 cname 或 name
                    getElementName: function ( el ) {
                        var $el = $( el );
                        if ( $el.attr( "data-" + CONSTANT.CNAME ) ) {
                            return $el.attr( "data-" + CONSTANT.CNAME )
                        } else {
                            return $el.attr( 'name' );
                        }
                        return "";
                    }

                }, PATTERNS[ this.name ] );

                (function ( p ) {
                    async.addRequest( function ( async_continue ) {
                        // isvalid - 是否验证成功
                        p.validate( value, function ( is_valid ) {
                            p.result = is_valid;
                            async_continue();
                        }, $event );

                    } );
                })( p );
            } )

            async.go();

        },

        // 根据 patternName 得到错误信息
        // 优先级为：字段的message设置 > pg的message设置 > pattern的标准设置
        // * value * 为值，如果不传则重新获取
        // * 由 p 进行调用
        _getMessage: function ( value ) {

            var self = this;
            var patternName = this.name;
            var e = this.element;
            var $e = this.$element;
            var $f = this.$form;
            var v = value || _getFieldValidator( e ).value();
            var msg_tmpl = $e.attr( 'data-jvalidator-message' )
                || ( e[ CONSTANT.MESSAGE_ATTR ] ? e[ CONSTANT.MESSAGE_ATTR ][ patternName ] : null )
                || ( $f[ 0 ][ CONSTANT.MESSAGE_ATTR ] ? $f[ 0 ][ CONSTANT.MESSAGE_ATTR ][ patternName ] : null )
                || ( PATTERNS[ patternName ].message );

            msg_tmpl = msg_tmpl.replace( /%val\b/g, v )
            msg_tmpl = msg_tmpl.replace( /%name\b/g, e.name )
            msg_tmpl = msg_tmpl.replace( /%cname\b/g, $e.attr( "data-" + CONSTANT.CNAME ) )
            msg_tmpl = msg_tmpl.replace( /=%argu\b/g, function () {
                var v = self.parseNameSymbol( self.value );
                return v && v.tagName ? self.getElementValue( v ) : self.value;
            } )
            msg_tmpl = msg_tmpl.replace( /%argu\b/g, function () {
                var v = self.parseNameSymbol( self.value );
                return v && v.tagName ? self.getElementName( v ) : self.value;
            } )
            msg_tmpl = msg_tmpl.replace( /@@/g, function ( $0, $1 ) {
                var el = $f.find( _parse_selector_syntax( "@" + self.elemName ) )[ 0 ]
                if ( !el ) {
                    return "";
                } else {
                    var $el = $( el );
                    if ( $el.attr( "data-" + CONSTANT.CNAME ) ) {
                        return $el.attr( "data-" + CONSTANT.CNAME )
                    } else {
                        return $el.attr( 'name' );
                    }
                }
            } )
            msg_tmpl = msg_tmpl.replace( /=@([^\s]*)\b/g, function ( $0, $1 ) {
                return self.getElementValue( $f.find( '[name=' + $1 + ']' ) )
            } )
            msg_tmpl = msg_tmpl.replace( /@([^\s]*)\b/g, function ( $0, $1 ) {
                return self.getElementName( $f.find( '[name=' + $1 + ']' ) ) || "";
            } )
            return msg_tmpl;

        },

        // 根据不同的字段类型，取得 element 的值
        value: function () {
            var e = this.element, $e = this.$element, $form = this.$form, placeholdertext;
            switch ( e.tagName.toLowerCase() ) {
                case 'input':
                    switch ( e.type ) {
                        case 'radio':
                            return $form.find( 'input[name=' + e.name + ']:radio:checked' ).val()
                        case 'checkbox':
                            return $form.find( 'input[name=' + e.name + ']:checkbox:checked' ).map( function () {
                                return this.value;
                            } ).toArray().join( ',' );
                        case 'text':
                            placeholdertext = $e.attr( "data-" + CONSTANT.PLACEHOLDER );
                            return placeholdertext === e.value ? "" : e.value;
                        case 'hidden':
                        case 'password':
                            return e.value;
                    }
                    break;
                case 'select':
                    return e.value;
                case 'textarea':
                    placeholdertext = $e.attr( "data-" + CONSTANT.PLACEHOLDER );
                    return placeholdertext === e.value ? "" : e.value;
                default:
                    var r;
                    r = $e.attr( 'data-value' );
                    if ( typeof r != 'undefined' ) return r;
                    r = e.value;
                    if ( typeof r != 'undefined' ) return r;
                    return r;
            }
        },

        // 触发自验证行为
        after_check: function ( is_valid, errors, $event ) {
            var type = is_valid ? 'success' : 'fail';
            var evt = this.$element.data( CONSTANT.FIELD_EVENTS + type );
            if ( !evt ) evt = this.$form.data( CONSTANT.FIELD_EVENTS + type );
            if ( !evt || typeof evt != 'function' ) return;

            evt.call( this, $event, errors );
        }

    };


// ## 表单验证器

    function FormValidator( form ) {
        if ( !form ) throw "[ERROR] 验证元素不存在"// TODO 2 去除只能验证form的判断
        this.form = $valiTag = form;//TODO 3 记录到$valiTag
        CONSTANT.PATTERN = "jvalidator-" + form.id;
        this.$form = $( form );
        this.async = new Async();
    }

// 判断元素可见并存在
    function _exists( el ) {
        //TODO 4 允许验证hidden
        return $( el ).closest( 'body' ).size() > 0 && ($( el ).is( ":visible" ) || $( el ).attr( "type" ) == "hidden");
    }

// 得到指定元素的jvalidator
    function _getFieldValidator( el ) {
        if ( el.nodeName == "INPUT" && ( el.type == "checkbox" || el.type == "radio" ) ) {
            el = $( el ).closest( $valiTag ).find( "input[data-" + CONSTANT.PATTERN + "][name=" + el.name + "]" )[ 0 ];
        }
        if ( !el ) return;
        if ( !$( el ).attr( "data-" + CONSTANT.PATTERN ) ) return;
        return el._field_validator ? el._field_validator : ( el._field_validator = new FieldChecker( el ) );
    }

// 解析 when 中的支持 @name 的 selector 语法
    function _parse_selector_syntax( selector ) {
        return ( selector || "" ).replace( /@([a-z][a-z0-9]*)\b/ig, '[name=$1]' );
    }

    FormValidator.prototype = {

        // 得到所有需要验证的字段（非隐藏且不为disabled）
        _getAllFieldValidator: function () {
            var self = this;
            return this.$form.find( '[data-' + CONSTANT.PATTERN + ']' ).filter( function () {
                return _exists( this ) && !this.disabled;
            } ).map( function () {
                return _getFieldValidator( this );
            } ).toArray();
        },

        // 验证本表单中所有元素的 pattern 是否正确
        checkAllPatterns: function () {
            var _jvs = this._getAllFieldValidator();
            $.each( _jvs, function () {
                this.checkPattern();
            } );
        },

        // 验证表单内所有字段
        validateAll: function ( validateAllCallback ) {
            var $form = this.$form;
            var async = this.async;
            var _jvs = this._getAllFieldValidator();
            var errors = [];

            async.clear();
            async.onfinished = function () {
                validateAllCallback && validateAllCallback( errors.length == 0, errors );
            }

            // 当没有任何可以验证的字段时直接返回
            if ( !_jvs.length ) {
                return validateAllCallback( true, [] );
            }

            for ( var i = 0; i < _jvs.length; i++ ) {
                var jv = _jvs[ i ];

                (function ( jv ) {
                    async.addRequest( function ( async_continue ) {
                        jv.check( null, function ( checkResult, error ) {
                            if ( !checkResult ) {
                                errors.push( error )
                            }
                            async_continue();
                        } );
                    } );
                })( jv );

            }

            async.go();
        },

        // 当你需要字段自触发验证时，比如：input blur时需要验证，请使用该方法.
        // selector 是需要自触发验证的字段 - 如果不写则默认全部。<br />
        // evts 有两种写法:
        // ##### 第一种：
        // > [ 'blur' , 'focus' , 'keypress' ]
        //
        // 代表 selector 的 [ 'blur' , 'focus' , 'keypress' ] 事件会触发 selector 的验证
        //
        // ##### 第二种：
        // > \{ <br />
        // >     '@sel' : [ 'blur' , 'keypress' ]
        // > \} <br />
        //
        // 代表 由@sel 的 [ 'blur' , 'keypress' ] 事件会触发 selector 的验证

        when: function ( selector, evts ) {
            if ( typeof selector != 'string' ) {
                evts = selector;
                selector = "";
            }

            var events = {};
            var sel = selector || "[data-" + CONSTANT.PATTERN + "]";

            // 处理 checkbox 和 radio
            var chks = this.$form.find( sel ).filter( 'input:checkbox' );
            if ( chks.length ) {
                chks.each( function () {
                    sel += "," + _parse_selector_syntax( "@" + this.name )
                } );
            }

            var rdos = this.$form.find( sel ).filter( 'input:radio' );
            if ( rdos.length ) {
                rdos.each( function () {
                    sel += "," + _parse_selector_syntax( "@" + this.name )
                } );
            }

            if ( $.isArray( evts ) ) {
                events[ sel ] = evts;//
            } else if ( $.isPlainObject( evts ) ) {
                $.extend( events, evts );
            }

            for ( var targetSelector in events ) {
                var _sel = _parse_selector_syntax( targetSelector );
                var _evts = ( events[ targetSelector ] || [] );
                if ( !_evts.length ) continue;
                _evts = _evts.join( ' ' );

                this.$form.undelegate( _sel, _evts );

                this.$form.delegate( _sel, _evts, function ( $event ) {
                    var jv = _getFieldValidator( this );
                    jv && jv.check( $event );
                } )
            }

        },

        setMessage: function ( selector, patternName, msg ) {

            if ( arguments.length == 2 ) {
                msg = patternName;
                patternName = selector;
                selector = null;
            }

            var c, f = this.$form[ 0 ];

            if ( !selector ) {
                c = f[ CONSTANT.MESSAGE_ATTR ] = f[ CONSTANT.MESSAGE_ATTR ] || {};
                c[ patternName ] = msg;
            } else {
                this.$form.find( _parse_selector_syntax( selector ) ).each( function () {
                    var e = this;
                    c = e[ CONSTANT.MESSAGE_ATTR ] = e[ CONSTANT.MESSAGE_ATTR ] || {};
                    c[ patternName ] = msg;
                } );
            }

        },

        success: function ( selector, fn ) {
            this._bind_field_event( 'success', selector, fn );
        },

        fail: function ( selector, fn ) {
            this._bind_field_event( 'fail', selector, fn );
        },

        _bind_field_event: function ( type, selector, fn ) {

            if ( !type ) return;

            if ( typeof selector == 'function' ) {
                fn = selector;
                selector = null;
            }

            if ( selector ) {
                var sel = _parse_selector_syntax( selector );
                this.$form.find( sel ).each( function () {
                    $( this ).data( CONSTANT.FIELD_EVENTS + type, fn );
                } )
            } else {
                this.$form.data( CONSTANT.FIELD_EVENTS + type, fn );
            }

        },
        addPattern: function ( name, options ) {
            addPattern( name, options );
        }
    }
    // 设置增加自定义 pattern 的入口
    function addPattern( name, options ) {
        if ( !name || !options || !options.message || !options.validate ) throw "[ERROR] add pattern - on param:name:string,{message:string,validate:function}";

        PATTERNS[ name ] = $.extend( {
            name: name
        }, options );

        parser.add( name, options );
    }

//*****************************************自带的一些验证**************************************************************************
//TODO 5删除,身份证验证,太长了
    addPattern( 'required', {
        message: '必须填写',
        validate: function ( value, done ) {
            done( value !== "" );
        }
    } );

    addPattern( 'non-required', {
        message: '允许为空',
        validate: function ( value, done ) {
            done( value === "" );
        }
    } );

    addPattern( 'numeric', {
        message: '必须是数字',
        validate: function ( value, done ) {
            done( /^\d+$/.test( value ) );
        }
    } );


    addPattern( 'int', {
        message: '必须是整数',
        validate: function ( value, done ) {
            done( /^\-?\d+$/.test( value ) );
        }
    } );

    addPattern( 'decimal', {
        message: '必须是小数',
        validate: function ( value, done ) {
            done( /^\-?\d*\.?\d+$/.test( value ) );
        }
    } );


    addPattern( 'alpha', {
        message: '必须是字母',
        validate: function ( value, done ) {
            done( /^[a-z]+$/i.test( value ) );
        }
    } );

    addPattern( 'alpha_numeric', {
        message: '必须为字母或数字',
        validate: function ( value, done ) {
            done( /^[a-z0-9]+$/i.test( value ) );
        }
    } );

    addPattern( 'alpha_dash', {
        message: '必须为字母或数字及下划线等特殊字符',
        validate: function ( value, done ) {
            done( /^[a-z0-9_\-]+$/i.test( value ) );
        }
    } );

    addPattern( 'chs', {
        message: '必须是中文字符',
        validate: function ( value, done ) {
            done( /^[\\u4E00-\\u9FFF]+$/i.test( value ) );
        }
    } );

    addPattern( 'chs_numeric', {
        message: '必须是中文字符或数字',
        validate: function ( value, done ) {
            done( /^[\\u4E00-\\u9FFF0-9]+$/i.test( value ) );
        }
    } );

    addPattern( 'chs_numeric', {
        message: '必须是中文字符或数字及下划线等特殊字符',
        validate: function ( value, done ) {
            done( /^[\\u4E00-\\u9FFF0-9_\-]+$/i.test( value ) );
        }
    } );


    addPattern( 'match', {
        argument: true,
        message: '必须与 %argu 相同',
        validate: function ( value, done ) {
            var v = this.getValueSymbol();
            var vv = v && v.tagName ? this.getElementValue( v ) : v;
            done( vv === value );
        }
    } );

    addPattern( 'contain', {
        argument: true,
        message: '必须包含"%argu"的内容',
        validate: function ( value, done ) {
            var v = this.getValueSymbol();
            var vv = v && v.tagName ? this.getElementValue( v ) : v;
            done( !!~value.indexOf( vv ) );
        }
    } );


    addPattern( '@', {
        argument: true,
        message: '@@必须为 %argu',
        validate: function ( value, done ) {
            var v = this.getValueSymbol();
            var at = this.getNameSymbol();
            if ( v === null || at === null ) {
                done( false );
            } else {
                var vv = v && v.tagName ? this.getElementValue( v ) : v;
                var vat = at && at.tagName ? this.getElementValue( at ) : at;
                done( vv === vat );
            }

        }
    } );


    addPattern( 'passport', {
        message: '护照格式错误或过长',
        validate: function ( value, done ) {
            done( /^[a-zA-Z0-9]{0,20}$/i.test( value ) );
        }
    } );

    addPattern( 'email', {
        message: '邮件地址错误',
        validate: function ( value, done ) {
            done( /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/.test( value ) );
        }
    } );

    addPattern( 'min_length', {
        argument: true,
        message: '最少输入%argu个字',
        validate: function ( value, done ) {
            var n = parseInt( this.value, 10 );
            done( value.length >= n );
        }
    } );

    addPattern( 'max_length', {
        argument: true,
        message: '最多输入%argu个字',
        validate: function ( value, done ) {
            var n = parseInt( this.value, 10 );
            done( value.length <= n );
        }
    } );


    addPattern( 'length', {
        argument: true,
        message: '长度必须为%argu个字符',
        validate: function ( value, done ) {
            var n = parseInt( this.value, 10 );
            done( value.length === n );
        }
    } );


    addPattern( 'greater_than', {
        argument: true,
        message: '必须大于%argu',
        validate: function ( value, done ) {
            var v = parseInt( value, 10 );
            var n = this.parseNameSymbol( this.value );
            n = parseFloat( n && n.tagName ? this.getElementValue( n ) : this.value );
            done( v > n )
        }
    } );

    addPattern( 'less_than', {
        argument: true,
        message: '必须小于%argu',
        validate: function ( value, done ) {
            var v = parseInt( value, 10 );
            var n = this.parseNameSymbol( this.value );
            n = parseFloat( n && n.tagName ? this.getElementValue( n ) : this.value );
            done( v < n )
        }
    } );

    addPattern( 'equal', {
        argument: true,
        message: '必须等于%argu',
        validate: function ( value, done ) {
            var v = parseInt( value, 10 );
            var n = this.parseNameSymbol( this.value );
            n = parseFloat( n && n.tagName ? this.getElementValue( n ) : this.value );
            done( v == n )
        }
    } );

    addPattern( 'ip', {
        message: '必须符合ip格式',
        validate: function ( value, done ) {
            done( /^((25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.){3}(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})$/i.test( value ) );
        }
    } );

    addPattern( 'date', {
        message: '必须符合日期格式 YYYY-MM-DD',
        validate: function ( value, done ) {
            done( /^\d\d\d\d\-\d\d\-\d\d$/.test( value ) );
        }
    } );
    /**
     * 手机号码
     */
    addPattern( 'mobile', {
        message: '手机号码格式不正确',
        validate: function ( value, done ) {
            //规则取自淘宝注册登录模块
            var phoneOne = {
                //中国移动
                cm: /^(?:0?1)((?:3[56789]|5[0124789]|8[278])\d|34[0-8]|47\d)\d{7}$/,
                //中国联通
                cu: /^(?:0?1)(?:3[012]|4[5]|5[356]|8[356]\d|349)\d{7}$/,
                //中国电信
                ce: /^(?:0?1)(?:33|53|8[079])\d{8}$/,
                //中国大陆
                cn: /^(?:0?1)[3458]\d{9}$/,
                //中国香港
                hk: /^(?:0?[1569])(?:\d{7}|\d{8}|\d{12})$/
                //澳门
                // macao: /^6\d{7}$/,
                //台湾
                //  tw: /^(?:0?[679])(?:\d{7}|\d{8}|\d{10})$//*,
                //韩国
                //  kr:/^(?:0?[17])(?:\d{9}|\d{8})$/,
                //日本
                // jp:/^(?:0?[789])(?:\d{9}|\d{8})$/*/
            }
            var ok = false
            for ( var i in phoneOne ) {
                if ( phoneOne[ i ].test( value ) ) {
                    ok = true;
                    break
                }
            }
            done( ok );
        }
    } );

    // TODO 11 返回jvalidator验证对象
    var form = $( formSelector ).first();
    if ( form.data( 'FormValidator' ) ) return form.data( 'FormValidator' );
    var fv = new FormValidator( form[ 0 ] );
    form.data( 'FormValidator', fv );
    return fv;
};

