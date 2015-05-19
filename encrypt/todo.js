
var options = {
  Encryption: {
    encryptKey: false,   // optional encrypt primary key
    secrets: [{
      name: 'aaaa',
      key: 'aYHF6vfuGHpfWS*eRLrPQxZjSó~É5c6HjCscqDqRtZasp¡JWSMGaW'
    }]
  }
};

var schema = {
  stores:[{
    name:'todo',
    encrypted: true
  }]
};


/**
 * Create and initialize the database. Depending on platform, this will
 * create IndexedDB or WebSql or even localStorage storage mechanism.
 * @type {ydn.db.Storage}
 */
var db = new ydn.db.Storage('encrypted-db', schema, options);

var deleteTodo = function (id) {
  db.remove('todo', id).fail(function(e) {
    throw e;
  });

  getAllTodoItems();
};

var getAllTodoItems = function () {
  var todos = document.getElementById("todoItems");
  todos.innerHTML = "";

  var df = db.keys('todo');

  df.done(function (keys) {
    console.log(keys);
    var n = keys.length;
    for (var i = 0; i < n; i++) {
      db.get('todo', keys[i]).done(function(item) {
        renderTodo(item);
      });
    }
  });

  df.fail(function (e) {
    throw e;
  })
};

var renderTodo = function (row) {
  console.log(row);
  var todos = document.getElementById("todoItems");
  var li = document.createElement("tr");
  var a = document.createElement("a");
  var c0 = document.createElement('td');
  var c1 = document.createElement('td');
  var c2 = document.createElement('td');
  c0.appendChild(a);
  c1.textContent = row.key;
  c2.textContent = row.value;

  a.addEventListener("click", function () {
    deleteTodo(row.key);
  }, false);

  a.textContent = " [Delete]";

  var tr = document.createElement('tr');
  tr.appendChild(c0);
  tr.appendChild(c1);
  tr.appendChild(c2);
  todos.appendChild(tr);
};

var addTodo = function () {
  var form = document.forms[0];

  var data = {
    "key":form.key.value,
    "value":form.value.value,
    "timeStamp":new Date().getTime()
  };
  db.put('todo', data, data.key).fail(function(e) {
    throw e;
  });

  form.reset();

  getAllTodoItems();
  return false;
};

function init() {
  getAllTodoItems();
}

db.onReady(function() {
  init();
});


