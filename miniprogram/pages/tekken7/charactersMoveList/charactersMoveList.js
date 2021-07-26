// pages/tekken7/charactersMoveList.js
const db = wx.cloud.database();
let characterMoveList = [];
let nowCharacterName = "";
const queryMaxCount = 20;

Page({
  data: {
    // charactersMoveList: '',
    modalHidden: true,
  },
  /**
   * 显示弹窗
   */
  buttonTap: function() {
    this.setData({
      modalHidden: false
    })
  },

  /**
   * 点击取消
   */
  modalCandel: function() {
    // do something
    this.setData({
      modalHidden: true
    })
  },

  /**
   *  点击确认
   */
  modalConfirm: function() {
    // do something
    this.setData({
      modalHidden: true
    })
  },
  showInfo:function(event){
    // console.info(event.currentTarget.id)
    let datas = event.currentTarget.dataset.cap;
    let nowPicData = datas.cmd_gif_url;
    if(event.currentTarget.id == 'png'){
      nowPicData = datas.cmd_png_url;
    }
    console.info(datas.info == undefined);
    let infoStr = '';
    if(datas.info != undefined){
      infoStr = datas.info;
    }
    this.setData({
      // windowImgStyle: windowImgStyle,
      nowPic : nowPicData,
      cmdName : datas.cmd_name,
      cmdInfo : infoStr
    });
    this.buttonTap();
  },

  onLoad: function() {
    // console.info(this.getData('characterMoveList'));
    
    // that.setData({
    //   charactersMoveList:[]
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  setMoveListDatas(characterName){
    // console.info(characterName);
    // db.collection(characterName).get().then(x =>{
    //   console.info(x.data);
    // });
    db.collection(characterName).where({}).count().then(x =>{
      let queryTimes = parseInt(x.total / queryMaxCount) + 1;
      // console.info(queryTimes);
      this.queryDB(queryTimes, characterName);
    });
  },
  getQueryDBP(characterName, skipCount){
    // console.info("skipCount", skipCount);
    let dbQueryP = new Promise(function(resolve, reject){
      db.collection(characterName).skip(skipCount).get({
        success: function(res) {
          characterMoveList.push(...res.data);
          // console.info(characterMoveList);
          resolve("");
        }
      });
    });
    return dbQueryP;
  },
  queryDB(queryTimes, characterName){
    let that = this;
    let i = 0;
    let pArray = []
    while(i < queryTimes){
      pArray.push(this.getQueryDBP(characterName, i * queryMaxCount))
      i++;
    }
    Promise.all(pArray).then(x =>{
      characterMoveList = characterMoveList.sort((a, b) => a._id - b._id);
      that.setData({characterMoveList:characterMoveList});
    });
  },
  getData(characterName){
    let that = this;
    const db = wx.cloud.database()
    // const db = wx.cloud.database({
      // env: 'tekken7-newbie'
    // })
    // const todos = db.collection('tekken7-character')
    // console.info(characterName)
    db.collection(characterName).get({
      success: function(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        // console.log("~~~~~~~~~");
        // console.log(res.data);
        that.setData({
          charactersMoveList:res.data
        });
        
      }
    })
    // db.collection('tekken7-character').get().then(res => {
    //   // res.data 包含该记录的数据
    //   console.log(res.data)
    // })

  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let that = this;
    let threeArray = [];
    console.log(this.options)
    // this.getData(this.options.name); 
    if(nowCharacterName != this.options.name){
      characterMoveList = [];
      this.setMoveListDatas(this.options.name); 
    }
   
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

  },
  onShareAppMessage: function () {

    return {
    
    title: '铁拳7新手小工具',
    
    desc: '菜鸟专用',
    
    path: '/pages/index/index',
    imageUrl: "/images/1.png",
    }
    
    }
})