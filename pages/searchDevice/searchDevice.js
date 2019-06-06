// pages/searchDevice/searchDevice.js
const api = require('../../utils/api.js');
var urlSafeBase64 = require('../../utils/safebase64.js');
const dateUtil = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    results: [],
    keyword: '',
    recommend: ['POS', '电脑', '路由器', '交换机', '小票打印机', '摄像头', '报警主机', 'NVR']
  },

  onInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })

    this.queryDevice(e.detail.value);
  },

  queryDevice: function (devicename) {
    // 清空数组 避免上次搜索结果加入result
    this.setData({
      results: []
    });

    var now = dateUtil.formatTime(new Date());
    var wxopenid = wx.getStorageSync('wxopenid');
    var content = {
      'wxopenid': wxopenid,
      'datatype': 1,
      'datavalue': devicename,
      'datasource': '15',
      'timestamp': now
    }

    var basedataqueryUrl = api.basedataqueryUrl,
      encContent = urlSafeBase64.encode(api.encryptContent(content)),
      sign = api.sign(content),
      token = api.token;

    // 发出搜索请求
    wx.request({
      url: basedataqueryUrl,
      data: {
        token: token,
        content: encContent,
        sign: sign
      },
      success: (res) => {

        // 如果没有返回结果 直接return
        if (!res.data) return;

        // content转换成对象
        var content = JSON.parse(JSON.parse(res.data)).content;

        if (!api.decryptContent(content)) return;

        // 设置页面搜索数据
        this.setData({

          results: this.data.results.concat(api.decryptContent(content))

        })

      }, fail: (err) => {

        console.log(err);

      }

    })

  },

  /**
   * 取消搜索
   */
  onSearchCancel: function () {

    this.setData({
      results: [],
      keyword: ''
    })
  },

  onSelectRecommend: function(e) {

    var devicename = this.data.recommend[e.currentTarget.dataset.index];

    this.setData({
      keyword: devicename
    })

    this.queryDevice(devicename);

  },

  onSearchConfirm: function(e) {

    var device = this.data.results[e.currentTarget.dataset.index];
    
    console.log(device);

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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