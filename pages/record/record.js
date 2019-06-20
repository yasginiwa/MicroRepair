// pages/record/record.js
var api = require('../../utils/api.js');
const dateUtil = require('../../utils/util.js');

Page({

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
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '玩命加载中...',
    })

    var maintainQueryUrl = api.maintainQueryUrl,
      content = {
        'wxopenid': wx.getStorageSync('wxopenid'),
        'deviceid': '123',
        'timestamp': dateUtil.formatTime(new Date()),
        'queryall': false,
        'storeid': '111',
        'shopid': '111'
      };

    api.netbakeRequest(maintainQueryUrl, content, (res) => {

      // 返回的是所有该deviceid的维修记录
      var records = api.decryptContent(res.content);
      
      wx.hideLoading();
      
      records = records.map((item) => {
        item.maintaindate = item.maintaindate.substring(0, 10);
        return item;
      })

      this.setData({
        deviceRecords: records
      })

    }, (err) => {

      wx.showToast({
        title: '网络错误,请检查网络设置!',
        icon: 'none',
        mask: true
      })

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