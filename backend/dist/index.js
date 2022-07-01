"use strict";

var _todos = _interopRequireDefault(require("./routes/todos"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = 4000;
var app = (0, _express["default"])(); //routers

app.use('/v1/todos', _todos["default"]);
console.log('===== ROUTERG HAS BEEN LOADED ====='); //port listen

app.listen(PORT);
console.log("===== RUNNING AT PORT ".concat(PORT, " ====="));