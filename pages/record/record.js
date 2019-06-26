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
      title: '玩命加载中',
    })

    var maintainQueryUrl = api.maintainQueryUrl,
      content = {
        'wxopenid': wx.getStorageSync('wxopenid'),
        'timestamp': dateUtil.formatTime(new Date()),
        'deviceid': '111',
        'queryall': false,
        'storeid': '24',
        'shopid': '24'
      };

    api.netbakeRequest(maintainQueryUrl, content, (res) => {
      wx.stopPullDownRefresh();

      if (res.code == 15005) {
        wx.showToast({
          title: '用户未审核',
          image: '../../assets/images/warning.png',
          duration: 3000
        })
        return;
      }

      // 返回的是所有该deviceid的维修记录
      var records = api.decryptContent(res.content);
      
      wx.hideLoading();
      
      records = records.map((item) => {
        item.maintaindate = item.maintaindate.substring(0, 19);
        return item;
      })

      this.setData({
        deviceRecords: records
      })

    }, (err) => {

      wx.showToast({
        title: '网络不给力哦',
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.onLoad();
  }
})