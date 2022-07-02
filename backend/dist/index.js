"use strict";

var _transctions = _interopRequireDefault(require("./routes/transctions"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = 4000;
var app = (0, _express["default"])(); // parse application/json

app.use(_bodyParser["default"].json()); //routers

app.use('/v1/transactions', _transctions["default"]);
console.log('===== ROUTERG HAS BEEN LOADED ====='); //port listen

app.listen(PORT);
console.log("===== RUNNING AT PORT ".concat(PORT, " ====="));