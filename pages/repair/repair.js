// pages/repair/repair.js

const api = require('../../utils/api.js');
var urlSafeBase64 = require('../../utils/safebase64.js');
const dateUtil = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 扫描查询
   */
  query() {
    try {
      var hasLogin = wx.getStorageSync('hasLogin');
    } catch (e) {
      console.log(e);
    }
    if (!hasLogin) {
      wx.showToast({
        title: '请登录系统...',
        icon: 'none',
        mask: true
      })
      return;
    }

    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: function (res) {
        wx.navigateTo({
          url: '../deviceRecord/deviceRecord?scanCode=' + res.result,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 扫描维修
   */
  repair() {
    try {
      var hasLogin = wx.getStorageSync('hasLogin');
    } catch (e) {
      console.log(e);
    }
    if (!hasLogin) {
      wx.showToast({
        title: '请登录系统...',
        icon: 'none',
        mask: true
      })
      return;
    }

    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.scanCode({
          onlyFromCamera: true,
          scanType: [],
          success: function (res) {
            //  跳转至维修详情页面
            wx.navigateTo({
              url: '../repairDetail/repairDetail?scanCode=' + res.result
            })
          }
        })
      },
      fail: function (res) { }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://repair.hgsp.cn:10445/getopenid',
            method: 'POST',
            data: {
              code: res.code
            },
            success:(res)=> {
              console.log(res);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })



    var now = dateUtil.formatTime(new Date());
    var content = {
      'wxopenid': 'oh1Ca5VTFEfTji19ihHdxVeu3sAc',
      'nickname': '李玉刚',
      'phoneno': '13545126358',
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
        sign: sign,
        content: encContent
      },
      success: function (res) {
        if (res.data) { // 在一网用户列表内 注册成功
          var dataObj = JSON.parse(res.data);
          console.log(dataObj);
        } else {
          console.log(res); // 不在一网用户列表内 注册失败
        }   
      }, fail: function (err) {
        console.log(err);
      }
    })
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
    wx.startPullDownRefresh({
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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