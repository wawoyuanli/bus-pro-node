var express = require('express');
var router = express.Router();
const DB=require('../models/crud/db');
var {date_01,date_02,getDate}=require('../utils/dateFormate');
var ObjectID = require('mongodb').ObjectID;

//添加站点
router.post('/addStation',function(req,res,next){
    var result=req.body;
    console.log(result)
    var collectionName='t_stations';
    let json={station_name:result.station_name,
        line_names:result.line_names,
        userid:result.userid,createTime:date_02(new Date())}
    DB.insert(collectionName,json);
    res.send(JSON.stringify({code:200,message:'添加成功' }));
})

//删除站点信息
router.post('/deleteStation',function(req,res,next){
    var id=req.body._id;
    console.log(id[0],'array')

         //根据id先查数据是否存在
         var collectionName='t_stations';
         var json={_id:ObjectID(id[0])};

         DB.find(collectionName,json).then(resultList=>{ 
            console.log(resultList.length,'size')
            if(resultList.length>0){
            console.log('数据存在')
            DB.remove(collectionName,json).then(data=>{
                if(data.deletedCount>0){
                    res.send(JSON.stringify({code:200,message:"删除成功",type:'success'}));  
                }else{
                    res.send(JSON.stringify({code:404,message:"删除失败",type:'error'}));  
                }
            }).catch(err=>{
                console.log(err)
            })
            }else{
                res.send(JSON.stringify({code:404,message:"数据不存在"}));  
            }
        }).catch(err=>{
       console.log(err)
   });
})

// 查询数据集合 station/getStationList 
router.post('/getStationList',function(req,res,next){
    var data={
        station_name:req.body.station_name,
        _id:req.body.stationid,
        pageIndex:req.body.pageIndex,
        pageSize:req.body.pageSize,  
        full:req.body.full,
        isEdit:req.body.isEdit
    }
    console.log(data.station_name,'站点关键字')
    //查询全部
    //编辑查询
    //模糊查询 
    if(data.full==true && data.station_name==''){
    var collectionName='t_stations';  
    console.log('查询全部数据')
    DB.findAll(collectionName,{},data.pageSize,data.pageIndex).then(stationList=>{
    console.log('查询全部数据',stationList)
    
        if(stationList.length>0){
            DB.find(collectionName,json).then(resultList=>{
                var total=resultList.length   
                console.log(total,'total') 
                res.send(JSON.stringify({code:200,message:"查询成功",
                stationList:stationList,total:total,type:'success'}));  
            })
        }else{
            res.send(JSON.stringify({code:404,message:"查询失败",type:'error'})); 
        }
        
        }).catch(err=>{
        console.log(err)
        });
      }else if(data.isEdit==true){
         console.log('编辑查询',data._id)
         var json={_id:ObjectID(data._id)};
        var collectionName='t_stations';  
           DB.find(collectionName,json).then(data=>{
               console.log(data.length,'resultList data')
             if(data.length>0){
                res.send(JSON.stringify({code:200,message:"查询成功",
                stationList:data,total:data.length,type:'success'}));  
             }else{
                res.send(JSON.stringify({code:404,message:"查询失败",type:'error'}));  
             }
        }).catch(err=>{
        console.log(err)
        });
      }else if(!data.station_name==''){
          //模糊查询
          //模糊查询传递条件 
          console.log('模糊搜索查询')
        var json={station_name:{$regex:data.station_name}}
        //调用接口
        DB.findByLike('t_stations',json).then(resultList=>{
        console.log('result',resultList)
        var total=resultList.length
        console.log(total,'total')  
        res.send(JSON.stringify({code:200,message:"查询成功",
        stationList:resultList,total:total,type:'success'}));   
        }).catch(err=>{
            res.send(JSON.stringify({code:400,message:"查询失败"+err,type:'error'}));  
        })
      }
})
/**
 *  @param {*} json1 查找条件
    * @param {*} json2 更新的数据
    * api:station/editStation
 */
router.post('/editStation',function(req,res,next){
    var result=req.body;
    console.log(result)
    var collectionName='t_stations';
    let json1={_id:ObjectID(result.stationid)}//查找条件

    let json2={station_name:result.station_name,
        line_names:result.line_names,
        updateTime:date_02(new Date())}//跟新条件
    DB.update(collectionName,json1,json2).then(data=>{
        console.log(data,'data');
        if(data.matchedCount>0){
            res.send(JSON.stringify({code:200,message:'修改成功',type:'success'}));
        }else{
            res.send(JSON.stringify({code:404,message:'修改失败',type:'error'}));
        }
    });
})

//根据站点名称查询 模糊查询 db.bus_line_stations.find({station_name:/皓月路/});名字中包含的
router.post('/getStation',function(req,res,next){
    var data={
        station_name:req.body.station_name,
    }
    if(data.station_name==''){
           console.log('站点不能为空');
           return;
    }else{
        //模糊查询传递条件
        var json={station_name:{$regex:data.station_name}}
        //调用接口
        DB.findByLike('bus_line_stations',json).then(resultList=>{
        console.log('result',resultList)
        var total=resultList.length
        
        console.log(total,'total') 
        res.send(JSON.stringify({code:200,message:"查询成功",
        resultList:resultList,total:total,type:'success'}));   

        }).catch(err=>{
            res.send(JSON.stringify({code:400,message:"查询失败"+err,type:'error'}));  
        })
    }
})
      
module.exports = router
