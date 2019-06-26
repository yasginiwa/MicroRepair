// pages/deviceRecordDetail/deviceRecordDetail.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentRecord: {},
    // 故障原因模型
    reasonTypes: [
      {
        reasontype: 0,
        title: '轻度故障',
        desc: '设备未损坏，需保养'
      },
      {
        reasontype: 1,
        title: '一般故障',
        desc: '设备损坏，可在短期内修复'
      },
      {
        reasontype: 2,
        title: '严重故障',
        desc: '设备严重损坏，无法在短期内修复'
      },
      {
        reasontype: 3,
        title: '灾难故障',
        desc: '设备完全损坏，无法修复'
      }
    ],

    //  维修结果类型
    resultTypes: [
      {
        resulttype: 0,
        title: '已修复',
        desc: '设备已能正常使用'
      },
      {
        resulttype: 1,
        title: '待处理',
        desc: '设备暂时无法使用'
      },
      {
        resulttype: 2,
        title: '报废',
        desc: '设备完全损坏致报废'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentRecord = JSON.parse(options.deviceRecord);
    this.setData({
      currentRecord: currentRecord
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