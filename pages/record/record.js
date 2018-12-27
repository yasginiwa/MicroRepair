// pages/record/record.js
var api = require('../../utils/apiUtil.js');

Page({

  data: {
    deviceRecords: [],
    page: 0
  },

  /**
   * 点击进入设备记录详情
   */
  clickToDeviceRecordDetail(e) {
    var deviceRecord = JSON.stringify(this.data.deviceRecords[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: '../deviceRecordDetail/deviceRecordDetail?deviceRecord=' + deviceRecord,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 请求数据
   */
  requestData() {
    wx.showLoading({
      title: '加载中...',
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

    //  从本地获取deviceRecordArray
    try {
      var deviceRecordArray = wx.getStorageSync('deviceRecordArray');
    } catch (e) {
      console.log(e);
    }

    if(!deviceRecordArray) {
      try {
      wx.setStorageSync(deviceRecordArray, []);
      } catch (e) {
        console.log(e);
      }
    }

    if (nickName == null || token == null) {
      wx.showToast({
        title: '请登录系统...',
        icon: 'none',
        mask: true
      })
      this.setData({
        deviceRecords: []
      })
      return;
    }

    var that = this;

    wx.request({
      url: api.userrecordUrl,
      method: 'POST',
      data: {
        engineer: nickName,
        page: 0,
        token: token
      },
      success: function(res) {
        that.setData({
          deviceRecords: res.data.result.concat(deviceRecordArray)
        })

        // 隐藏toast
        wx.hideLoading();

        //  存到deviceRecordArray本地
        wx.setStorage({
          key: 'deviceRecordArray',
          data: that.data.deviceRecords,
        })
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络超时,请检查网络设置!',
          icon: 'none',
          mask: true
        })
      }
    })
  },

  loadMore() {
    wx.showLoading({
      title: '加载中...',
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

    //  从本地获取deviceRecordArray
    try {
      var deviceRecordArray = wx.getStorageSync('deviceRecordArray');
    } catch (e) {
      console.log(e);
    }

    if (nickName == null || token == null) {
      wx.showToast({
        title: '请登录系统...',
        icon: 'none',
        mask: true
      })
      this.setData({
        deviceRecords: []
      })
      return;
    }

    // 上拉 页面自增
    this.setData({
      page: this.data.page + 1
    })

    var that = this;
    wx.request({
      url: api.userrecordUrl,
      method: 'POST',
      data: {
        engineer: nickName,
        page: that.data.page,
        token: token
      },
      success: function(res) {
        deviceRecordArray = deviceRecordArray.concat(res.data.result);
        that.setData({
          deviceRecords: deviceRecordArray
        })
        wx.hideLoading();

        //  存储deviceRecordArray到本地
        wx.setStorage({
          key: 'deviceRecordArray',
          data: that.data.deviceRecords,
        })
      },
      fail: function(res) {
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
  onLoad: function(options) {
    this.requestData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.startPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('下拉刷新');
    this.requestData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('上拉加载');
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})