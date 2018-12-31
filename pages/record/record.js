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
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  logoutRefresh() {
    try {
      var hasLogin = wx.getStorageSync('hasLogin');
    } catch (e) {
      console.log(e);
    }
    if (!hasLogin) {
      this.setData({
        deviceRecords: []
      })

      wx.showToast({
        title: '请登录系统...',
        icon: 'none',
        mask: true
      })
    } else return;
  },

  /**
   * 加载数据
   */
  loadData() {
    //  从本地获取deviceRecordArray
    try {
      var deviceRecordArray = wx.getStorageSync('deviceRecordArray');
    } catch (e) {
      console.log(e);
    }

    //  利用缓存数据作为页面
    this.setData({
      deviceRecords: deviceRecordArray
    })


    if (deviceRecordArray.length > 0) {
      this.requestDataWithCaches();
    } else {
      this.loadDataWithoutCaches();
    }
  },

  /**
   * 无数据时请求
   */
  loadDataWithoutCaches() {
    wx.showLoading({
      title: '加载中...',
    })

    //  从本地获取userInfo信息
    try {
      var nickName = wx.getStorageSync('userInfo').nickName;
    } catch (e) {
      console.log(e);
    }

    //  从本地存储获取token信息
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

    var that = this;

    wx.request({
      url: api.userrecordUrl,
      method: 'POST',
      data: {
        engineer: nickName,
        page: 0,
        token: token
      },
      success: function (res) {
        that.setData({
          deviceRecords: res.data.result
        })

        //  存储数组到本地存储
        wx.setStorage({
          key: 'deviceRecordArray',
          data: res.data.result,
        })

        // 隐藏toast
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
   * 请求数据
   */
  requestDataWithCaches() {
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

    // //  利用缓存数据作为页面
    // this.setData({
    //   deviceRecords: deviceRecordArray
    // })

    var that = this;

    wx.request({
      url: api.userrecordUrl,
      method: 'POST',
      data: {
        engineer: nickName,
        page: 0,
        token: token
      },
      success: function (res) {
        if (res.data.result[0].r_id == deviceRecordArray[0].r_id) { //  相等直接返回
          wx.hideLoading();
          return;
        } else if (res.data.result[0].r_id > deviceRecordArray[0].r_id) { //  大于则把请求值加到本地存储数组前面
          deviceRecordArray = res.data.result.concat(deviceRecordArray);
        } else { //  小于则把请求值加到本地存储数组后面
          deviceRecordArray = deviceRecordArray.concat(res.data.result);
        }

        //  请求成功后刷新数据
        that.setData({
          deviceRecords: deviceRecordArray
        })

        //  存储数组到本地存储
        wx.setStorage({
          key: 'deviceRecordArray',
          data: deviceRecordArray,
        })

        // 隐藏toast
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
   * 上拉加载
   */
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
      success: function (res) {
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
    this.loadData();
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

    try {
      var commitSuccess = wx.getStorageSync('commitSuccess');
    } catch (e) {
      console.log(e);
    }

    try {
      var loginStatusChange = wx.getStorageSync('loginStatusChange');
    } catch (e) {
      console.log(e);
    }

    if (commitSuccess || loginStatusChange) {
      wx.pageScrollTo({
        scrollTop: 0,
      })
      wx.startPullDownRefresh();
      wx.setStorage({
        key: 'commitSuccess',
        data: false,
      })
      wx.setStorage({
        key: 'loginStatusChange',
        data: false,
      })
    } else {
      this.logoutRefresh();
    }
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
    console.log('下拉刷新');
    this.loadData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载');
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})