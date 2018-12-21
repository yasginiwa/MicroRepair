// pages/repair/repair.js
Page({
      /**
       * 页面的初始数据
       */
      data: {
        
      },

      //  扫描查询
      query() {
        wx.scanCode({
          onlyFromCamera: true,
          scanType: [],
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },

      //  扫描维修
      repair() {
        var that = this;
        try {
          var hasLogin = wx.getStorageSync('userInfo');
          if(hasLogin) {
            wx.scanCode({
              onlyFromCamera: true,
              scanType: [],
              success: function (res) {
                //  跳转至维修详情页面
                wx.navigateTo({
                  url: '../repairDetail/repairDetail?scanCode=' + res.result,
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
              },
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
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        } catch(e) {
          wx.showToast({
            title: e,
            icon: 'none',
            image: '',
            duration: 2000,
            mask: true,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },

          /**
           * 生命周期函数--监听页面加载
           */
          onLoad: function(options) {

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
            wx.startPullDownRefresh({
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          },

          /**
           * 页面上拉触底事件的处理函数
           */
          onReachBottom: function() {

          },

          /**
           * 用户点击右上角分享
           */
          onShareAppMessage: function() {

          }
      })