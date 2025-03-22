"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubManager = void 0;
const redis_1 = require("redis");
class PubSubManager {
    constructor() {
        this.redisClient = (0, redis_1.createClient)();
        this.redisClient.connect();
        this.subscriptions = new Map();
    }
    static getInstance() {
        if (!PubSubManager.instance) {
            PubSubManager.instance = new PubSubManager();
        }
        return PubSubManager.instance;
    }
    addUserToStock(userId, stockTicker) {
        var _a, _b;
        if (!this.subscriptions.has(stockTicker)) {
            this.subscriptions.set(stockTicker, []);
        }
        (_a = this.subscriptions.get(stockTicker)) === null || _a === void 0 ? void 0 : _a.push(userId);
        if (((_b = this.subscriptions.get(stockTicker)) === null || _b === void 0 ? void 0 : _b.length) === 1) {
            this.redisClient.subscribe(stockTicker, (price) => {
                this.forwardMessageToUser(stockTicker, price);
            });
            console.log(`Subscribed to redis channel : ${stockTicker}`);
        }
    }
    removeUserFromStock(userId, stockTicker) {
        var _a, _b;
        this.subscriptions.set(stockTicker, ((_a = this.subscriptions.get(stockTicker)) === null || _a === void 0 ? void 0 : _a.filter((sub) => sub !== userId)) || []);
        if (((_b = this.subscriptions.get(stockTicker)) === null || _b === void 0 ? void 0 : _b.length) === 0) {
            this.redisClient.unsubscribe(stockTicker);
            console.log(`Unsubscribe to redis channel : ${stockTicker}`);
        }
    }
    forwardMessageToUser(stockTicker, price) {
        var _a;
        console.log(`Message received on channel ${stockTicker}:${price}`);
        (_a = this.subscriptions.get(stockTicker)) === null || _a === void 0 ? void 0 : _a.forEach((sub) => {
            console.log(`Sending message to user : ${sub}`);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redisClient.quit();
        });
    }
}
exports.PubSubManager = PubSubManager;
