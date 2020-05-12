var express = require('express');
var router = express.Router();
const DB=require('../models/crud/db');
var {date_01,date_02,getDate}=require('../utils/dateFormate');
var ObjectID = require('mongodb').ObjectID;
var formidable = require('formidable'); //上传功能的插件
var path = require('path')
var fs = require("fs");

router.post("/uploadImage",function (req,res) {
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = path.join(__dirname + "/public/");
  form.keepExtensions = true;//保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;
  //处理图片
  form.parse(req, function (err, fields, files){
     console.log(req,'-------req属性-------');
      console.log(files.file.name,'-------files 属性name-------');

      var filename = files.file.name
      var nameArray = filename.split('.');
      var type = nameArray[nameArray.length - 1];
      var name = '';
      for (var i = 0; i < nameArray.length - 1; i++) {
          name = name + nameArray[i];
      }
      var date = new Date();
      var time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
      var avatarName = name + time + '.' + type;
      var newPath = form.uploadDir + "/" + avatarName;
      console.log(files.file.path,'---------------requset path---------')
      fs.renameSync(files.file.path, newPath);  //重命名
      res.send(JSON.stringify({data:"/upload/"+avatarName,imagePath:files.file.path,message:'上传成功',type:'success'}));
     
  })
});

//添加 api work/addWorkInfo
router.post('/addWorkInfo',function(req,res,next){
     
  let requestData={
    name:req.body.name,
    imageUrl:req.body.imageUrl,
    position:req.body.position,
    department:req.body.department,
    content:req.body.content
  }
  console.log(requestData,'添加工作信息')
   DB.find('t_works',{name:requestData.name,content:requestData.content}).then(data=>{
      console.log(data,data.length)
     if(data.length>0){
       res.send(JSON.stringify({code:1,message:'您已添加过此信息',type:'erro' }));
       return false;
     }else{
      var collectionName='t_works';
      let json={name:requestData.name,position:requestData.position,department:requestData.department,
        imageUrl:requestData.imageUrl,content:requestData.content,createTime:date_02(new Date())}
        DB.insert(collectionName,json);
        res.send(JSON.stringify({code:200,message:'添加成功',type:'error'}));
     } 
  }).catch(err=>{
    console.log(err)
  })
})

//获取工作列表 work/getWorkList
router.post('/getWorkList',function(req,res,next){
  var data={
      name:req.body.name,
      pageIndex:req.body.pageIndex,
      pageSize:req.body.pageSize, 
      full:req.body.full,
      isEdit:req.body.isEdit ,
      _id:req.body.workid
  }
  console.log('data',data)
  
  //查询全部
  if(data.full==true){
    var collectionName='t_works';
    let json={}
      DB.findAll(collectionName,json,data.pageSize,data.pageIndex).then(workList=>{
          DB.find(collectionName,json).then(resultList=>{
              console.log(resultList,'total')
              var total=resultList.length    
              res.send(JSON.stringify({code:200,message:"查询成功",workList:workList,total:total}));  
          })
     }).catch(err=>{
         console.log(err)
     }); 
  }else{
    var collectionName='t_works';
    var json={_id:ObjectID(data._id)};
    DB.find(collectionName,json).then(workList=>{
      console.log(workList,'total')
      var total=workList.length    
      res.send(JSON.stringify({code:200,message:"查询成功",workList:workList,total:total}));  
  })
  }
  
})

/**
 * 编辑
 *  @param {*} json1 查找条件
    * @param {*} json2 更新的数据
    * api:users/editUsers
 */
router.post('/editWorkInfo',function(req,res,next){
  var result=req.body;
  console.log(result,':editWorkInfo')
  var collectionName='t_works';
  let json1={_id:ObjectID(result.workid)}//查找条件
  let json2={name:result.name,imageUrl:result.imageUrl,position:result.position,
    department:result.department,content:result.content,updateTime:date_02(new Date())}//跟新条件
    DB.update(collectionName,json1,json2).then(data=>{
    //  console.log(data,'data');
      if(data.matchedCount>0){
          res.send(JSON.stringify({code:200,message:'修改成功',type:'success'}));
      }else{
          res.send(JSON.stringify({code:500,message:'修改失败',type:'error'}));
      }
  }).catch(err=>{
    res.send(JSON.stringify({code:500,message:'修改失败'+err,type:'error'}));
  });
})

//删除信息  
router.post('/deleteWorkInfo',function(req,res,next){
  var id=req.body._id;
  console.log(id,'array')
       //根据id先查数据是否存在
       var collectionName='t_works';
       var json={_id:ObjectID(id[0])};
       DB.find(collectionName,json).then(resultList=>{ 
         // console.log(resultList.length,'size',resultList)
      
          if(resultList.length>0){
          console.log('数据存在')
          DB.remove(collectionName,json).then(data=>{
           // console.log(data,'delete')
          res.send(JSON.stringify({code:200,message:"删除成功",type:'success'}));    
          }).catch(err=>{
            res.send(JSON.stringify({code:500,message:"删除失败"+err,type:'error'}));    
          })
          }else{
              res.send(JSON.stringify({code:500,message:"数据不存在"}));  
          }
      }).catch(err=>{
     console.log(err)
 });
})

module.exports=router
