// pages/me/me.js
var api = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: '../../assets/images/me/user.png',
    nickname: '未登录',
    gender: '2',
    hasLogin: '',
    settingItems: [{
      'icon': '../../assets/images/me/record.png',
      'desc': '我的记录',
      'indicator': '../../assets/images/me/arrow.png',
      'gotoUrl': '../record/record'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      // 获取本地存储成功
      success: function (res) {
        var userInfo = res.data
        that.setData({
          iconUrl: userInfo.avatarUrl,
          nickname: userInfo.nickName,
          gender: userInfo.gender,
          hasLogin: true
        })
      },
      fail: function (res) {
        that.setData({
          iconUrl: '../../assets/images/me/user.png',
          nickname: '未登录',
          gender: '2',
          hasLogin: false
        })
      }
    })
  },

  gotoUrl() {
    wx.switchTab({
      url: '../record/record'
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