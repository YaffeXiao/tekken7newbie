//index.js
const app = getApp()
let testData =  {user:'test'};
const db = wx.cloud.database();
let characterDataset = [];
const characterColumn = 5;
const queryMaxCount = 20;
const that = this;
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  onLoad: function() {
    // console.info(this.getData('characterMoveList'));
    
    // that.setData({
    //   charactersMoveList:[]
    // });
  },
  onReady: function (options) {

      // this.getData();
      //console.info(characterDataset.length);
      // this.setCharacterDatas();
      // console.info(options.get('share'));
      if(characterDataset.length == 0){
        this.setCharacterDatas();
      }else{
        this.setCharacterList();
      }
  },
  onShow: function (options) {
    //console.info("收集用户数据");
    wx.getUserInfo({
      success: function(res) {
        // console.log(res.userInfo);
        const db = wx.cloud.database();
      //   db.collection('tk_fans').where()
        let userInfo = res.userInfo;
        let tkFansDao = db.collection('tk_fans');
        tkFansDao.where({"nickName":userInfo.nickName, "avatarUrl":userInfo.avatarUrl }).count({
          success: function(res) {
            // console.log(res);
            if (res.total == 0){
              tkFansDao.add({
                data: userInfo,
                success: function(res) {
                  // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                  console.log(res);
                }
              });
            }
          }
        });
      }
    })
    

  },
  iconclick:function(event){
    let character_name = event.currentTarget.id;
    if(character_name == ""){
      return;
    }
    console.log(event);
    wx.navigateTo({
      url: '/pages/tekken7/charactersMoveList/charactersMoveList?name='+character_name,
      success: function(res) {
      },
      fail: function(res) {
      },
      complete: function(res) {
      },
     });
  },
  setCharacterDatas(){
    db.collection('tekken7-character').where({}).count().then(x =>{
      let queryTimes = parseInt(x.total / queryMaxCount) + 1;
      // console.info(queryTimes);
      this.queryDB(queryTimes);
    });
  },
  getQueryDBP(skipCount){
    // console.info("skipCount", skipCount);
    let dbQueryP = new Promise(function(resolve, reject){
      db.collection('tekken7-character').skip(skipCount).get({
        success: function(res) {
          characterDataset.push(...res.data);
          resolve("");
        }
      });
    });
    return dbQueryP;
  },
  queryDB(queryTimes){
    let that = this;
    let i = 0;
    let pArray = []
    while(i < queryTimes){
      pArray.push(this.getQueryDBP(i * queryMaxCount))
      i++;
    }

    Promise.all(pArray).then(x =>{
      that.setCharacterList();
    });
  },
  setCharacterList(){
    // console.info(characterDataset);
    characterDataset = characterDataset.sort((a, b) => a._id - b._id);
    // console.info(characterDataset);
    let td_count = 5;
    let result = [];
    let tmpData = [];
    for(let i=0; i < characterDataset.length; i ++){
      if(i % td_count == 0 && i != 0 ){
        result.push(tmpData);
        tmpData = [];
      }
      tmpData.push(characterDataset[i]);
      if(i ==  characterDataset.length -1 ) result.push(tmpData);
    }
    let add_count = td_count - (characterDataset.length % td_count);
    for(let i=0; i <add_count; i ++){
      result[result.length -1].push({"_id":"", "character_name":"",pic_url:""});
    }
    // console.log(result);
    this.setData({
      charactersList:result
    });
  },
  onShareAppMessage: function () {

    return {
    
    title: '铁拳7新手小工具',
    
    desc: '菜鸟专用',
    
    path: '/pages/index/index?share=1',
    imageUrl: "/images/1.png",
    }
    
    }
})
