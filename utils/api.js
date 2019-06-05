const crypto = requirePlugin('Crypto');
var safeBase64 = require('../utils/safebase64.js')

var appKey = 'MTIzNDU2YWJjZEUxMjM0NQ==',
  signKey = 'uTjPnNmlGrtlbDNi25s3DY3CSVwONAYs',
  token = 'HGTestTOKEN',
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
  basedataqueryUrl: basedataqueryUrl
};