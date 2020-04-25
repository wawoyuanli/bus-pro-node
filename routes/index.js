var express = require('express');
var router = express.Router();
const DB=require('../models/crud/db');
var {date_01,date_02,getDate}=require('../utils/dateFormate');
var t_user=require('../models/t_user');
var md5=require('md5');

//引入封装好的函数
const email= require('../utils/sendEmailUtil');
const check = {} //声明一个对象缓存邮箱和验证码，留着

//生成验证码
var code=validataCode();



//接口: code/getSms
router.post('/getSms',function(req,res,next){
const mail=req.body.username
console.log(mail)
const data={
    rst:true,
    data:"",
    msg:""
}
if(!mail){
    return res.send(mail,'参数不正确')
}

check[mail] 

console.log("code2 :"+code)
//发送邮箱
email.sendMail(mail,code,(state)=>{
    if(state){
        return res.send("发送成功")
    }else{
        return res.send("发送失败")
    }
  })
});

//添加t_user
router.post('/add',function(req,res,next){
     
    let userInfo={
      username:req.body.username,
      password:req.body.password,
      code:req.body.code
    }
    console.log(userInfo.username)
    if(userInfo.code!=code){
      console.log('验证码不匹配')
      return;
    } 
    DB.find('t_users',{username:userInfo.username }).then(data=>{
      console.log(data,'查询返回数据')  
    //  if(data){
    //   res.send(JSON.stringify({code:400,message:'数据已存在',username:'',token:''}));
    //  }
      var collectionName='t_users';
      let json={username:userInfo.username,password:userInfo.password,createTime:date_02(new Date())}
      DB.insert(collectionName,json);
      res.send(JSON.stringify({code:200,message:'注册成功' }));
     
    }) 
})

/**
 * 接口：login
 */
  router.post('/login', function (req, res,next)  {
    let userInfo={
      username:req.body.username,
      password:req.body.password,
      code:req.body.code
    }
    console.log(userInfo,'userInfo')
    if(userInfo.code!=code){
      console.log('验证码不匹配')
      return;
    } 
    var collectionName='t_users';
    let json={username:userInfo.username,password:userInfo.password}
    
    //返回值result为数组 对象[{},{}]
    DB.find(collectionName,json).then(data=>{
      console.log(data,'then 异步接收查询数据') 
    if(data){
      res.cookie('username',data[0].username,{
        path:'/',
        expires:new Date(Date.now()+10000*60*60*24*7)
      });
      res.cookie('userid',data[0].userid,{
        path:'/',
        expires:new Date(Date.now()+10000*60*60*24*7)
      });
      res.send(JSON.stringify(
        {code:200,message:'login success',
        userid:data[0]._id,
        username:data[0].username,
        password:data[0].password,
        token:md5(data[0].username+data[0].password)
         }));
      console.log('login success')
    }else{
    res.send(JSON.stringify({code:400,msg:'login failed',username:'',token:''}));
    }
  }).catch((err)=>{
      Promise.reject(err)
  }); 
  });


//查找 ,异步执行
  router.post('/find', async (req, res,next) => {
    let userInfo={
      username:req.body.username,
      password:req.body.password
    }
    console.log('获取请求数据',userInfo)
  var collectionName='t_users';

  let json={username:userInfo.username,password:userInfo.password}
  //返回值result为数组 对象[{},{}]
 const user= await DB.find(collectionName,json);
 console.log(user[0],'数据查询显示')
 //res.send(JSON.stringify({code:400,msg:'login failed',username:'',token:'1583649818@qq.com'}));
 if(user){
  res.cookie('username',user[0].username,{
    path:'/',
    expires:new Date(Date.now()+10000*60*60*24*7)
  });
  res.send(JSON.stringify({code:200,message:'login success',username:user[0].username,token:'admin_token'}));
  console.log('login success')
}else{
 res.send(JSON.stringify({code:400,msg:'login failed',username:'',token:''}));
} 
});

module.exports=router

//查找 ,同步执行
router.post('/select',function(req,res,next){
  var result=req.body;
  var collectionName='t_users';
  let json={username:result.username,password:result.password}
  let data=DB.find(collectionName,json);
console.log(data)
  for(let i in data){
    console.log(i)
    console.log(data[i]);
 
  }
})

//生成字母+数字的 6位验证码
function validataCode() {
  var arr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
              "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
              0,1,2,3,4,5,6,7,8,9];
  var  rand1 = Math.floor((Math.random()*62));
  var  rand2 = Math.floor((Math.random()*62));
  var  rand3 = Math.floor((Math.random()*62));
  var  rand4 = Math.floor((Math.random()*62));
  var  rand5 = Math.floor((Math.random()*62));
  var  rand6 = Math.floor((Math.random()*62));
 var str=  arr[rand1]+ arr[rand2]+ arr[rand3]+ arr[rand4]+ arr[rand5]+ arr[rand6];
return str; 
}

const isEmptyObj = object => {
  if (!!Object.getOwnPropertySymbols(object).length) {
      return false
  }
  for (const key in object) {
      if (object.hasOwnProperty(key)) {
          return false
      }
  }
  return true
}
module.exports = router;
