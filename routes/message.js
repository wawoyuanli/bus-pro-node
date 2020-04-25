
var express = require('express');
var router = express.Router();
const DB=require('../models/crud/db');
var {date_01,date_02,getDate}=require('../utils/dateFormate');
var ObjectID = require('mongodb').ObjectID;
 
//获取留言列表 接口：message/getMessageList
router.post('/getMessageList',function(req,res,next){
    var data={
        content:req.body.content,
        pageIndex:req.body.pageIndex,
        pageSize:req.body.pageSize,  
    }
    console.log('data',data)
    var collectionName='t_messages';
   let json={}
        DB.findAll(collectionName,json,data.pageSize,data.pageIndex).then(messageList=>{
            DB.find(collectionName,json).then(resultList=>{
                console.log(resultList,'total')
                var total=resultList.length    
                res.send(JSON.stringify({code:200,message:"查询成功",messageList:messageList,total:total}));  
            })
       }).catch(err=>{
           console.log(err)
       }); 
})

//删除留言
router.post('/deleteMessage',function(req,res,next){
    var id=req.body._id;
    console.log(id,'array')
         //根据id先查数据是否存在
         var collectionName='t_messages';
         var json={_id:ObjectID(id[0])};

         DB.find(collectionName,json).then(resultList=>{ 
            console.log(resultList.length,'size')
            if(resultList.length>0){
            console.log('数据存在')
            DB.remove(collectionName,json).then(data=>{
               
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

//添加留言
router.post('/addMessage',function(req,res,next){
    var result=req.body;
    console.log(result)
    var collectionName='t_messages';

    let json={username:result.username,
              content:result.content,
              createTime:date_02(new Date())}
              
   DB.insert(collectionName,json).then(count=>{
    if(count.insertedCount>0){
     res.send(JSON.stringify({code:200,message:'添加成功' }));
    }else{
     res.send(JSON.stringify({code:400,message:'添加失败' }));
    }
   }).catch(err=>{
       console.log(err)
   });
})

//留言回复messageResponse
router.post('/messageResponse',function(req,res,next){
    var result=req.body;
    console.log(result,'request')
    var collectionName='t_message_response';
    let jsonStr={_id:ObjectID(result.id)}
    var username='';
        DB.find('t_messages',jsonStr).then(message=>{  
            console.log(message,'message')
        username=message[0].username

        let json={author:username,
            admin:result.admin,
            content:result.content,
            createTime:date_02(new Date())}  

   DB.insert(collectionName,json).then(count=>{
  if(count.insertedCount>0){
   res.send(JSON.stringify({code:200,message:'添加成功' }));
  }else{
   res.send(JSON.stringify({code:400,message:'添加失败' }));
  }
 }).catch(err=>{
     console.log(err)
 });
})  
})

module.exports=router