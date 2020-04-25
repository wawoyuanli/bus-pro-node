/**
 * 留言表的创建
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var messageSchema=new Schema({
    id:{
        type:Number,
        require:true
    },
    userid:{
        type:Number,
        require:true
    },
    content:{
        type:String,
        require:true
    },
    createTime:{
        type:String,
        require:true
    }

});
var messageModel=mongoose.model('t_message',messageSchema);
module.exports=messageModel;
