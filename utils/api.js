const crypto = requirePlugin('Crypto'),
  safeBase64 = require('../utils/safebase64.js'),
  urlSafeBase64 = require('../utils/safebase64.js'),
  dateUtil = require('../utils/util.js');

var appKey = 'SEdEZXZpY2VNYWludGFpbjIwMTk=',
  signKey = '6AGC2HKHGBWMpQcxRdppqRg2Mn7wKJAi',
  token = 'HGCakeDeviceMaintain',
  host = 'https://repair.hgsp.cn:10445',
  userBindUrl = `${host}/icapi/userbind`,
  deviceBindUrl = `${host}/icapi/devicebind`,
  addMaintainUrl = `${host}/icapi/addmaintain`,
  maintainQueryUrl = `${host}/icapi/maintainquery`,
  getopenidUrl = `${host}/getopenid`,
  basedataqueryUrl = `${host}/icapi/basedataquery`;


/**
 * 返回加盐后签名
 */
var sign = function (content) {
  return new crypto.MD5(signKey + 'token' + token + 'content' + JSON.stringify(content) + signKey).toString();
}

//  AppKey从base64还原为字符串
var appKeyStr = crypto.Utf8.stringify(crypto.Base64.parse(appKey));
appKeyStr = appKeyStr.substring(0, 16);

var options = {
  mode: crypto.Mode.ECB,
  padding: crypto.Padding.Pkcs7
}

/**
 * AES加密
 */
var encryptContent = function (content) {
  var encContent = (new crypto.AES().encrypt(crypto.Utf8.parse(JSON.stringify(content)), crypto.Utf8.parse(appKeyStr), options)).toString();

  return encContent;
}

/**
 * AES解密
 */
var decryptContent = function (content) {
  var decContent = (new crypto.AES().decrypt(safeBase64.decode(content), crypto.Utf8.parse(appKeyStr), options));
  return JSON.parse(crypto.Utf8.stringify(decContent));
}

/**
 * 一网烘焙接口请求封装
 */
var netbakeRequest = function (url, content, success, fail) {
  var encContent = urlSafeBase64.encode(encryptContent(content)),
    sign = this.sign(content),
    token = this.token;

  // 发出请求
  wx.request({
    url: url,
    data: {
      token: token,
      content: encContent,
      sign: sign
    },
    success: (res) => {
      console.log(res);
      var resultJson = JSON.parse(res.data);
      success(JSON.parse(resultJson));
    },
    fail: (err) => {
      wx.showToast({
        title: '网络不给力哦',
        icon: 'none',
        mask: true
      })
    }
  })
};


/**
 * 一网烘焙接口请求封装 返回已解密
 */
var netbakeRequestDecrypt = function (url, content, success, fail) {
  var encContent = urlSafeBase64.encode(encryptContent(content)),
    sign = this.sign(content),
    token = this.token;

  // 发出请求
  wx.request({
    url: url,
    data: {
      token: token,
      content: encContent,
      sign: sign
    },
    success: (res) => {

      // 如果没有返回结果 直接return
      if (!res.data) return;

      // content转换成对象
      var content = JSON.parse(JSON.parse(res.data)).content;
      var decContent = decryptContent(content);

      if (!decContent) return;

      success(decContent);

    },
    fail: (err) => {

      fail(err);
    }
  })
};


/**
* 查询一网基本资料查询请求
*/
var netbakeBaseDataRequest = function (data, datatype, success, fail) {

  var now = dateUtil.formatTime(new Date());
  var wxopenid = wx.getStorageSync('wxopenid');
  var content = {
    'wxopenid': wxopenid,
    'datatype': datatype,
    'datavalue': data,
    'datasource': '15',
    'timestamp': now
  }

  var basedataqueryUrl = this.basedataqueryUrl,
    encContent = urlSafeBase64.encode(encryptContent(content)),
    sign = this.sign(content),
    token = this.token;

  // 发出搜索请求
  wx.request({
    url: basedataqueryUrl,
    data: {
      token: token,
      content: encContent,
      sign: sign
    },
    success: (res) => {

      console.log(res);

      // 如果没有返回结果 直接return
      if (!res.data) return;

      // content转换成对象
      var content = JSON.parse(JSON.parse(res.data)).content;
      var decContent = decryptContent(content);

      if (!decContent) return;

      success(decContent);

    },
    fail: (err) => {

      fail(err);
    }
  })
};


module.exports = {
  token: token,
  sign: sign,
  host: host,
  encryptContent: encryptContent,
  decryptContent: decryptContent,
  sign: sign,
  userBindUrl: userBindUrl,
  deviceBindUrl: deviceBindUrl,
  addMaintainUrl: addMaintainUrl,
  maintainQueryUrl: maintainQueryUrl,
  getopenidUrl: getopenidUrl,
  basedataqueryUrl: basedataqueryUrl,
  netbakeRequest: netbakeRequest,
  netbakeRequestDecrypt: netbakeRequestDecrypt,
  netbakeBaseDataRequest: netbakeBaseDataRequest
};