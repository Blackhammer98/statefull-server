"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pubSubManager_1 = require("./pubSubManager");
setInterval(() => {
    pubSubManager_1.PubSubManager.getInstance().addUserToStock(Math.random().toString(), "APPL");
}, 5000);
