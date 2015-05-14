/**
 * @fileOverview demonstrate entity sync.
 */

var schema = {
  stores: [{
    name: 'item',
    autoIncrement: true,
    indexes: [{
      name: 'updatedAt',
      keyPath: 'updatedAt'
    }]
  }, {name: '_ydn_sync_history',
    keyPath: 'sequence',
    autoIncrement: true,
    indexes: [
      {
        name: 'key',
        keyPath: ['entity', 'id']
      }
    ]
  }]
};
var db = new ydn.db.Storage('entity-sync-app', schema);

var service = new RestService('item', db);
var Item = db.entity(service, 'item');

var message = function(msg) {
  var el = document.getElementById('message');
  el.textContent = msg;
};


var showRecent = function() {
  db.values('item', 'updatedAt', null, 10, 0, true).done(function(arr) {
    console.log(arr);
    var ul = document.getElementById('list');
    ul.innerHTML = '';
    for (var i = 0; i < arr.length; i++) {
      var d = new Date(arr[i].updatedAt);
      var li = document.createElement('li');
      if (d.getTime()) {
        li.textContent =  d.toLocaleString() + ' ';
      }
      li.setAttribute('data-id', arr[i].objectId);
      var a = document.createElement('a');
      a.textContent = arr[i].title;
      a.href = '#detail';
      var del = document.createElement('a');
      del.textContent = 'delete';
      del.href = '#delete';
      li.appendChild(a);
      li.appendChild(document.createTextNode(' '));
      li.appendChild(del);
      ul.appendChild(li);
    }
  });
};


/**
 * Update records from server.
 */
var updateRecord = function() {
  message('updating...');
  Item.update().then(function(cnt) {
    message(cnt + ' records updated from server.');
    if (cnt) {
      showRecent();
    }
  }, function(e) {
    console.error(e);
  });
  showRecent();
};


var form = document.forms[0];
form.onsubmit = function(e) {
  e.preventDefault();
  var data = {
    title: form['title'].value,
    content: form['content'].value,
    user: document.getElementById('name').value
  };
  var objectId = form['objectId'].value;
  var df;
  if (objectId) {
    df = Item.put(objectId, data);
  } else {
    df = Item.add(data);
  }
  df.then(function() {
    showRecent();
    form.reset.click();
  }, function(e) {
    console.error(e);
  });
};


var renderRecord = function(obj) {
  form['title'].value = obj.title;
  form['content'].value = obj.content;
  form['objectId'].value = obj.objectId;
  var d = new Date(obj.updatedAt);
  message('updated by ' + obj.user + ' on ' + d.toLocaleString());
};


var showRecord = function(id) {
  var df = Item.get(id);
  df.progress(function(obj) {
    renderRecord(obj);
  });
  df.then(function(obj) {
    renderRecord(obj);
  }, function(e) {
    console.error(e);
  });
};

document.getElementById('list').onclick = function(e) {
  if (e.target.tagName == 'A') {
    e.preventDefault();
    var href = e.target.getAttribute('href');
    var id = e.target.parentElement.getAttribute('data-id');
    if (href == '#detail') {
      showRecord(id);
    } else if (href == '#delete') {
      Item.remove(id).done(function() {
        showRecent();
      });
    }
  }
};

updateRecord();

