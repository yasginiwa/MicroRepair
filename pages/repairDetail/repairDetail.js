// pages/repairDetail/repairDetail.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext();
var util = require('../../utils/util.js');
var api = require('../../utils/apiUtil.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    category: ['请选择', '打印设备', '收银设备', '通信设备', 'PC主机', 'PC外设', '监控设备', '入侵设备', '音频设备'],
    cateIdx: 0,
    record: {
      deviceId: '',
      cate: '',
      name: '',
      reason: '',
      result: '',
      audioDesc: '',
      date: '',
      engineer: ''
    },
    commitDisable: true, //  提交按钮disable
    frame: 1, //  序列帧动画初始帧
    isSpeaking: false, //  是否正在讲话
    isPlaying: false, //  是否播放录音  
    token: ''
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
        title: '手指按住姿势不对!',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    })

    this.setData({
      isSpeaking: true
    })
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
    var that = this;
    innerAudioContext.src = this.data.record.audioDesc;
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      that.setData({
        isPlaying: true
      })
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.onStop(() => {
      that.setData({
        isPlaying: false
      })
    })
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
    //  从本地获取用户信息
    try {
      var userInfo = wx.getStorageSync('userInfo');
      this.setData({
        'record.engineer': userInfo.nickName
      })
    } catch (e) {
      console.log(e);
    }

    //  从本地获取token信息
    try {
      var tokenInfo = wx.getStorageSync('token');
      this.setData({
        token: tokenInfo
      })
    } catch (e) {
      console.log(e);
    }

    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    var that = this;
    if (that.data.record.audioDesc.length == 0) { // 无录音
      wx.hideLoading();
      wx.request({
        url: api.dorecordUrl,
        method: 'POST',
        data: {
          deviceId: that.data.record.deviceId,
          cate: that.data.record.cate,
          name: that.data.record.name,
          reason: that.data.record.reason,
          result: that.data.record.result,
          date: that.data.record.date,
          engineer: that.data.record.engineer,
          token: that.data.token
        },
        success: function(res) {
          //  添加一个提交成功的标记 便于record表格刷新
          wx.setStorage({
            key: 'commitSuccess',
            data: true,
          })
          //  切换至record页面
          wx.switchTab({
            url: '../repair/repair',
          })
        }
      })
    } else { // 有录音、
      wx.uploadFile({
        url: api.uploadUrl,
        filePath: that.data.record.audioDesc,
        name: 'audio',
        success: function(res) {
          wx.hideLoading();
          var audio = JSON.parse(res.data);
          wx.request({
            url: api.dorecordUrl,
            method: 'POST',
            data: {
              deviceId: that.data.record.deviceId,
              cate: that.data.record.cate,
              name: that.data.record.name,
              reason: that.data.record.reason,
              result: that.data.record.result,
              audioDesc: audio.audioUrl,
              date: that.data.record.date,
              engineer: that.data.record.engineer,
              token: that.data.token
            },
            success: function(res) {
              //  添加一个提交成功的标记 便于record表格刷新
              wx.setStorage({
                key: 'commitSuccess',
                data: true,
              })
              //  切换至record页面
              wx.switchTab({
                url: '../repair/repair',
              })
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      'record.deviceId': options.scanCode
    })

    var now = new Date();
    this.setData({
      'record.date': util.dateFormater(now)
    })
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