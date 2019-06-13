// pages/repairDetail/repairDetail.js
const api = require('../../utils/api.js');
var urlSafeBase64 = require('../../utils/safebase64.js');
const dateUtil = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    record: {
      wxopenid: '',
      deviceid: '',
      shopid: '',
      pid: '',
      storeid: '',
      reason: '',
      result: '',
      maintaindate: '',
      timestamps:'',
      memo: ''
    },
    commitDisable: true, //  提交按钮disable
    shops: [],
    storages: [
      {
        id: 24,
        name: '五金仓'
      },
      {
        id: 22,
        name: '材料仓'
      }
    ],
    shopObj: {},
    storageObj: {},
    shopIdx: 0,
    storageIdx: 0,
  },

  /**
  * 查询一网其他资料
  */
  queryData: function (data, datatype, success) {
    wx.showLoading({
      title: '加载中...'
    })

    var now = dateUtil.formatTime(new Date());
    var wxopenid = wx.getStorageSync('wxopenid');
    var content = {
      'wxopenid': wxopenid,
      'datatype': datatype,
      'datavalue': data,
      'datasource': '15',
      'timestamp': now
    }

    var basedataqueryUrl = api.basedataqueryUrl,
      encContent = urlSafeBase64.encode(api.encryptContent(content)),
      sign = api.sign(content),
      token = api.token;

    // 发出搜索请求
    wx.request({
      url: basedataqueryUrl,
      data: {
        token: token,
        content: encContent,
        sign: sign
      },
      success: (res) => {
        // 隐藏加载菊花
        wx.hideLoading();

        // 如果没有返回结果 直接return
        if (!res.data) return;

        // content转换成对象
        var content = JSON.parse(JSON.parse(res.data)).content;

        if (!api.decryptContent(content)) return;

        success(api.decryptContent(content));

      },
      fail: (err) => {

        console.log(err);
      }
    })
  },

  /**
 * 门店编号选择 
 */
  onFillShopNum: function (e) {
    this.setData({
      shopIdx: e.detail.value
    })

    this.queryData(this.data.shops[this.data.shopIdx], 3, (res) => {
      if (res) {
        this.setData({
          shopObj: res[0]
        })
      }
    });

  },

  /**
   * 仓库编号选择
   */
  onFillStorageNum: function (e) {
    this.setData({
      storageIdx: e.detail.value
    })

    this.setData({
      storageObj: this.data.storages[this.data.storageIdx]
    })

  },

  /**
   * 设置设备名称
   */
  OnNameConfirm(e) {
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
   * 判断record中的reason、result属性是否为空，按条件disable提交按钮
   */
  editHasCompleted() {
    if (this.data.record.reason.length == 0 || this.data.record.result.length == 0) {
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
      title: '提交中...',
      mask: true
    })
    var that = this;

    wx.hideLoading();
    wx.request({
      url: api.addMaintainUrl,
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
      success: function (res) {
        //  添加一个提交成功的标记 便于record表格刷新
        wx.setStorage({
          key: 'commitSuccess',
          data: true,
        })
        //  切换至record页面
        wx.switchTab({
          url: '../repair/repair',
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '网络超时，请检查手机网络设置！',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shop = '';
    var shops = [];
    for (var i = 1; i < 201; i++) {

      shop = i + '店';
      switch (shop.length) {
        case 2:
          shop = '00' + shop;
          break;

        case 3:
          shop = '0' + shop;
          break;

        default:
          break;
      }

      shops.push(shop);
    }

    this.setData({
      shops: shops
    })

    // 选择默认门店 001店
    this.queryData(this.data.shops[this.data.shopIdx], 3, (res) => {
      if (res) {
        this.setData({
          shopObj: res[0]
        })
      }
    });

    // 选择默认仓库 五金仓
    this.setData({
      storageObj: this.data.storages[this.data.storageIdx]
    })

    this.setData({
      'record.deviceId': options.scanCode
    })

    this.setData({
      'record.date': dateUtil.formatDate(new Date())
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