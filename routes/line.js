var express = require('express');
var router = express.Router();
const DB=require('../models/crud/db');
var {date_01,date_02,getDate}=require('../utils/dateFormate');
var ObjectID = require('mongodb').ObjectID;

//添加站点
router.post('/addLine',function(req,res,next){

    var result=req.body;
    console.log(result)
    var collectionName='t_lines';

    let json={line_name:result.line_name,
              start_station:result.start_station,
              mid_station:result.mid_station,
              end_station:result.end_station,
              start_time:result.start_time,
              end_time:result.end_time,
              interval:result.interval,
              distance:result.distance,
              price:result.price,
              direction:result.direction,
              station_num:result.station_num,
              userid:result.userid,
              createTime:date_02(new Date())}

              console.log('request data----添加数据获取',json)
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

//获取线路列表 接口：line/getLines
router.post('/getLines',function(req,res,next){
    var data={
        lineid:req.body.lineid,
        line_name:req.body.line_name,
        pageIndex:req.body.pageIndex,
        pageSize:req.body.pageSize, 
        full:req.body.full,
        isEdit:req.body.isEdit ,
        sortName:req.body.sortName
    }
    console.log('line data',data)
    if(data.full==true && data.line_name==''){
        var collectionName='t_lines';
        let json={}
            DB.findAll(collectionName,json,data.pageSize,data.pageIndex,data.sortName).then(lineList=>{
            
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
    }else if(data.isEdit==true){
        var collectionName='t_lines';
        var json={_id:ObjectID(data.lineid)};
                DB.find(collectionName,json).then(lineList=>{
                    console.log(lineList.length,'total')
                  
                    res.send(JSON.stringify({code:200,message:"查询成功",lineList:lineList}));      
           }).catch(err=>{
            res.send(JSON.stringify({code:500,message:"查询失败"+err}));  
           }); 
    }else if(!data.line_name==''){
    console.log('线路模糊查询')
        var collectionName='t_lines';
        var json={line_name:{$regex:data.line_name}}
                DB.findByLike(collectionName,json).then(lineList=>{
                    console.log(lineList.length,'total')
                  
                    res.send(JSON.stringify({code:200,message:"查询成功",lineList:lineList}));      
           }).catch(err=>{
            res.send(JSON.stringify({code:500,message:"查询失败"+err}));  
           }); 
    }
 
})

//删除站点信息  line/deleteLine
router.post('/deleteLine',function(req,res,next){
    var id=req.body._id;
    console.log(id,'id')
         //根据id先查数据是否存在
         var collectionName='t_lines';
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
router.post('/editLine',function(req,res,next){
    var result=req.body;
    console.log(result)
    var collectionName='t_lines';
    let json1={_id:ObjectID(result.lineid)}//查找条件
    console.log(json1,'更新数据 json')

    let json2={line_name:result.line_name,
        start_station:result.start_station,
        mid_station:result.mid_station,
        end_station:result.end_station,
        start_time:result.start_time,
        end_time:result.end_time,
        interval:result.interval,
        distance:result.distance,
        price:result.price,
        direction:result.direction,
        station_num:result.station_num,
        updateTime:date_02(new Date())}//跟新条件
      DB.update(collectionName,json1,json2).then(data=>{
        console.log(data,'data');
        if(data.matchedCount>0){
            res.send(JSON.stringify({code:200,message:'修改成功',type:'success'}));
        }else{
            res.send(JSON.stringify({code:500,message:'修改失败',type:'error'}));
        }
    });
})

//findByLineName
//根据线路名称查询 模糊查询 
router.post('/findByLineName',function(req,res,next){
    var data={
        line_name:req.body.line_name,
    }
    if(data.line_name==''){
           console.log('站点不能为空');
           return;
    }else{
        //模糊查询传递条件
        var json={line_name:{$regex:data.line_name}}
        //调用接口
        DB.findByLike('t_lines',json).then(resultList=>{
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

/**线路查询 精确查询 关键字如：402路*/ 
router.post('/findByLine',function(req,res,next){
    var data={
        line_name:req.body.line_name,
    }
    if(data.line_name==''){
           console.log('站点不能为空');
           return;
    }else{
        // db.t_lines.find({line_name:'402路'}条件,{station_name:1}) 查询列;
        var json={line_name:data.line_name}
        //调用接口
        DB.findByLineName('t_lines',json).then(stationList=>{
        console.log('stationList',stationList)
        var total=stationList.length
        
        console.log(total,'total') 
        res.send(JSON.stringify({code:200,message:"查询成功",
        stationList:stationList,total:total,type:'success'}));   

        }).catch(err=>{
            res.send(JSON.stringify({code:400,message:"查询失败"+err,type:'error'}));  
        })
    }
})
/**findByBusLine */
router.post('/findByBusLine',function(req,res,next){

    // if(data.line_name==''){
    //        console.log('站点不能为空');
    //        return;
    // }else{
        //调用接口
        var collectionName='bus_line_stations'
        DB.findByBusLine(collectionName).then(stationList=>{
         console.log('关联查询')
        console.log('stationList',stationList)
        var total=stationList.length
        
        console.log(total,'total') 
        res.send(JSON.stringify({code:200,message:"查询成功",
        stationList:stationList,total:total,type:'success'}));   

        }).catch(err=>{
            res.send(JSON.stringify({code:400,message:"查询失败"+err,type:'error'}));  
        })
    })

/**关联查询 */
router.post('/findByIn',function(req,res,next){
    var data={
        station_name:req.body.station,
    }
    if(data.station_name==''){
           console.log('站点不能为空');
           return;
    }else{
        var json={station_name:data.station_name}
        //调用接口
        var item=[]
        DB.find('bus_line_stations',json).then(resultList=>{
        console.log('find',resultList)
        for(i in resultList){
            resultList[i].line_name;
            item.push(resultList[i].line_name)
        }
        console.log(item,'item router api')
        var obj=[]
        var tname='t_lines';
        DB.findByIn(tname,item).then(stationList=>{
            console.log('in' ,stationList)
        obj.push(data.station_name) 
        obj.push(stationList)         
        console.log(obj,'obj')
        res.send(JSON.stringify({code:200,message:"查询成功",stationList:obj,type:'success'}));  
        }).catch(err=>{
            res.send(JSON.stringify({code:400,message:"查询失败"+err,type:'error'}));       
        })     
        }).catch(err=>{
            res.send(JSON.stringify({code:400,message:"查询失败"+err,type:'error'}));  
        })
    }
})     
module.exports = router;