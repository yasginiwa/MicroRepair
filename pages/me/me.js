// pages/me/me.js
var api = require('../../utils/apiUtil.js');

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

  /**
   * 登录
   */
  onGotUserInfo(e) {
    wx.showLoading({
      title: '登录中...',
    })
    var userInfo = e.detail.userInfo;
    wx.setStorage({
      key: 'userInfo',
      data: userInfo
    })

    wx.request({
      url: api.loginUrl,
      data: {
        user: userInfo.nickName
      },
      method: 'POST',
      success: function (res) {
        //  登录成功 设置token存储到本地
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        })

        //  登录成功 设置登录状态存储到本地
        wx.setStorage({
          key: 'hasLogin',
          data: true,
        })

        //  改变登录状态 保存到本地存储
        wx.setStorage({
          key: 'loginStatusChange',
          data: true,
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })

    this.onLoad();
    wx.hideLoading();
  },

  /**
   * 注销
   */
  logoff() {
    var that = this;
    wx.showModal({
      title: '注销',
      content: '注销后无法使用此系统!',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorage();
          that.onLoad();
        }
      },
      complete: function (res) {
        //  改变登录状态 保存到本地存储
        wx.setStorage({
          key: 'loginStatusChange',
          data: true,
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