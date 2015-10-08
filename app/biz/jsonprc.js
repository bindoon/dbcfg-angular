exports.error = function (code,msg) {
    return {
        error:{
            code:code,
            msg:msg
        }
    }
}