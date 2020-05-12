var express = require('express');
var router = express.Router();
const DB=require('../models/crud/db');
var {date_01,date_02,getDate}=require('../utils/dateFormate');
var t_user=require('../models/t_user');
var md5=require('md5');
var ObjectID = require('mongodb').ObjectID;

//添加t_user
router.post('/addUser',function(req,res,next){
     
  let userInfo={
    username:req.body.username,
    password:req.body.password
  }
 console.log(userInfo,'注册请求数据')
   DB.find('t_users',{username:userInfo.username }).then(data=>{
     console.log(data,data.length)
     if(data.length>0){
       res.send(JSON.stringify({code:1,message:'用户已存在,请直接使用账号',type:'erro' }));
       return;
     }else{
      var collectionName='t_users';
      let json={username:userInfo.username,password:userInfo.password,createTime:date_02(new Date())}
      DB.insert(collectionName,json);
      res.send(JSON.stringify({code:200,message:'注册成功',type:'success'}));
     } 
  }).catch(err=>{
    console.log(err)
  })
})

//获取用户列表 接口：users/getUserList
router.post('/getUserList',function(req,res,next){
  var data={
      username:req.body.username,
      pageIndex:req.body.pageIndex,
      pageSize:req.body.pageSize, 
      full:req.body.full,
      isEdit:req.body.isEdit ,
      _id:req.body.userid
  }
  console.log('data',data)
  
  //查询全部
  if(data.full==true){
    var collectionName='t_users';
    let json={}
      DB.findAll(collectionName,json,data.pageSize,data.pageIndex).then(userList=>{
          DB.find(collectionName,json).then(resultList=>{
              console.log(resultList,'total')
              var total=resultList.length    
              res.send(JSON.stringify({code:200,message:"查询成功",userList:userList,total:total}));  
          })
     }).catch(err=>{
         console.log(err)
     }); 
  }else{
    var collectionName='t_users';
    var json={_id:ObjectID(data._id)};
    DB.find(collectionName,json).then(userList=>{
      console.log(userList,'total')
      var total=userList.length    
      res.send(JSON.stringify({code:200,message:"查询成功",userList:userList,total:userList.length}));  
  })
  }
  
})

//删除用户信息 api:users/deleteUser
router.post('/deleteUser',function(req,res,next){
  var id=req.body._id;
  console.log(id,'array')
       //根据id先查数据是否存在
       var collectionName='t_users';
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

/**
 * 编辑
 *  @param {*} json1 查找条件
    * @param {*} json2 更新的数据
    * api:users/editUsers
 */
router.post('/editUser',function(req,res,next){
  var result=req.body;
  console.log(result)
  var collectionName='t_users';
  let json1={_id:ObjectID(result.userid)}//查找条件
  let json2={username:result.username,password:result.password,updateTime:date_02(new Date())}//跟新条件
    DB.update(collectionName,json1,json2).then(data=>{
      console.log(data,'data');
      if(data.matchedCount>0){
          res.send(JSON.stringify({code:200,message:'修改成功',type:'success'}));
      }else{
          res.send(JSON.stringify({code:404,message:'修改失败',type:'error'}));
      }
  }).catch(err=>{
    res.send(JSON.stringify({code:500,message:'修改失败'+err,type:'error'}));
  });
})
module.exports = router
