import { Router } from "express";
import Joi from "joi";
import { validate } from "../middlewares/validation";

import {
  getAllSchedulling,
  updateSchedullingById,
  getSchedullingById,
  deleteSchedullingBy,
  createSchedulling,
} from "../database/models/scheduling";

import fetch from "node-fetch";
import * as datfn from "date-fns";

const calendar = Router();

let calendarSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  time: Joi.date().required().invalid(false),
  duration: Joi.date().required(),
  tags: Joi.array().items(Joi.string()).optional(),
});

let idSchema = Joi.object({
  id: Joi.string().required(),
});

calendar.get("/", async (req, res) => {
  const result = await getAllSchedulling(req.body);
  return res.json(result.result).status(result.code).end();
});

calendar.get("/:id", async (req, res) => {
  const result = await getSchedullingById(req.params.id);

  return res.json(result.result).status(result.code).end();
});

calendar.get("/holidays/:year", async (req, res) => {
  const response = await fetch(
    `https://date.nager.at/api/v3/publicholidays/${req.params.year}/BR`
  );
  const data: any = await response.json();

  const parsedData = data?.map((holiday) => {
    return {
      title: holiday.name,
      description: "",
      time: datfn.addHours(new Date(holiday.date), 3),
      duration: datfn.addHours(new Date(holiday.date), 3),
      isHoliday: true,
    };
  });

  return res
    .json(parsedData)
    .status(data ? 200 : 500)
    .end();
});

calendar.post(
  "/",
  async (req, res, next) => await validate(req, res, next, calendarSchema),
  async (req, res) => {
    const result = await createSchedulling(req.body);

    return res.json(result.result).status(result.code).end();
  }
);

const updateCalendarSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  time: Joi.date().optional(),
  duration: Joi.date().optional(),
  id: Joi.string().required(),
});

calendar.put(
  "/",
  async (req, res, next) =>
    await validate(req, res, next, updateCalendarSchema),
  async (req, res) => {
    const result = await updateSchedullingById(req.body.id, req.body);

    return res.json(result.result).status(result.code).end();
  }
);

calendar.delete(
  "/:id",
  async (req, res, next) => await validate(req, res, next, idSchema, true),
  async (req, res) => {
    const result = await deleteSchedullingBy(req.params.id);
    return res.json(result.result).status(result.code).end();
  }
);

export default calendar;
