var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.model('user', new Schema({
    nickName:String,
    passWord:String,
    email: String,
    pic: String,
    level: Number,
    createTime:Date,
    modifyTime:Date
}));

//首页数据配置接口
mongoose.model('indexdata', new Schema({
    type: Number,   /* 用来区分首页区块*/
    title: String,
    subtitle: String,
    desc: String,
    pic: String,
    link: String,
    createTime:Date,
    modifyTime:Date
}));

//类别
mongoose.model('category', new Schema({
    cateId: Number,
    name:String,    /* 茶道、花道、*/
    desc: String,
    pic: String,
    createTime:Date,
    modifyTime:Date
}));

//名家详细介绍
mongoose.model('expert', new Schema({
    expertId: Number,
    cateId: Number, /* 分类 关联 category的id*/
    name:String,
    desc: String,
    pic: String,
    createTime:Date,
    modifyTime:Date
}));

//名家相关文章视频
mongoose.model('article', new Schema({
    articleId: Number,
    expertId: Number, /* 关联 expert */
    title:String,
    content: String,
    pic: String,
    url: String,
    createTime:Date,
    modifyTime:Date
}));

//接口配置
mongoose.model('cgicfg', new Schema({
    maintype: Number,   /* 1: category 2:expert  */
    subtype: Number,   /* 1: banner 2:expert  */
    id: Number, /* 关联  */
    title:String,
    desc: String,
    pic: String,
    url: String,
    createTime:Date,
    modifyTime:Date
}));

