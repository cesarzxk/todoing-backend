import { Router, type Request, type Response } from "express";

const root = Router();

root.get("/", (request: Request, response: Response) => {
  response.send("Olá bem vindo! para acessar utilize a aplicação!");
});

export default root;
