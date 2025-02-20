"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const bodyParser = require('body-parser');
const app = (0, express_1.default)();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('HELOUU...');
});
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.WEBHOOK_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verificado');
        res.status(200).send(challenge);
    }
    else {
        res.sendStatus(403);
    }
});
app.listen(port, () => {
    console.log("activo");
});
