
var encode = function encode(str) {
  str = str.replace(/\+/g, '-');
  str = str.replace(/\//g, '_');
  str = str.replace(/=+$/, '');
  return str;
}

var decode = function decode(base64) {
  base64 += Array(5 - base64.length % 4).join('=');
  base64 = base64.replace(/\-/g, '+');
  base64 = base64.replace(/\_/g, '/');
  return base64;
}

// var validate = function validate(base64) {
//   return /^[A-Za-z0-9\-_]+$/.test(base64);
// };

module.exports = {
  encode: encode,
  decode: decode
}