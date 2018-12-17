// pages/repairDetail/repairDetail.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext();
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    category: ['请选择', '打印设备', '收银设备', '通信设备', 'PC主机', 'PC外设', '监控设备', '入侵设备', '音频设备'],
    cateIdx: 0,
    record: {
      r_id: '',
      cate: '',
      name: '',
      reason: '',
      result: '',
      audioDesc: '',
      date: '',
      engineer: ''
    },
    commitDisable: true,  //  提交按钮disable
    frame: 1, //  序列帧动画初始帧
    isSpeaking: false //  正在讲话
  },

  /**
   * 选择设备分类
   */
  selectCategory(e) {
    //  设置设备分类名称为record.cate
    this.setData({
      cateIdx: e.detail.value
    })
    this.setData({
      'record.cate': this.data.category[this.data.cateIdx]
    })
  },

  /**
   * 设置设备名称
   */
  OnNameConfirm(e) {
    console.log(e);
    this.setData({
      'record.name': e.detail.value
    })
    this.editHasCompleted();
  },

  /**
   * 设置故障原因
   */
  OnReasonConfirm(e) {
    this.setData({
      'record.reason': e.detail.value
    })
    this.editHasCompleted();
  },

  /**
   * 设置维修结果
   */
  OnResultConfirm(e) {
    this.setData({
      'record.result': e.detail.value
    })
    this.editHasCompleted();
  },

  /**
   * 选择维修时间
   */
  selectDate(e) {
    this.setData({
      'record.date': e.detail.value
    })
  },

  /**
   * 开始录音
   */
  onRecordVoice() {
    //  取消播放路径
    innerAudioContext.stop();

    //  录音取样选项
    const options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }

    //  开始录音
    recorderManager.start(options);

    //  录音回调
    recorderManager.onStart(() => {
      console.log('recorder start')
    })

    //  录音错误回调
    recorderManager.onError((res) => {
        wx.showToast({
          title: '提示',
          content: '手指按住姿势不对!',
          icon: 'none',
          image: '',
          duration: 2000,
          mask: true
        })
      })

    this.setData({
      isSpeaking: true
    })

    this.speaking();
  },

  /**
   * 停止录音
   */
  stopRecordVoice() {
    var that = this;
    recorderManager.stop();
    //  录音停止回调
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
        that.setData({
          'record.audioDesc': res.tempFilePath
        })
      const {
        tempFilePath
      } = res
    })

    this.setData({
      isSpeaking: false
    })
  },

  /**
   * 播放语音描述
   */
  playAudioDesc() {
    innerAudioContext.src = this.data.record.audioDesc;
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  /**
   * 麦克风序列帧动画
   */
  speaking() {
    var that = this;
    var i = 1;
    this.timer = setInterval(function () {
      i++;
      i = i % 5;
      that.setData({
        frame: i
      })
    }, 150);
  },

  /**
   * 判断record中的name、reason、result属性是否为空，按条件disable提交按钮
   */
  editHasCompleted() {
    if (this.data.record.name.length == 0 || this.data.record.reason.length == 0 || this.data.record.result.length == 0) {
      this.setData({
        commitDisable: true
      })
    } else {
      this.setData({
        commitDisable: false
      })
    }
  },

  /**
   * 提交数据
   */
  onCommit() {
    try {
      var userInfo = JSON.parse(wx.getStorageSync('userInfo'));
      this.setData({
        'record.engineer': userInfo.nickName
      })
    } catch (e) {
      console.log(e);
    }

    console.log(this.data.record);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'record.r_id': options.scanCode
    })

    var now = new Date();
    this.setData({
      'record.date': util.dateFormater(now)
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