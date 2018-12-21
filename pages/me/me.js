// pages/me/me.js
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
      url: 'http://127.0.0.1:3002/login',
      data: {
        user: userInfo.nickName
      },
      method: 'POST',
      success: function (res) {
        try {
          wx.setStorageSync('token', res.data.token);
        } catch (error) {
          console.log(error);
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

    this.onLoad();
    wx.hideLoading();
  },

  logoff() {
    var that = this;
    wx.showModal({
      title: '注销',
      content: '注销后无法使用“扫码维修”功能!',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorage();
          that.onLoad();
        }
      }
    })
  },

  gotoUrl() {
    if (this.data.hasLogin) {
      wx.switchTab({
        url: '../record/record',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.showToast({
        title: '请先登录系统...',
        icon: 'none',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
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