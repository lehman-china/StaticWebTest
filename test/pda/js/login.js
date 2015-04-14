var ionicApp = angular.module( 'ionicApp' );
ionicApp.controller( 'loginCtrl', function ( $scope, $state ) {

    function loginSubmit() {
        $state.go( 'tabs.home' );
    }

    /**
     * --------------------------验证分割线-------------------------------
     */
    formValidator(
        {
            formSelector: "#login_vali",
            submitSelector: "#login_vali .button-positive",
            isEnterSubmit: true,
            validateCallBack: function ( isPass ) {
                if ( isPass ) loginSubmit();
            },
            valiStyle: function ( isPass, $el, errors ) {
                var $layer = $el.closest( "label" );
                var valiTips = $el.data( "valiTips" );//验证提示的气泡
                if ( isPass ) {
                    if ( valiTips ) {
                        valiTips.close();
                        $el.data( "valiTips", null );
                    }
                    $layer.css( "border", "1px  solid #D5D5D5" );
                } else {
                    if ( !valiTips ) {
                        var tips = FEUI.tips( {
                            html: errors.getMessage(),
                            follow: $layer,
                            backgroundColor: "#f0b840",
                            borderColor: "#f0b840"
                        } );
                        $el.data( "valiTips", tips );
                    }
                    $layer.css( "border", "2px  solid red" );
                }
            },
            config: function ( jv ) {
                jv.addPattern( 'account', {
                    argument:true,
                    message: '%argu需以字母开头,长度在6-18之间的字符,数字和下划线',
                    validate: function ( value, done ) {
                        done( /^[a-zA-Z]\w{5,17}$/.test( value ) );
                    }
                } );
                jv.when( [ 'blur' ] );
            }
        }
    );
} );