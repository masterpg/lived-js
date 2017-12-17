/// <reference types="express" />
import * as express from 'express';
export declare class Router {
    constructor();
    __base: express.Router;
    readonly base: express.Router;
    __public: express.Router;
    readonly public: express.Router;
    __auth: express.Router;
    readonly auth: express.Router;
}
