"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const middlewares = require("../middlewares");
const cors = require('cors')({ origin: true });
const cookieParser = require('cookie-parser')();
class Router {
    constructor() {
        this.__base = express.Router();
        this.base.use(cors);
        this.__public = express.Router();
        this.__auth = express.Router();
        this.auth.use(cookieParser);
        this.auth.use(middlewares.auth);
    }
    get base() {
        return this.__base;
    }
    get public() {
        return this.__public;
    }
    get auth() {
        return this.__auth;
    }
}
exports.Router = Router;
