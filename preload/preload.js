/**
 * @fileOverview load file from server.
 */


var schema = {
    stores: [{
        name: 'car',
        keyPath: 'id',
        indexes: [{
            name: 'name',
            keyPath: 'name'
        }]
    }]
};
var db = new ydn.db.Storage('preload', schema);


var el_msg = document.getElementById('message');

var showData = function() {
    db.values('car').done(function(arr) {
        var ul = document.getElementById('list');
        for (var i = 0; i < arr.length; i++) {
            var li = document.createElement('li');
            var car = arr[i];
            li.textContent = car.make_display + ' ' + car.name + ' ' + car.trim + ' (' + car.year + ')';
            ul.appendChild(li);
        }
        el_msg.textContent = arr.length + ' recorded show';
    })
};


var getData = function(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'car.json', true);
    xhr.onload = function() {
        cb(JSON.parse(xhr.responseText));
    };
    xhr.send();
};


db.count('car').done(function(cnt) {
    el_msg.textContent = cnt + ' records in database.';
    if (!cnt) {
        el_msg.textContent += ' loading...';
        getData(function(data) {
            db.put('car', data);
            showData();
        })
    } else {
        showData();
    }
});

