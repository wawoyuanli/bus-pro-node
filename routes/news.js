var express = require('express');
var router = express.Router();
const DB=require('../models/crud/db');
var {date_01,date_02,getDate}=require('../utils/dateFormate');
var ObjectID = require('mongodb').ObjectID;


//添加新闻公告
router.post('/addNews',function(req,res,next){
    var result=req.body;
    console.log(result)
    var collectionName='t_news';

    let json={title:result.title,
              content:result.content,
              userid:result.userid,
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

//获取公告列表 接口：news/getLineList
router.post('/getNewsList',function(req,res,next){
    var data={
        title:req.body.line_name,
        pageIndex:req.body.pageIndex,
        pageSize:req.body.pageSize,  
        full:req.body.full,
        isEdit:req.body.isEdit,
        _id:req.body.newsid
    }
    console.log('data',data)
    if(data.full==true){
        var collectionName='t_news';
        let json={}
     
             DB.findAll(collectionName,json,data.pageSize,data.pageIndex).then(newsList=>{
                 DB.find(collectionName,json).then(resultList=>{
                     console.log(resultList,'total')
                     var total=resultList.length    
                     res.send(JSON.stringify({code:200,message:"查询成功",newsList:newsList,total:total}));  
                 })
            }).catch(err=>{
                console.log(err)
            }); 
    }else{
        //编辑查询
        var collectionName='t_news';
        var json={_id:ObjectID(data._id)};
                 DB.find(collectionName,json).then(newsList=>{
                     console.log(newsList.length,'total')
                     var total=newsList.length    
                     res.send(JSON.stringify({code:200,message:"查询成功",newsList:newsList,total:total})); 
            }).catch(err=>{
                res.send(JSON.stringify({code:500,message:"查询失败",type:'error'}));
            }); 
    }

})

//删除公告
router.post('/deleteNews',function(req,res,next){
    var id=req.body._id;
    console.log(id,'array')
         //根据id先查数据是否存在
         var collectionName='t_news';
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
/**
 *  @param {*} json1 查找条件
    * @param {*} json2 更新的数据
    * api:news/editNews
 */
router.post('/editNews',function(req,res,next){
    var result=req.body;
    console.log(result,'result request')
    var collectionName='t_news';
    let json1={_id:ObjectID(result.newsid)}//查找条件
    console.log('jsono1',json1)
    let json2={title:result.title,content:result.content,updateTime:date_02(new Date())}//跟新条件
      DB.update(collectionName,json1,json2).then(data=>{
      
        if(data.matchedCount>0){
            res.send(JSON.stringify({code:200,message:'修改成功',type:'success'}));
        }else{
            res.send(JSON.stringify({code:404,message:'修改失败',type:'error'}));
        }
    }).catch(err=>{
      res.send(JSON.stringify({code:500,message:'修改失败'+err,type:'error'}));
    });
  })
module.exports=router