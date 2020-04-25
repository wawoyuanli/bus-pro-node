/**
 * 定义t_user模型
 * 用户表的创建
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

//创建user集合的Schema对象（相当于建立表的字段模型）
var userSchema=new Schema({
    // id:{
    //     type:String,
    //     // require:true
    // },
    
    username:{
         type:String,
         require:true,
         default:'huyuan'
    },
    password:{
        type:String,
        require:true
    },
    createTime:{
        type:String,
        require:true

    }

});
//创建集合（collection）模型
var t_user=mongoose.model('t_user',userSchema);
//暴露模型
module.exports= t_user;
   



/**
 * //向数据库中插入一个文档
 * var user=new userModel({
    username:'刘洪唱',
    password:'123456',
    createTime:new Date()
})
user.save(function(err,result){
    if(err){
        console.log('保存失败')
    }else{
        console.log('保存成功')
    }
});
 */