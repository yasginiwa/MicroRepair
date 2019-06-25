// pages/repairDetail/repairDetail.js
const api = require('../../utils/api.js');
var urlSafeBase64 = require('../../utils/safebase64.js');
const dateUtil = require('../../utils/util.js');
var dateTimePicker = require('../../utils/dateTimePicker.js');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 维修记录模型
    record: {
      wxopenid: '',
      deviceid: '',
      shopid: '',
      pid: '',
      storeid: '',
      reason: '',
      result: '',
      maintaindate: '',
      timestamps: '',
      memo: '',
    },
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
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
        title: '严重故障',
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
    ],
    reasonTypeObj: {},
    resultTypeObj: {},
    reasonTypeIdx: 0,
    resultTypeIdx: 0
  },

  //选择精确时间方法
  changeDate(e) {
    this.setData({
      date: e.detail.value
    });
  },

  changeTime(e) {
    this.setData({
      time: e.detail.value
    });
  },

  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value
    });
  },

  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
  },

  changeDateTimeColumn(e) {
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;


    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    })

  //时间拼接 （格式：2018-09-19 17:30:55）
    let editTime = `${this.data.dateTimeArray[0][this.data.dateTime[0]]}-${this.data.dateTimeArray[1][this.data.dateTime[1]]}-${this.data.dateTimeArray[2][this.data.dateTime[2]]} ${this.data.dateTimeArray[3][this.data.dateTime[3]]}:${this.data.dateTimeArray[4][this.data.dateTime[4]]}:${this.data.dateTimeArray[5][this.data.dateTime[5]]}`

    this.setData({
      record: {
        maintaindate: editTime
      }
    })
  },

  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },


  /**
  * 查询一网其他资料
  */
  queryData: function (data, datatype, success) {
    wx.showLoading({
      title: '加载中'
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
        wx.showToast({
          title: '网络不给力哦',
          icon: 'none',
          mask: true
        })
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
   * 故障原因类型选择
   */
  onFillReasonType: function (e) {
    this.setData({
      reasonTypeIdx: e.detail.value
    })

    this.setData({
      reasonTypeObj: this.data.reasonTypes[this.data.reasonTypeIdx]
    })
  },

  /**
   * 维修结果类型选择
   */
  onFillResultType: function (e) {
    this.setData({
      resultTypeIdx: e.detail.value
    })

    this.setData({
      resultTypeObj: this.data.resultTypes[this.data.resultTypeIdx]
    })
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

    wx.showLoading({
      title: '提交中',
      mask: true
    })

    var content = {
      'wxopenid': wx.getStorageSync('wxopenid'),
      'deviceid': this.data.record.deviceid,
      'shopid': this.data.shopObj.id,
      'storeid': this.data.storageObj.id,
      'reason': this.data.record.reason,
      'result': this.data.record.result,
      'maintaindate': this.data.record.maintaindate,
      'timestamp': dateUtil.formatTime(new Date()),
    };

    var url = api.addMaintainUrl;

    api.netbakeRequest(url, content, (res) => {

      wx.showToast({
        title: '提交成功',
        image: '../../assets/images/success.png',
        mask: true
      })

      console.log(res);

      setTimeout(function () {
        wx.navigateBack({});
      }, 1000)

    }, (err) => {

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
      'record.deviceid': options.scanCode
    })

    this.setData({
      'record.maintaindate': dateUtil.formatTime(new Date())
    })


    // 选择默认日期
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    })

    // this.setData({
    //   maintaindate: `${this.data.dateTimeArray[0][this.data.dateTime[0]]}-${this.data.dateTimeArray[1][this.data.dateTime[1]]}-${this.data.dateTimeArray[2][this.data.dateTime[2]]} ${this.data.dateTimeArray[3][this.data.dateTime[3]]}:${this.data.dateTimeArray[4][this.data.dateTime[4]]}:${this.data.dateTimeArray[5][this.data.dateTime[5]]}`
    // })

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