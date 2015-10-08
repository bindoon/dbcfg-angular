var dbHelper = {
    query : function(model, conditon,options) {
        return new Promise(function(resolve, reject) {
            options = options||{};
            model.find(conditon, {}, options, function(error, data) {
                if (error)
                    reject(error);
                resolve(data);
            })
        })
    },
    querylimit : function(model, conditon) {
        return new Promise(function(resolve, reject) {
            model.find(conditon).skip(20).limit(20).toArray( function(error, data) {
                if (error)
                    reject(error);
                resolve(data);
            })
        })
    },
    insert : function(model, doc) {
        return new Promise(function(resolve, reject) {
            model.create(doc,function(error,data) {
                if (error)
                    reject(error);
                resolve(data);
            })
        })
    },
    update: function(model, conditions, update, options) {
        return new Promise(function(resolve, reject) {
            model.update(conditions,update,options,function(error) {
                if (error)
                    reject(error);
                resolve();
            })
        })
    },
    findOneAndUpdate: function(model, conditions, update, options) {
        return new Promise(function(resolve, reject) {
            model.findOneAndUpdate(conditions,update,options,function(error) {
                if (error)
                    reject(error);
                resolve();
            })
        })      
    },
    remove : function(model, conditions) {
        return new Promise(function(resolve, reject) {
            model.remove(conditions,function(error) {
                if (error)
                    reject(error);
                resolve();
            })
        })
    }
}

module.exports = dbHelper;