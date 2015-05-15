/**
 * @fileOverview REST api service provider for Parse
 *
 *
 * Note: Parse API does not support REST API features like conditional request
 * with Etag or Modified-Date. It does not have listing keys. But it has
 * more powerful query API, which is used here.
 * @link http://parse.com
 */

var Rest = {};


/**
 * Parse App ID.
 * Please get your app id and key in https://www.parse.com
 * It is free.
 * @type {string}
 */
Rest.APP_ID = 'x2yPHidLnLDjeMz9cZNifHlsaz9csJbWLZvX3Ncj';


/**
 * @type {string}
 */
Rest.APP_REST_KEY = 'e0HxDCcoLWeBD79eJabihNMCtSVA7JZFxRfHeyiv';


/**
 * Send HTTP request to backend server.
 * @param {Function} cb result callback in JSON.
 * @param {string} method 'GET', 'POST'.
 * @param {string} [key] optional record key
 * @param {Object} [param] query parameter
 * @param {Object} [object] payload
 */
Rest.request = function(cb, method, key, param, object) {
  var xhr = new XMLHttpRequest();
  var base = 'https://api.parse.com/1/classes/Item';
  if (key) {
    base += '/' + key;
  }
  if (param) {
    base += '?';
    for (var name in param) {
      base += name + '=' + encodeURIComponent(param[name]) + '&';
    }
    base = base.substr(0, base.length - 1);
  }
  xhr.open(method, base, true);
  xhr.setRequestHeader('X-Parse-Application-Id', Rest.APP_ID);
  xhr.setRequestHeader('X-Parse-REST-API-Key', Rest.APP_REST_KEY);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    cb(JSON.parse(xhr.responseText));
  };
  var data = object ? JSON.stringify(object) : null;
  xhr.send(data);
};


/**
 * List records, optionally after some updated time.
 * @param {Function} cb
 * @param {string} after last updated after
 */
Rest.list = function(cb, after) {
  var param = {
    'order': 'updatedAt'
  };
  if (after) {
    param['where'] = JSON.stringify({
      updatedAt: {$gt: after}
    });
  }
  Rest.request(function(resp) {
    cb(resp.results);
  }, 'GET', null, param);
};


/**
 * Get object.
 * @param {Function} cb
 * @param {string} key
 */
Rest.get = function(cb, key) {
  Rest.request(cb, 'GET', key);
};


/**
 * Delete object.
 * @param {Function} cb
 * @param {string} key
 */
Rest.delete = function(cb, key) {
  Rest.request(cb, 'DELETE', key, {});
};


/**
 * Create object.
 * @param {Function} cb
 * @param {Object} obj
 */
Rest.insert = function(cb, obj) {
  Rest.request(cb, 'POST', null, {}, obj);
};


/**
 * Create object.
 * @param {Function} cb
 * @param {Object} obj
 */
Rest.update = function(cb, obj) {
  Rest.request(cb, 'PUT', obj.objectId, {}, obj);
};
