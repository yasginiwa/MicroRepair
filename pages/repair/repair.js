// pages/repair/repair.js

const api = require('../../utils/api.js');
var urlSafeBase64 = require('../../utils/safebase64.js');
const dateUtil = require('../../utils/util.js');
const screenW = wx.getSystemInfoSync().windowWidth;
const screenH = wx.getSystemInfoSync().windowHeight;

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
        title: '请登录系统',
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
        })
      }
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
        title: '请登录系统',
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
          success: (res) => {
            //  跳转至维修详情页面
            wx.navigateTo({
              url: '../repairDetail/repairDetail?scanCode=' + res.result
            })
          }
        })
      },

      fail: (err) => { 

        wx.showToast({
          title: '网络不给力哦',
          icon: 'none',
          mask: true
        })

      }
      
    })

  },

  onBindDevice: function () {
    wx.navigateTo({
      url: '../searchDevice/searchDevice',
      success: function(res) {}
    })
  },

  /**
   * 初始化扫码查询动画
   */
  initAnimMid: function () {
    var anim = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in'
    });

    this.anim = anim;

    anim.translateY(screenH * 0.5).step();
    anim.translateY(screenH * 0.5 - 5).step({duration:250});
    anim.translateY(screenH * 0.5).step({duration:400});
    this.setData({
      animMid: this.anim.export()
    })
  },
  
  /**
   * 初始化维修动画
   */
  initAnimBott: function () {
    var anim = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in'
    });

    this.anim = anim;

    anim.translateY(screenH * 1.02).step({delay: 200});
    anim.translateY(screenH * 1.02 - 5).step({duration: 250});
    anim.translateY(screenH * 1.02).step({duration:400});
    this.setData({
      animBott: this.anim.export()
    })
  },

  /**
   * 初始化绑定设备动画
   */
  initAnimBind: function () {
    var anim = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    });

    this.anim = anim;

    var screenW = wx.getSystemInfoSync().windowWidth;

    anim.translateX(-screenW).step({delay: 1000})

    this.setData({
      animBind: this.anim.export()
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.netbakeBaseDataRequest('M1000000', 6, (res) => {
      console.log(res);
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
    this.initAnimMid();
    this.initAnimBott();
    this.initAnimBind();
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