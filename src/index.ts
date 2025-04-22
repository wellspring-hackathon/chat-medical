import express, {
  type Request,
  type Response,
  type NextFunction
} from "express";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

process.on("uncaughtException", (err) => {
  console.log(`Error: $err: ${err.message}`);
  console.log(`Shutting down the server due to uncaught Expectation`);
  process.exit(1);
});




app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, world!");
});


app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).send(`Internal Server Error\n${err.stack}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
