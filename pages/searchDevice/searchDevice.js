// pages/searchDevice/searchDevice.js
const api = require('../../utils/api.js');
var urlSafeBase64 = require('../../utils/safebase64.js');
const dateUtil = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    results: [],
    keyword: '',
    recommend: ['POS', '电脑', '路由器', '交换机', '小票打印机', '摄像头', '报警主机', 'NVR'],
    bindActive: false,
    selectedDevice: {},
    assetNum: '扫描资产编码',
    shopIdx: 0,
    storageIdx: 0,
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
  },

  onInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })

    this.queryDevice(e.detail.value);
  },

  /**
   * 查询一网设备资料
   */
  queryDevice: function (devicename) {
    wx.showLoading({
      title: '玩命搜索中...',
    })

    // 清空数组 避免上次搜索结果加入result
    this.setData({
      results: []
    });

    var now = dateUtil.formatTime(new Date());
    var wxopenid = wx.getStorageSync('wxopenid');
    var content = {
      'wxopenid': wxopenid,
      'datatype': 1,
      'datavalue': devicename,
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

        // 设置页面搜索数据
        this.setData({

          results: this.data.results.concat(api.decryptContent(content))

        })

      },
      fail: (err) => {

        console.log(err);
      }

    })

  },

  /**
   * 查询一网其他资料
   */
  queryData: function (data, datatype, success) {
    wx.showLoading({
      title: '玩命搜索中...'
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
   * 取消搜索
   */
  onSearchCancel: function () {

    this.setData({
      results: [],
      keyword: ''
    })
  },

  /**
   * 选择了推荐搜索关键词
   */
  onSelectRecommend: function (e) {

    var devicename = this.data.recommend[e.currentTarget.dataset.index];

    this.setData({
      keyword: devicename
    })

    this.queryDevice(devicename);

  },

  /**
   * 选中了搜索结果
   */
  onSearchConfirm: function (e) {

    var device = this.data.results[e.currentTarget.dataset.index];

    this.setData({
      bindActive: true,
      selectedDevice: device
    })

  },

  /**
   * 关闭弹窗
   */
  cancelBind: function () {
    this.setData({
      bindActive: false
    })
  },

  /**
   * 扫描资产编码
   */
  onScanDeviceQR: function () {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: (res) => {
        this.setData({
          assetNum: res.result
        })
      },
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
   * 绑定设备
   */
  bindDevice: function () {

    var now = dateUtil.formatTime(new Date());
    var wxopenid = wx.getStorageSync('wxopenid');
    var content = {
      'wxopenid': wxopenid,
      'deviceid': this.data.assetNum,
      'shopid': this.data.shopObj.id,
      'pid': this.data.selectedDevice.id,
      'storeid': this.data.storageObj.id.toString(),
      'bindsource': 'DeviceMaintainMP',
      'timestamp': now
    }

    console.log(content);

    var deviceBindUrl = api.deviceBindUrl,
      encContent = urlSafeBase64.encode(api.encryptContent(content)),
      sign = api.sign(content),
      token = api.token;

    // 发出搜索请求
    wx.request({
      url: deviceBindUrl,
      data: {
        token: token,
        content: encContent,
        sign: sign
      },
      success: (res) => {
        // 隐藏加载菊花
        wx.hideLoading();

        console.log(res);

        // 如果没有返回结果 直接return
        if (!res.data) return;

        // content转换成对象
        var content = JSON.parse(JSON.parse(res.data)).content;

        if (!api.decryptContent(content)) return;

      },
      fail: (err) => {

        console.log(err);

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