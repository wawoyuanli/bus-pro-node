/**
 * 公交线路t_line模型的建立
 * 
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var lineSchema=new Schema({
    id:{
        type:Number,
        require:true
    },
    //线路名称
    lineName:{
        type:String,
        require:true
    },
    //起点站
    startStation:{
        type:String,
        require:true
    },
    endStation:{
        type:String,
        require:true
    },
    startTime:{
        type:String,
        require:true
    },
    endTime:{
        type:String,
        require:true
    },
    //时间间隔
    timeInterval:{
        type:Number,
        require:true
    },
    //线路起点终点之间的距离
    distance:{
        type:Number,
        require:true
    },
    price:{
        type:Number,
        require:true
        
    },
    //方向（正向行驶，反向行驶）
    direction:{
        type:Number,
        require:true
    },
    userid:{
        type:Number,
        require:true
    },
    createTime:{
        type:String,
        require:true
    },
    updateTime:{
        type:String,
        require:true
    }
});
var lineModel=mongoose.model('t_line',lineSchema);
module.exports=lineSchema;
