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
            success: (res) => {
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
      'wxopenid': 'ov4_64vTqTzSOLmnmw9sfeE19f7Y',
      'nickname': '李玉刚',
      'phoneno': '13545126358',
      'bindsource': 'DeviceMaintainMP',
      'timestamp': now
    }

    // var content = {
    //   'wxopenid': 'ov4_64vTqTzSOLmnmw9sfeE19454',
    //   'nickname': '李玉',
    //   'phoneno': '13511111111',
    //   'bindsource': 'DeviceMaintainMP',
    //   'timestamp': now
    // }

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
        var result = JSON.parse(res.data);
        if (result) { // 在一网用户列表内 注册成功
          var resultObj = JSON.parse(result);
          if (resultObj.content) {
            console.log(api.decryptContent(resultObj.content) + '注册成功');
          } else {
            console.log(res + '注册失败'); // 不在一网用户列表内 注册失败
          }
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