/**
 * 公交站点表的建立 t_station
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var stationSchema=new Schema({
    id:{
        type:Number,
        require:true
    },
    stationName:{
        type:String,
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
var stationModel=mongoose.model('t_station',stationSchema);

module.exports=stationModel;