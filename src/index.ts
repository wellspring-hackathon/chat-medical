import express, {
  type Request,
  type Response,
  type NextFunction
} from "express";
import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { getResponse } from "./services/agent";
import http from "http";
import cors from "cors"
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught Expectation`);
  process.exit(1);
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('message', async (message) => {
    const res = await getResponse(message.message);
    io.emit('message', {
        consultationId: "1",
        senderId: "someguy-999",
        message: `${res}`,
        milliseconds: new Date().getTime()
    });
  });


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, world!");
});


app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).send(`Internal Server Error\n${err.stack}`);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
