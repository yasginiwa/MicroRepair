// pages/userBind/userBind.js
const api = require('../../utils/api.js');
var urlSafeBase64 = require('../../utils/safebase64.js');
const dateUtil = require('../../utils/util.js');
const regeneratorRuntime = require('../../utils/regenerator/runtime.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnDisable: true,
    username: '',
    phone: ''
  },

  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
    this.onInput();
  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
    this.onInput();
  },

  onInput: function () {
    let username = this.data.username,
      phone = this.data.phone;
    if (username.length && phone.length == 11) {
      this.setData({
        btnDisable: false
      })
    } else {
      this.setData({
        btnDisable: true
      })
    }
  },

  onRegistry: function (e) {
    //  显示hud
    wx.showLoading({
      title: '绑定中...',
      mask: true
    })

    //  判断是否获取到用户信息
    if (!e.detail.userInfo) {
      wx.showToast({
        image: '../../assets/images/warning.png',
        title: '请点击允许继续'
      })
      return;
    }

    wx.setStorageSync('userInfo', e.detail.userInfo);
    //  登录获取openid
    let getOpenId = new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: api.getopenidUrl,
              method: 'POST',
              data: {
                code: res.code
              },
              success: (res) => {
                wx.setStorageSync('wxopenid', res.data.result.wxopenid);
                return resolve(res.data.result.wxopenid);
              }
            })
          } else {
            return reject(res.errMsg);
          }
        }
      })
    });

let that = this;
    async function bindUser() {

      let wxopenid = await getOpenId;

      var now = dateUtil.formatTime(new Date());
      var content = {
        'wxopenid': wxopenid,
        'nickname': that.data.username,
        'phoneno': that.data.phone,
        'bindsource': 'DeviceMaintainMP',
        'timestamp': now
      }

      var userBindUrl = api.userBindUrl,
        encContent = urlSafeBase64.encode(api.encryptContent(content)),
        sign = api.sign(content),
        token = api.token;

      wx.request({
        url: userBindUrl,
        data: {
          token: token,
          content: encContent,
          sign: sign
        },
        success: function (res) {
          //  移除绑定hud
          wx.hideLoading();

          var data = JSON.parse(res.data);
          if (data) { // 在一网用户列表内 注册成功
            var dataObj = JSON.parse(data);
            if (dataObj.content) {
              console.log(api.decryptContent(dataObj.content) + '注册成功');
              wx.reLaunch({
                url: '../repair/repair',
              })
            } else {
              console.log(data + '注册失败'); // 不在一网用户列表内 注册失败
              // 显示绑定失败hud 直接返回
              wx.showToast({
                image: '../../assets/images/fail.png',
                title: '绑定失败',
              })
            }
          }
        },
        fail: function (err) {
          console.log(err);
        }
      })
  }

  bindUser();
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



    // let a = new Promise((resolve, reject) => {
    //   let data = '';
    //   setTimeout(function () {
    //     data = '李毛毛'
    //     return resolve(data);
    //   }, 3000)

    // });

    // async function f2() {
    //   let d = await a;
    //   console.log(d);
    // }

    // f2();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})