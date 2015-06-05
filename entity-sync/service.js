/**
 * @fileOverview entity service that implement {@link ydn.db.sync.IService}
 * See interface specification:
 * @link https://github.com/yathit/ydn-db/blob/master/src/ydn/db/sync/service.js
 */



/**
 * Entity service implementation.
 * @param {string} name entity name.
 * @param {ydn.db.Storage} db storage.
 * @constructor
 * @implements {ydn.db.sync.IService}
 */
var RestService = function(name, db) {
  this.name = name;
  this.db = db.branch('single', false);
};


/**
 * @override
 */
RestService.prototype.get = function(cb, name, id, token) {
  // for REAL REST backend, use `token` for conditional request
  Rest.get(function(obj) {
    if (obj) {
      if (obj.updatedAt == token) {
        cb(304);
      } else {
        cb(200, obj, obj.updatedAt);
      }
    } else {
      cb(404);
    }
  }, id);
};


/**
 * @override
 */
RestService.prototype.add = function(cb, name, data) {
  Rest.insert(function(obj) {
    for (var n in data) {obj[n] = data[n]};
    obj.updatedAt = obj.createdAt;
    cb(201, obj, obj.objectId, obj.updatedAt);
  }, data);
};


/**
 * @override
 */
RestService.prototype.put = function(cb, name, data, id, token) {
  Rest.update(function(obj) {
    for (var n in data) {obj[n] = data[n]};
    cb(200, obj, obj.objectId, obj.updatedAt);
  }, data);
};


/**
 * @override
 */
RestService.prototype.remove = function(cb, name, id, token) {
  Rest.delete(function(obj) {
    cb(200);
  }, id);
};


RestService.prototype.list_ = function(cb, name, token) {
  Rest.list(function(arr) {
    var ids = arr.map(function(obj) {
      return obj.objectId;
    });
    var tokens = arr.map(function(obj) {
      return obj.updatedAt;
    });
    cb(200, arr, ids, tokens);
  }, token);
};


/**
 * @override
 */
RestService.prototype.list = function(cb, name, token) {
  if (token) {
    RestService.prototype.list_(cb, name, token);
  } else {
    this.db.values(this.name, 'updatedAt', null, 1, 0, true).always(function(obj) {
      var token = obj[0] ? obj[0].updatedAt : null;
      RestService.prototype.list_(cb, name, token);
    });
  }
};
