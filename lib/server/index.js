"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const middlewares = require("./middlewares");
exports.middlewares = middlewares;
let router = new router_1.Router();
exports.router = router;
