// pages/home/map/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hh: '',
    size: 999,
    page: 1,
    scaleNum: 16,
    longitude: 109.72994327545165,
    latitude: 38.248578179012121,
    markers: [],
    polygons:[],
    polyline: [],
    satellite: false,
    list: [],
    info: {},
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.mapCtx = wx.createMapContext('map')
    const str1 = '109.72994327545165,38.248578179012121 109.72492218017578,38.247769307173883 109.72170352935787,38.2579301058651 109.71762657165519,38.264568400945294 109.71365690231322,38.272098930187056 109.71342086791992,38.273109680045685 109.71968650817871,38.274878458447489 109.7282266616821,38.277320986363314 109.73333358764641,38.278399041514433 109.73711013793945,38.27917388376715 109.739921092987,38.273092834330079 109.74198102951047,38.269908923899514 109.74820375442503,38.265663492859886 109.75208759307858,38.264585248638234 109.75322484970093,38.263961881396433 109.75373983383179,38.263456444570707 109.75273132324214,38.262698282738292 109.75215196609494,38.26217598887299 109.74951267242432,38.261131389877399 109.74577903747556,38.259109542701417 109.74753856658933,38.255773371851724 109.7470235824585,38.255478500898967 109.74789261817931,38.254669705857864 109.74712014198303,38.254105228984997 109.74400877952574,38.253667124509256 109.73891258239745,38.25340594558439 109.73811864852904,38.253161616062947 109.73441720008849,38.252386496282334 109.73047971725462,38.251299629623091 109.73082304000853,38.249648235217045 109.73119854927062,38.248999462862812 109.72994327545165,38.248578179012121'
    const str2 = '109.72927,38.26254 109.73600,38.26355 109.74703,38.25614 109.76142,38.25337 109.74494,38.25004 109.72798,38.25865'
    let arr1 = str1.split(' ')
    let arr2 = str2.split(' ')
    console.log(arr1)
    let list1 = []
    let list2 = []
    arr1.forEach((item, index) => {
      list1.push({
        longitude: item.split(',')[0],
        latitude: item.split(',')[1]
      })
    })
    arr2.forEach((item, index) => {
      list2.push({
        longitude: item.split(',')[0],
        latitude: item.split(',')[1]
      })
    })
    this.setData({
      // polyline: [
      //   {
      //     color: '#2e2e2e',
      //     width: 1,
      //     points: list1
      //   }
      // ],
      polygons: [{
        id: 1,
        dashArray: [10, 10],
        strokeColor: '#ff0000',
        points: list1,
        fillColor: '#ff000080',
        strokeWidth: 2,
        zIndex: 1
      },
      {
        id: 8,
        dashArray: [10, 10],
        strokeColor: '#4e6ef2',
        points: list2,
        fillColor: '#4e6ef280',
        strokeWidth: 2,
        zIndex: 2
      }]
    })
    // let time = 1
    // let aa = setInterval(() => {
    //   if (time < list1.length - 1) {
    //     time = time + 1
    //   } else if (time == list1.length - 1) {
    //     time = 0
    //   }
    //   this.setData({
    //     markers: [{
    //       ...list1[time],
    //       id: Math.random(),
    //       width:50,
    //       height:30,
    //       iconPath: '../111.gif'
    //     }]
    //   })
    // }, 1000);
    // aa()
    console.log(this.txMapToBdMap(109.751948,38.256469), 'baidu')
    console.log(this.txMapToBdMap(109.751948,38.256469), 'TX')
    this.setData({
      // longitude: 109.762422,
      // latitude: 38.252619,
      longitude: this.bdMapToTxMap(109.762422,38.252619).lng,
      latitude: this.bdMapToTxMap(109.762422,38.252619).lat,
      markers: [{
        id: Math.random(),
        longitude: this.bdMapToTxMap(109.762422,38.252619).lng,
        latitude: this.bdMapToTxMap(109.762422,38.252619).lat,
        // longitude: 109.762422,
        // latitude: 38.252619,
        width:50,
        height:30,
      }]
    })
    console.log(this.bdMapToTxMap(109.762422,38.252619))
  },
  txMapToBdMap (lng, lat) {
    let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    let x = lng;
    let y = lat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta) + 0.0065;
    let lats = z * Math.sin(theta) + 0.006;
    return {
        lng: lngs,
        lat: lats,
    };
  },
  bdMapToTxMap(lng, lat) {
    let pi = (3.14159265358979324 * 3000.0) / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
    lng = z * Math.cos(theta);
    lat = z * Math.sin(theta);
    return { lng: lng, lat: lat };
  },
  istap (e) {
    let istapArr = []
    this.data.polygons.forEach(item => {
      istapArr.push({
        id: item.id,
        istap:  this.isPtInPoly(e.detail.latitude, e.detail.longitude,  item.points)
      })
    })
    console.log(istapArr)
  },
  isPtInPoly(aLat, aLon, pointList) {
    /*
    :param aLat: double 纬度
    :param aLon: double 经度
    :param pointList: list [{latitude: 22.22, longitude: 113.113}...] 多边形点的顺序需根据顺时针或逆时针，不能乱
    */
    let iSum = 0
    let iCount = pointList.length

    if(iCount < 3) {
      return false
    }
    for(let i = 0; i < iCount;i++) {
      let pLat1 = pointList[i].latitude
      let pLon1 = pointList[i].longitude
      let pLat2 = 0, pLon2 = 0;
      if(i == iCount - 1) {
        pLat2 = pointList[0].latitude
        pLon2 = pointList[0].longitude
      } else {
        pLat2 = pointList[i + 1].latitude
        pLon2 = pointList[i + 1].longitude
      }
      if (((aLat >= pLat1) && (aLat < pLat2)) || ((aLat>=pLat2) && (aLat < pLat1))) {
        if (Math.abs(pLat1 - pLat2) > 0) {
            let pLon = pLon1 - ((pLon1 - pLon2) * (pLat1 - aLat)) / (pLat1 - pLat2);
            if(pLon < aLon) {
                iSum += 1
            }
             }
        }
      }
    if(iSum % 2 != 0) {
      return true
    }else {
       return false
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({ show: false })
    // this.gethouseList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})