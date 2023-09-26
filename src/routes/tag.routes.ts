import { Router } from "express";
import Joi from "joi";
import { validate } from "../middlewares/validation";

import {
  getTagsBySchedullingId,
  createTag,
  updateTagsById,
  deleteTagById,
} from "../database/models/tag";

const tag = Router();

let idSchema = Joi.object({
  id: Joi.string().required(),
});

let tagsSchema = Joi.object({
  title: Joi.string().required(),
  schedullingId: Joi.string().required(),
});

tag.get("/:id", async (req, res) => {
  const result = await getTagsBySchedullingId(req.params.id);
  return res.json(result.result).status(result.code).end();
});

tag.post(
  "/",
  async (req, res, next) => await validate(req, res, next, tagsSchema),
  async (req, res) => {
    const result = await createTag({
      title: req.body.title,
      schedullingId: req.body.schedullingId,
    });

    return res.json(result.result).status(result.code).end();
  }
);

const updateTagsSchema = Joi.object({
  tags: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      title: Joi.string().required(),
    }).required()
  ),
});

tag.put(
  "/",
  async (req, res, next) => await validate(req, res, next, updateTagsSchema),
  async (req, res) => {
    const result = await updateTagsById(req.body.tags);
    return res.json(result.result).status(result.code).end();
  }
);

tag.delete(
  "/",
  async (req, res, next) => await validate(req, res, next, idSchema),
  async (req, res) => {
    const result = await deleteTagById(req.body.id);
    return res.json(result.result).status(result.code).end();
  }
);

export default tag;
