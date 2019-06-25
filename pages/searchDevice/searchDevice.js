// pages/searchDevice/searchDevice.js
const api = require('../../utils/api.js');
var urlSafeBase64 = require('../../utils/safebase64.js');
const dateUtil = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bindBtnActive: false,
    results: [],
    keyword: '',
    recommend: ['POS', '电脑', '扫描平台', '小票打印机', '读卡器', '路由器', '摄像头', '报警主机'],
    bindActive: false,
    selectedDevice: {},
    assetNum: '',
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

    wx.showLoading({
      title: '玩命搜索中',
    })

    this.setData({
      keyword: e.detail.value,
      results: []  // 清空数组 避免上次搜索结果加入result
    })

    api.netbakeBaseDataRequest(e.detail.value, 1, (res) => {
      
      wx.hideLoading();      

      if (!res) return;

      // 设置页面搜索数据
      this.setData({
        results: res
      })

    },
    (err) => {  // 网络错误

      wx.showToast({
        title: '网络不给力哦',
        image: '../../assets/images/fail.png',
        mask: true
      })

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

    wx.showLoading({
      title: '玩命搜索中',
    })

    var devicename = this.data.recommend[e.currentTarget.dataset.index];

    this.setData({
      keyword: devicename
    })

    api.netbakeBaseDataRequest(devicename, 1, (res) => {
      wx.hideLoading();

      if (!res) return;

      // 设置页面搜索数据
      this.setData({
        results: res
      })

    }, (err) => { // 网络不给力

      wx.showToast({
        title: '网络不给力哦',
        image: '../../assets/images/fail.png',
        mask: true
      })

    })

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
          assetNum: res.result,
          bindBtnActive: true
        })
      },
    })
  },

  /**
   * 当资产编号input失去焦点 设置手填资产号
   */
  onAssetInput: function (e) {
    this.setData({
      assetNum: e.detail.value
    })
    if (e.detail.value.toString().length > 0) {
      this.setData({
        bindBtnActive: true
      })
    } else {
      this.setData({
        bindBtnActive: false
      })
    }

  },

  /**
   * 门店编号选择 
   */
  onFillShopNum: function (e) {
    this.setData({
      shopIdx: e.detail.value
    })

    api.netbakeBaseDataRequest(this.data.shops[this.data.shopIdx], 3, (res) => {
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
    wx.showLoading({
      title: '绑定中',
    })

    var now = dateUtil.formatTime(new Date()),
      wxopenid = wx.getStorageSync('wxopenid'),
      deviceBindUrl = api.deviceBindUrl,
      content = {
        'wxopenid': wxopenid,
        'deviceid': this.data.assetNum,
        'shopid': this.data.shopObj.id,
        'pid': this.data.selectedDevice.id,
        'storeid': this.data.storageObj.id.toString(),
        'bindsource': 'DeviceMaintainMP',
        'timestamp': now
      };

    api.netbakeRequest(deviceBindUrl, content, (res) => {

      if (res.code == 15104) {  // 设备已绑定
        wx.showToast({
          title: '资产编码已绑定',
          image: '../../assets/images/warning.png',
          mask: true
        })

      } else {  // 设备绑定成功

        wx.showToast({
          title: '设备绑定成功',
          image: '../../assets/images/success.png',
          mask: true
        })

        setTimeout(() => {  // 1s后跳转repair页面
          wx.navigateBack({
            url: '../repair/repair'
          })
        }, 1000);
      }

    }, (err) => { // 网络错误

      wx.showToast({
        title: '网络不给力哦',
        image: '../../assets/images/fail.png',
        mask: true
      })

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

    // 数组的最前添加五金仓
    shops.unshift('五金仓');

    this.setData({
      shops: shops
    })

    api.netbakeBaseDataRequest(this.data.shops[this.data.shopIdx], 3, (res) => {

      if (res) {
        this.setData({
          shopObj: res[0]
        })
      }

    },
      (err) => {

        wx.showToast({
          title: '网络不给力哦',
          image: '../../assets/images/fail.png',
          mask: true
        })

      })


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