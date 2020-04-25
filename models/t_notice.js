/**
 * t_notice模型的建立
 * 通知表的创建
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//定义表的字段
var noticeSchema=new Schema({
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
//创建模型集合
//参数1：集合的名称，
//参数2：集合的Schema约束（表的字段）
var noticeModel=mongoose.model('t_notice',noticeSchema);

//暴露集合
 module.exports=noticeModel;
