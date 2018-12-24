// pages/record/record.js
var api = require('../../utils/apiUtil.js');

Page({
  /**
   * 点击进入设备记录详情
   */
  clickToDeviceRecordDetail(e) {
    var deviceRecord = JSON.stringify(this.data.deviceRecords[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: '../deviceRecordDetail/deviceRecordDetail?deviceRecord=' + deviceRecord,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 请求数据
   */
  requestData() {
    wx.showLoading({
      title: '加载中...',
    })

    this.setData({
      deviceRecords: []
    })

    //  从本地获取userInfo信息
    try {
      var nickName = wx.getStorageSync('userInfo').nickName;
    } catch (e) {
      console.log(e);
    }

    //  从本地获取token信息
    try {
      var token = wx.getStorageSync('token');
    } catch (e) {
      console.log(e);
    }

    if (nickName == null || token == null) {
      wx.hideLoading();
      wx.showToast({
        title: '请登录系统...',
        icon: 'none',
        mask: true
      })
    }

    var that = this;
    var deviceRecordArray = that.data.deviceRecords;
    wx.request({
      url: api.userrecordUrl,
      method: 'POST',
      data: {
        engineer: nickName,
        token: token
      },
      success: function (res) {
        deviceRecordArray = deviceRecordArray.concat(res.data.result);
        that.setData({
          deviceRecords: deviceRecordArray
        })
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络超时,请检查网络设置!',
          icon: 'none',
          mask: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData();
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
    this.requestData();
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

    wx.showLoading({
      title: '加载中...',
    })

    this.setData({
      deviceRecords: []
    })

    //  从本地获取userInfo信息
    try {
      var nickName = wx.getStorageSync('userInfo').nickName;
    } catch (e) {
      wx.showToast({
        title: '请登录系统...',
        icon: 'none',
        mask: true
      })
    }

    //  从本地获取token信息
    try {
      var token = wx.getStorageSync('token');
    } catch (e) {
      wx.showToast({
        title: '请登录系统...',
        icon: 'none',
        mask: true
      })
    }

    var that = this;
    var deviceRecordArray = that.data.deviceRecords;
    wx.request({
      url: api.userrecordUrl,
      method: 'POST',
      data: {
        engineer: nickName,
        token: token
      },
      success: function (res) {
        deviceRecordArray = deviceRecordArray.concat(res.data.result);
        that.setData({
          deviceRecords: deviceRecordArray
        })
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        wx.showToast({
          title: '网络超时,请检查网络设置!',
          icon: 'none',
          mask: true
        })
        wx.stopPullDownRefresh();
      }
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