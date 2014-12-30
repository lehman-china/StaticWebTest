
/** ***************************Service *************************** */
function DeliveAddressService() {
}
/**
 * XXX
 * 
 * @description 检测 收货地址表单
 * 
 */
DeliveAddressService.checkAddress = function( vm ) {
	vm.errorMsg = {
		bookNameMsg : "",
		regionMsg : "",
		bookAddressMsg : "",
		bookPostmanMsg : "",
		bookMobileMsg : "",
		bookPhoneMsg : "",
		bookEmailMsg : ""
	};
	// 检测收货人姓名
	function checkConsigneeName() {
		var errorFlag = false;
		var errorMessage = "";
		var value = vm.selAddress.bookName;
		if ( isEmpty( value ) ) {
			errorFlag = true;
			errorMessage = "请您填写收货人姓名";
		} else {
			if ( value.length > 25 ) {
				errorFlag = true;
				errorMessage = "收货人姓名不能大于25位";
			}
			if ( !is_forbid( value ) ) {
				errorFlag = true;
				errorMessage = "收货人姓名中含有非法字符";
			}
		}
		if ( errorFlag ) {
			vm.errorMsg.bookNameMsg = errorMessage;
		} else {
			vm.errorMsg.bookNameMsg = "";
		}
		return errorFlag;
	}
	// 检测选择地区
	function checkArea() {
		var errorFlag = false;
		var errorMessage = "";
		// 验证地区是否正确
		if ( isEmpty( vm.province ) || isEmpty( vm.city ) || isEmpty( vm.town ) || vm.town.id == -1 ) {
			errorFlag = true;
			errorMessage = "地区不完整";
		}
		if ( errorFlag ) {
			vm.errorMsg.regionMsg = errorMessage;
		} else {
			vm.errorMsg.regionMsg = "";
		}
		return errorFlag;
	}

	// 检测详细地址
	function checkConsigneeAddress() {
		var errorFlag = false;
		var errorMessage = "";
		var value = vm.selAddress.bookAddress;
		if ( isEmpty( value ) ) {
			errorFlag = true;
			errorMessage = "详细地址不完整";
		} else {
			if ( !is_forbid( value ) ) {
				errorFlag = true;
				errorMessage = "不能含有非法字符";
			}
			if ( value.length > 50 ) {
				errorFlag = true;
				errorMessage = "详细地址过长(<50)";
			}
		}
		if ( errorFlag ) {
			vm.errorMsg.bookAddressMsg = errorMessage;
		} else {
			vm.errorMsg.bookAddressMsg = "";
		}
		return errorFlag;
	}
	// 检测手机和电话
	function checkMobileAndPhone() {
		if ( isEmpty( vm.selAddress.bookMobile ) && isEmpty( vm.selAddress.bookPhone ) ) {
			vm.errorMsg.bookMobileMsg = "电话和手机请至少填写一个";
			vm.errorMsg.bookPhoneMsg = "";
			return true;
		}
		// 手机和电话,只要通过一个即可
		if ( !checkMobile() || !checkPhone() ) {
			vm.errorMsg.bookMobileMsg = "";
			vm.errorMsg.bookPhoneMsg = "";
			return false;
		} else {
			return true;
		}
	}
	// 检测手机
	function checkMobile() {
		var errorFlag = false;
		var errorMessage = "";
		var value = vm.selAddress.bookMobile;

		if ( isEmpty( value ) ) {
			errorFlag = true;
			errorMessage = "请您填写收货人手机号码";
		} else {
			var regu = /^\d{11}$/;
			var re = new RegExp( regu );
			if ( !re.test( value ) ) {
				errorFlag = true;
				errorMessage = "手机号码格式不正确";
			}
		}
		if ( errorFlag ) {
			vm.errorMsg.bookMobileMsg = errorMessage;
		} else {
			vm.errorMsg.bookMobileMsg = "";
			vm.errorMsg.bookPhoneMsg = "";
		}
		return errorFlag;
	}

	// 检测电话
	function checkPhone() {
		// 电话
		var value = vm.selAddress.bookPhone;

		var errorFlag = false;
		var errorMessage = "";

		if ( isEmpty( value ) ) {
			errorFlag = true;
			errorMessage = "请您填写收货人固定电话";
		} else {
			if ( !is_forbid( value ) ) {
				errorFlag = true;
				errorMessage = "固定电话号码中含有非法字符";
			}
			if ( value.length > 20 ) {
				errorFlag = true;
				errorMessage = "固定电话号码过长";
			}
			var patternStr = "(0123456789-)";
			var strlength = value.length;
			for ( var i = 0; i < strlength; i++ ) {
				var tempchar = value.substring( i, i + 1 );
				if ( patternStr.indexOf( tempchar ) < 0 ) {
					errorFlag = true;
					errorMessage = "固定电话号码格式不正确";
					break;
				}
			}
		}

		if ( errorFlag ) {
			vm.errorMsg.bookPhoneMsg = errorMessage;
		} else {
			vm.errorMsg.bookMobileMsg = "";
			vm.errorMsg.bookPhoneMsg = "";
		}
		return errorFlag;
	}

	/**
	 * 检查是否含有非法字符
	 * 
	 * @param temp_str
	 * @returns {Boolean}
	 */
	function is_forbid( temp_str ) {
		temp_str = temp_str.replace( /(^\s*)|(\s*$)/g, "" );
		temp_str = temp_str.replace( '*', "@" );
		temp_str = temp_str.replace( '--', "@" );
		temp_str = temp_str.replace( '/', "@" );
		temp_str = temp_str.replace( '+', "@" );
		temp_str = temp_str.replace( '\'', "@" );
		temp_str = temp_str.replace( '\\', "@" );
		temp_str = temp_str.replace( '$', "@" );
		temp_str = temp_str.replace( '^', "@" );
		temp_str = temp_str.replace( '.', "@" );
		temp_str = temp_str.replace( ';', "@" );
		temp_str = temp_str.replace( '<', "@" );
		temp_str = temp_str.replace( '>', "@" );
		temp_str = temp_str.replace( '"', "@" );
		temp_str = temp_str.replace( '=', "@" );
		temp_str = temp_str.replace( '{', "@" );
		temp_str = temp_str.replace( '}', "@" );
		var forbid_str = new String( '@,%,~,&' );
		var forbid_array = new Array();
		forbid_array = forbid_str.split( ',' );
		for ( var i = 0; i < forbid_array.length; i++ ) {
			if ( temp_str.search( new RegExp( forbid_array[i] ) ) != -1 )
				return false;
		}
		return true;
	}

	/**
	 * @description 判断是否是空
	 * @param value
	 */
	function isEmpty( value ) {
		if ( value == null || value == "" || value == "undefined" || value == undefined || value == "null" ) {
			return true;
		} else {
			value = (value + "").replace( /\s/g, '' );
			if ( value == "" ) {
				return true;
			}
			return false;
		}
	}
	/**
	 * 检测表单所有的项,所有的通过,返回true
	 */
	vm.checkAddress = function() {
		if ( checkConsigneeName() || checkArea() || checkConsigneeAddress() || checkMobileAndPhone() ) {
			return false;
		} else {
			return true;
		}
	};
};
/**
 * XXX 地区选择
 */
