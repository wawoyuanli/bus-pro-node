 /**
 * mongoose 连接数据库
 */
var mongoose=require('mongoose');

//参数1：url,
//参数2： { useNewUrlParser: true }
function connect(){
    mongoose.connect('mongodb://localhost:27017/bus', { useNewUrlParser: true })
    .then(()=>console.log('数据库连接成功'))
    .catch(err=>console.log(err,'数据库连接失败'))
}
module.exports={connect}
