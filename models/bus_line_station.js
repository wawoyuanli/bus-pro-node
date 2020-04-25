/**
 * 公交线路站点表的创建
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var busLineStationSchema=new Schema({
    id:{
        type:Number,
        require:true
    },
    lineid:{
        type:Number,
        require:true
    },
    lineName:{
        type:String,
        require:true
    },
    stationid:{
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
var busLineStationModel=mongoose.model('bus_line_station',busLineStationSchema);

module.exports=busLineStationModel;