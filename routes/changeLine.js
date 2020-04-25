var express = require('express');
var router = express.Router();
const DB=require('../models/crud/db');
var {date_01,date_02,getDate}=require('../utils/dateFormate');
var ObjectID = require('mongodb').ObjectID;

//添加站点
router.post('/add',function(req,res,next){

    var result=req.body;
    console.log(result,'add')
    console.log(result,'result')
    var collectionName='bus_line_stations';

    let json={line_name:result.line_name,
              station_name:result.station_name,
              index:result.index,
              userid:result.userid,
              createTime:date_02(new Date())}
   DB.insert(collectionName,json).then(count=>{
   
    if(count.insertedCount>0){
     res.send(JSON.stringify({code:200,message:'添加成功',json:json }));
    }else{
     res.send(JSON.stringify({code:400,message:'添加失败' }));
    }
   }).catch(err=>{
       console.log(err)
   });

})

router.post('/get',function(req,res,next){
    var data={
        line_name:req.body.line_name,
        pageIndex:req.body.pageIndex,
        pageSize:req.body.pageSize, 
        full:req.body.full,
        isEdit:req.body.isEdit,
        lineid:req.body.lineid ,
        sortName:'line_name'
    }
console.log('bus_line_stations',data)
    if(data.full==true){
        var collectionName='bus_line_stations';
        let json={}
            DB.findByIndex(collectionName,json,data.pageSize,data.pageIndex,data.sortName).then(lineList=>{ 
                DB.find(collectionName,json).then(resultList=>{
                    console.log(resultList,'total')
                    var total=resultList.length    
                    res.send(JSON.stringify({code:200,message:"查询成功",lineList:lineList,total:total}));  
                }).catch(err=>{
                res.send(JSON.stringify({code:400,message:"查询失败"+err}));  
                })
           }).catch(err=>{
               console.log(err)
           }); 
    }else{
        console.log('edit 查询')
        var collectionName='bus_line_stations';
        var json={_id:ObjectID(data.lineid)};
        console.log(json,'_id')
                DB.find(collectionName,json).then(lineList=>{
                    console.log(lineList.length,'total')
                  
                    res.send(JSON.stringify({code:200,message:"查询成功",lineList:lineList}));      
           }).catch(err=>{
            res.send(JSON.stringify({code:500,message:"查询失败"+err}));  
           }); 
    }
 
})

//删除站点信息  line/deleteLine
router.post('/delete',function(req,res,next){
    var id=req.body._id;
    console.log(id,'id')
         //根据id先查数据是否存在
         var collectionName='bus_line_stations';
         var json={_id:ObjectID(id[0])};

         DB.find(collectionName,json).then(resultList=>{ 
            console.log(resultList,'size',resultList.length)
            if(resultList.length>0){
            console.log('数据存在')
            DB.remove(collectionName,json).then(data=>{       

             res.send(JSON.stringify({code:200,message:"删除成功",type:'success'}));                        
            }).catch(err=>{
                res.send(JSON.stringify({code:50,message:err}));
            })
            }else{
                res.send(JSON.stringify({code:404,message:"数据不存在"}));  
            }
        }).catch(err=>{
       console.log(err)
   });
})
/**
 *  @param {*} json1 查找条件
    * @param {*} json2 更新的数据
    * api:line/editLine
 */
router.post('/edit',function(req,res,next){
    var result=req.body;
    console.log(result)
    var collectionName='bus_line_stations';
    let json1={_id:ObjectID(result.lineid)}//查找条件
    console.log(json1,'_id')

    let json2={
        line_name:result.line_name,    
        station_name:result.station_name,
        index:result.index,
        updateTime:date_02(new Date())
    }//跟新条件
        DB.update(collectionName,json1,json2).then(data=>{
        console.log(data,'data');
        if(data.matchedCount>0){
            res.send(JSON.stringify({code:200,message:'修改成功',type:'success'}));
        }else{
            res.send(JSON.stringify({code:500,message:'修改失败',type:'error'}));
        }
    });
   
  
})
module.exports = router;