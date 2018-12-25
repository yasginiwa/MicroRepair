// pages/deviceRecordDetail/deviceRecordDetail.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentRecord: null,
    isSpeaking: false
  },

  /**
   * 播放语音描述
   */
  playAudioDesc() {
    var that = this;
    innerAudioContext.src = this.data.currentRecord.audioDesc;
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      console.log('start');
      // 开始播放 设置isSpeaking标记为true
      that.setData({
        isSpeaking: true
      })
    })
    innerAudioContext.onError((res) => {
      wx.showToast({
        title: '播放失败,请检查网络...',
        icon: 'none',
      })
    })

    innerAudioContext.onWaiting((res) => {
      console.log(res);
    })

    innerAudioContext.onEnded((res) => {
      console.log('stop');
      // 停止播放 设置isSpeaking标记为false
      that.setData({
        isSpeaking: false
      })
    })
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