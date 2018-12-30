// pages/deviceRecord/deviceRecord.js
var api = require('../../utils/apiUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceRecords: [],
  },

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
  requestData(params) {
    wx.showLoading({
      title: '加载中...',
    })

    var that = this;

    //  从本地存储获取token信息
    try {
      var token = wx.getStorageSync('token');
    } catch (e) {
      console.log(e);
    }

    wx.request({
      url: api.devicerecordUrl,
      method: 'POST',
      data: {
        scanCode: params,
        token: token
      },
      success: function (res) {
        that.setData({
          deviceRecords: res.data.result
        })
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误,请检查网络设置!',
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
    this.requestData(options.scanCode);
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