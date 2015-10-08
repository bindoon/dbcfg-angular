var co = require('co');
var dbHelper = require('../models/dbHelper');
var mongoose = require('mongoose');
var jsonprc = require('../biz/jsonprc')
var BSON = require('bson').BSONPure;

//配置后台字段映射
mongoose.model('dbcfg', new mongoose.Schema({
    table: String,
    column:String,
    mapname: String,
    ctype: {
        type:Number,
        default :1
    },
    config: {
        value:[{
            v:String,
            n:String
        }]
    },
    createTime:Date,
    modifyTime:Date
}));

function getKey(kv) {
    var keyMap = {};
    for(var name in kv) {
        keyMap[name]=kv[name];
    }
    return keyMap;
}

function getColumnKV(kv,columnMapArr) {
    for(var i=0; i< columnMapArr.length; i++) {
        var column = columnMapArr[i].column;
        if(column in kv) {
            kv[column].mapname = columnMapArr[i].mapname;
            kv[column].ctype = columnMapArr[i].ctype;
            kv[column].config = columnMapArr[i].config;
        }
    }
    var key = [];
    for(var name in kv) {
        if (name == '__v' || name == '_id') {
            continue;
        };

        var configValue = [];
        if (kv[name].config&&kv[name].config.value) {
            configValue = kv[name].config.value;
        };

        // var configobj = kv[name].config;
        // if (kv[name].ctype==2&&configobj.value&&configobj.value.length) {
        //     for (var i = 0; i < configobj.value.length; i++) {
        //         var vn = configobj.value[i].split('|');
        //         if (vn.length===2) {
        //             configValue.push({
        //                 v:vn[0],
        //                 n:vn[1]
        //             })
        //         };
        //     };
        // };

        key.push({
            name: name,
            type:kv[name].instance,
            mapname: kv[name].mapname||name,
            ctype:kv[name].ctype,
            config: kv[name].config? JSON.stringify(kv[name].config):'',
            configValue: configValue
        });
    }
    return key;
}

var tableMap = getKey(mongoose.modelSchemas);

function* queryData(usermodel,condition, options) {
    return  yield dbHelper.query(usermodel, condition, options);
}

function* insertData(usermodel,list) {
    for (var i = 0; i < list.length; i++) {
        yield dbHelper.insert(usermodel, list[i]);
    };
    return  0;
}

function* updateData(usermodel,list) {
    for (var i = 0; i < list.length; i++) {
        var obj_id = BSON.ObjectID.createFromHexString(list[i]._id);
        yield dbHelper.findOneAndUpdate(usermodel,{_id:obj_id}, list[i], {});
    };
    return  0;
}

function* removeData(usermodel,list) {
    for (var i = 0; i < list.length; i++) {
        var obj_id = BSON.ObjectID.createFromHexString(list[i]._id);
        yield dbHelper.remove(usermodel,{_id:obj_id});
    };
    return  0;
}

function* getColumnMap(usermodel, tablename) {
    return yield dbHelper.query(usermodel,{table:tablename});
}

function* updateColumnMap(tablename, columnlist) {
    var usermodel = mongoose.model('dbcfg');
    for(var i =0; i < columnlist.length; i++) {
        columnlist[i].config = columnlist[i].config? JSON.parse(columnlist[i].config):{};
        yield dbHelper.findOneAndUpdate(usermodel,{table:tablename,column:columnlist[i].column}, columnlist[i], {upsert:true});
    }
}

exports.dbcfg = function(req, res, next) {
    var param = req.getParamObject();

    if (!param.table||!param.op) {
        res.send(jsonprc.error(-10,'param error'));
        return;
    };

    if (!(param.table in tableMap)) {
        res.send(jsonprc.error(-101,'table not found'));
        return;
    };

    var usermodel = mongoose.model(param.table);

    var respone = {};

    co(function* (){
        switch(param.op) {
            case 'query':
            {
                var condition = param.condition? JSON.parse(param.condition):{};
                var pagination = param.pagination? JSON.parse(param.pagination):{};
                var columnMapArr = yield getColumnMap(mongoose.model('dbcfg'),param.table);
                var columns = getColumnKV(usermodel.schema.paths,columnMapArr);

                respone.result = {
                    columns: columns,
                    condition: condition,
                    pagination: pagination
                }

                var tdata =  yield queryData(usermodel,condition);
                pagination.totalItems = tdata.length;
                pagination.totalPage = parseInt((tdata.length+20)/20);
                pagination.itemsPerPage = 20;


                //var data = yield queryData(usermodel,condition,{skip:(pagination.currentPage-1)*20,limit:20});
                var data = tdata.slice((pagination.currentPage-1)*20,(pagination.currentPage-1)*20+20);

                if (data.length >= 0) {
                    respone.result.list = data;
                    return respone;
                } else {
                    return jsonprc.error(-102,'query error');
                }
                break;
            }
            case 'insert':
            {
                var list = param.list? JSON.parse(param.list):[];
                yield insertData(usermodel,list);
                respone.result = {
                    code: 0,
                    msg: '添加成功'
                }
                return respone;
                break;
            }
            case 'update':
            {
                var list = param.list? JSON.parse(param.list):[];
                yield updateData(usermodel,list);
                respone.result = {
                    code: 0,
                    msg: '更新成功'
                }
                return respone;
                break;
            }
            case 'delete':
            {
                var list = param.list? JSON.parse(param.list):[];
                yield removeData(usermodel,list);
                respone.result = {
                    code: 0,
                    msg: '删除成功'
                }
                return respone;
                break;
            }
            case 'dbcfg':
            {
                var list = param.list? JSON.parse(param.list):[];
                yield updateColumnMap(param.table,list);
                respone.result = {
                    code: 0,
                    msg: '配置成功'
                }
                return respone;
                break;
            }
        }
    }).then(function(ret){

        if (param.callback) {
            res.send(param.callback+'('+JSON.stringify(ret)+')');
            return;
        };
        res.send(ret);
    })
}
