/**
 * 工作展示表的创建
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var workSchema=new Schema({
    id:{
        type:Number,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    content:{
        type:String,
        require:true
    },
    image:{
        type:String,
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
var workModel=mongoose.model('t_work',workSchema);
module.exports=workModel;