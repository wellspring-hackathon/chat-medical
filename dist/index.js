"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const socket_io_1 = require("socket.io");
const agent_1 = require("./services/agent");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
app.use((0, cors_1.default)({
    origin: "http://localhost:3000"
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught Expectation`);
    process.exit(1);
});
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('message', async (message) => {
        const res = await (0, agent_1.getResponse)(message.message);
        io.emit('message', {
            consultationId: "1",
            senderId: "vivy",
            milliseconds: new Date().getTime(),
            message: res
        });
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.get("/", (_req, res) => {
    res.send("Hello, world!");
});
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).send(`Internal Server Error\n${err.stack}`);
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