DeliveAddressService.region = function( vm ) {
	vm.nullOption = "&"
	vm.provinceOptions = loadChildRegion( "" );
	vm.province = null;
	vm.city = null;
	vm.cityOptions = [];
	vm.town = null;
	vm.townOptions = [];
	vm.street = null;
	vm.streetOptions = [];

	function loadRegionTmp( id, regions ) {
		for ( var key in regions ) {
			var region = regions[key];
			if ( region.id == id ) {
				return region;
			}
		}
		return null;
	}
	/**
	 * 保存实时的详细地址
	 */
	vm.fullAddress = function( bookRegionid ) {
		var region = [vm.province, vm.city, vm.town, vm.street];
		var fullTitle = "";
		for ( var i = 0; i < 4; i++ ) {
			try {
				fullTitle += region[i].split( "&" )[1];
			} catch ( e ) {
				break;
			}
		}
		vm.selAddress.bioecRegion.id = bookRegionid;
		return vm.selAddress.bookRegion = fullTitle;
	};

	/**
	 * XXX 选择省
	 */
	vm.changeProvince = function() {
		vm.city = null;
		if ( vm.province == null ) {
			vm.cityOptions = null;
			return;
		}
		var id = vm.province.split( "&" )[0];
		vm.cityOptions = loadChildRegion( id );
		vm.city = null;
		vm.townOptions = vm.streetOptions = [];
		// 2
		vm.fullAddress( id );
	};

	/**
	 * 选择市
	 */
	vm.changeCity = function() {
		vm.town = null;
		if ( vm.city == null ) {
			vm.townOptions = null;
			return;
		}
		var id = vm.city.split( "&" )[0];
		vm.townOptions = loadChildRegion( id );
		vm.town = null;
		vm.streetOptions = [];

		// 2
		vm.fullAddress( id );
	};
	/**
	 * 选择镇
	 */
	vm.changeTown = function() {
		vm.street = null;
		if ( vm.town == null ) {
			vm.streetOptions = null;
			return;
		}
		var id = vm.town.split( "&" )[0];
		$.ajax( {
					url : "orderLoadChildRegion.ajax?regionId=" + id,
					dataType : "json",
					success : function( streets ) {
						vm.streetOptions = streets;
						vm.street = null;
					}
				} );
		vm.fullAddress( id );
	};
	/**
	 * 选择街道
	 */
	vm.changeStreet = function() {
		if ( vm.street != null ) {
			vm.fullAddress( vm.street.split( "&" )[0] );
		}
	};
};
