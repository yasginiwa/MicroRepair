// pages/deviceRecord/deviceRecord.js
const api = require('../../utils/api.js');
var urlSafeBase64 = require('../../utils/safebase64.js');
const dateUtil = require('../../utils/util.js');

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
    // this.requestData(options.scanCode);
    var maintainQueryUrl = api.maintainQueryUrl,
      content = {
        'wxopenid': wx.getStorageSync('wxopenid'),
        'deviceid': options.scanCode,
        'timestamp': dateUtil.formatTime(new Date()),
        'startdate': '2019-01-06',
        'enddate': '2019-08-06',
        'shopid': 24,
        'storeid': 24,
        'pid': 1007992
      };
      

    api.netbakeRequest(maintainQueryUrl, content, (res) => {
      console.log(res);
      
      if(!res) {
        wx.showToast({
          title: '设备未绑定',
          image: '../../assets/images/warning.png',
          mask: true
        })
      }

      console.log(content);
      console.log(api.decryptContent(res.content));

      if (dataObj.code == 15013) {
        wx.showToast({
          title: dataObj.msg,
          image: '../../assets/images/warning.png',
          mask: true
        })
      }
      
    }, (err) => {
      console.log(err);
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