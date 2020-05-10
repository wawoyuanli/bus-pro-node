const MongoClient=require('mongodb').MongoClient;
const Config=require('./config.js');
class DB{
    static getInstance(){
        if(!DB.instance){
            DB.instance=new DB();
        }
        return DB.instance;
    }
    //构造函数
    constructor(){
        this.dbClient=null;
        this.connect();
    }
       //根据配置连接数据库
       connect() {
        const client = new MongoClient(Config.dbUrl,{ useNewUrlParser: true });
        return new Promise((resolve, reject) => {
            if (!this.dbClient) {
                // const client = new MongoClient(Config.dbUrl);
                client.connect(err => {
                    if (err) {
                        reject(err);
                    } else {
                        this.dbClient = client.db(Config.dbName)
                        resolve(this.dbClient);
                    }
                })
            } else {
                resolve(this.dbClient);
            }
        });
        }

         /**
     * 插入数据
     * @param {String} collectionName 表名
     * @param {*} json 插入数据
     */
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                console.log('插入数据请求接口')
                db.collection(collectionName).insertOne(json, (err, result) => {
                    console.log('执行插入接口')
                    if (err) {
                        console.log('错误输出')
                        reject(err);
                        return;
                    }
                    console.log('正确输出')
                    resolve(result);
                });
            }).catch(error => {
                reject(error)
            });
        });
    }

     /**
     * 查找
     * @param {String} collectionName 表名
     * @param {*} json 查找条件
     */ 
    findAll(collectionName,json,pageSize,pageIndex,sortName) {
        console.log(json,'findAll json',sortName)
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const collection = db.collection(collectionName);
                collection.find(json).skip((pageIndex-1)*pageSize).limit(pageSize).sort({'_id':-1,sortName:-1}).toArray((err, docs) => {
                    if (err) {
                        reject(err);
                        return
                    }
                 //   console.log('开始数据查询,所有');
                   resolve(docs);
                });
            }).catch(error => {
                reject(error)
            });
        });
    }
    //查询
    find(collectionName,json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const collection = db.collection(collectionName);
                collection.find(json).toArray((err, docs) => {
                    if (err) {
                        reject(err);
                        return
                    }
                //    console.log('开始数据查询，find');
                   resolve(docs);
                });
            }).catch(error => {
                reject(error)
            });
        });
    }
    /**
     * 
     * @param {findByIndex} collectionName 
     * @param {*} json 
     */
    findByIndex(collectionName,json,pageSize,pageIndex,sortName) {
        console.log('sortName',sortName+'')
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const collection = db.collection(collectionName);
                collection.find(json).skip((pageIndex-1)*pageSize).limit(pageSize).sort({'line_name':1,'index':1,}).toArray((err, docs) => {
                    if (err) {
                        reject(err);
                        return
                    }
                   resolve(docs);
                });
            }).catch(error => {
                reject(error)
            });
        });
    }
    /* 更新
    * @param {String} collectionName 表名
    * @param {*} json1 查找条件
    * @param {*} json2 更新的数据
    */
   update(collectionName, json1, json2) {
       return new Promise((resolve, reject) => {
           this.connect().then(db => {
               db.collection(collectionName).updateOne(json1, { $set: json2 }, (err, result) => {
                   if (err) {
                       reject(err);
                       return;
                   }
                   resolve(result);
               });
           }).catch(error => {
            reject(error)
        });
       });
   }    

    /**
     * 删除
     * @param {String} collectionName 表名
     * @param {*} json 查找条件
     */
    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).remove(json, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            }).catch(error => {
                reject(error)
            });
        });
    }    



findAllStation(collectionName,pageSize,pageIndex) {
    console.log(collectionName,'多表联查 t_stations join t_users')
    return new Promise((resolve, reject) => {
        this.connect().then(db => {
            const collection = db.collection(collectionName);
            collection.find([{$lookup:{from:'t_users',localField:'userid',foreignField:"ObjectID(_id)",as:'stationUser'}}])
            .skip((pageIndex-1)*pageSize).limit(pageSize)
            .sort({'_id':-1})
            .toArray((err, docs) => {
                if (err) {
                    reject(err);
                    return
                }
             //   console.log('开始数据查询,所有');
               resolve(docs);
            });
  
        }).catch(error => {
            reject(error)
        });
    });
}
   //模糊查询
   findByLike(collectionName,json) {
       console.log('模糊查询条件',json)
    return new Promise((resolve, reject) => {
        this.connect().then(db => {
             const collection = db.collection(collectionName);
            collection.find(json).toArray((err, docs) => {
                if (err) {
                    reject(err);
                    return
                }
             console.log('开始数据--模糊--findByLike');
               resolve(docs);
            });
        }).catch(error => {
            reject(error)
        });
     })
   }
   /**-------------------------------bus_line_stations||条件查询--------------------------------------------------- */
    //根据线路查询站点  *线路查询*
    findByLineName(collectionName,json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const collection = db.collection(collectionName);
                collection.find(json).toArray((err, docs) => {
                    if (err) {
                        reject(err);
                        return
                    }
                console.log('线路查询，find');
                   resolve(docs);
                });
            }).catch(error => {
                reject(error)
            });
        });
    }
 /**bus_line_stations 关联 t_lines查询数据 */

 findByBusLine(collectionName) {
    return new Promise((resolve, reject) => {
        this.connect().then(db => {
            const collection = db.collection(collectionName);
            collection.aggregate([
                {
                  $lookup:
                    {
                      from: "t_lines",
                      localField: "line_name",
                      foreignField: "line_name",
                      as: "bus_line"
                    }
               }
             ]).toArray((err,docs)=>{
                 if(err){
                     reject(err);
                     return
                 }
                 console.log('docs',docs)
                 resolve(docs)
             })
        });
    })
}
/** */
findByStationName(collectionName,json) {
    return new Promise((resolve, reject) => {
        this.connect().then(db => {
            const collection = db.collection(collectionName);
            collection.find({station_name:'皓月路市心路口'},{line_name:1}).toArray((err, docs) => {
                if (err) {
                    reject(err);
                    return
                }
            //    console.log('开始数据查询，find');
               resolve(docs);
            });
        }).catch(error => {
            reject(error)
        });
    });
 }
 /**in */
 findByIn(tname,item) {
    return new Promise((resolve, reject) => {
        console.log('db item',item)
        this.connect().then(db => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            const collection = db.collection(tname);
            //db.t_lines.find({line_name:{$in:["402路","403路"]}})
            collection.find({"line_name":{$in:item}}).toArray((err, docs) => {
                if (err) {
                    reject(err);
                    return
                }
            console.log('开始数据查询--in--');
               resolve(docs);
            });
        }).catch(error => {
            reject(error)
        });
    });
}
}

module.exports=DB.getInstance();