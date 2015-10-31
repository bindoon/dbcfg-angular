var co = require('co');
var dbHelper = require('../models/dbHelper');
var mongoose = require('mongoose');
var jsonprc = require('../biz/jsonprc')
var BSON = require('bson').BSONPure;

var util = require('util');



//配置后台字段映射
mongoose.model('menu', new mongoose.Schema({
    id: String,
    title: String,
    link: String,
    target: Number,
    parentid: String,
    order: Number,
    createTime: Date,
    modifyTime: Date
}));
var Menu = mongoose.model('menu');



function createTree(list) {
    var map = {};
    for (var i = 0; i < list.length; i++) {

        var item = util._extend({}, list[i]._doc); //不这么改，扩展不了。不知道是怎么做到的约束
        item.items = [];
        map[item.id] = item;
    };

    var result = [];

    for (var i in map) {
        if (map[i].parentid == 0) {
            result.push(map[i]);
        } else if (map[i].parentid in map) {
            map[map[i].parentid].items.push(map[i]);
        }
    }

    return result.sort(function(a, b) {
        return a.order > b.order;
    });
}

exports.menu = function(req, res, next) {
    co(function*() {
        var list = yield dbHelper.query(Menu, {});
        return createTree(list);
    }).then(function(data) {
        res.send({
            result: {
                list: data
            }
        })
    })
}

function* queryData(usermodel, condition, options) {
    return yield dbHelper.query(usermodel, condition, options);
}

function* insertData(usermodel, list) {
    for (var i = 0; i < list.length; i++) {
        yield dbHelper.insert(usermodel, list[i]);
    };
    return 0;
}

function* updateData(usermodel, list) {
    for (var i = 0; i < list.length; i++) {
        var obj_id = BSON.ObjectID.createFromHexString(list[i]._id);
        yield dbHelper.findOneAndUpdate(usermodel, {
            _id: obj_id
        }, list[i], {});
    };
    return 0;
}

function* removeData(usermodel, list) {
    for (var i = 0; i < list.length; i++) {
        var obj_id = BSON.ObjectID.createFromHexString(list[i]._id);
        yield dbHelper.remove(usermodel, {
            _id: obj_id
        });
    };
    return 0;
}


exports.menucfg = function(req, res, next) {
    var op = req.getParam('op');
    if (op == 'update') {
        var list = req.getParam('data');
        list = list ? JSON.parse(list) : [];

        co(function*() {

            for (var i = 0; i < list.length; i++) {
                if (list[i].action == 'create') {
                    yield dbHelper.insert(Menu, list[i]);

                } else if (list[i].action == 'update') {

                    var obj_id = BSON.ObjectID.createFromHexString(list[i]._id);
                    yield dbHelper.findOneAndUpdate(Menu, {
                        _id: obj_id
                    }, list[i], {});
                } else if (list[i].action == 'delete') {
                    var obj_id = BSON.ObjectID.createFromHexString(list[i]._id);
                    yield dbHelper.remove(Menu, {
                        _id: obj_id
                    });
                }
            };
        }).then(function() {
            res.send({
                code: 0,
                message: 'success'
            })
        })
    } else {
        co(function*() {
            var list = yield dbHelper.query(Menu, {});
            return createTree(list);
        }).then(function(data) {
            res.send({
                result: {
                    list: data
                }
            })
        })
    }
}
