import "dotenv/config";
import express from "express";
import { routes } from "./routes/index";
import http from "http";

import bodyParcer from "body-parser";
import cors from "cors";
const queue = require("express-queue");

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(bodyParcer.json());

app.use(queue({ activeLimit: 2, queuedLimit: 2 }));
app.use(routes);

export const rooms = () => {};

server.listen(process.env.PORT || 3333, () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT || 3333} ! 😁`);
});
