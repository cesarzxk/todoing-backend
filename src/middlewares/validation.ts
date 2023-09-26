import { type Request, type Response, type NextFunction } from "express";
import { type Schema } from "joi";

export async function validate(
  request: Request,
  response: Response,
  next: NextFunction,
  schema: Schema,
  isParams?: boolean
) {
  async function validateSchema(user: any) {
    schema.options({ abortEarly: false });
    return await schema.validateAsync(user);
  }
  try {
    if (isParams) {
      await validateSchema(request.params);
    } else {
      await validateSchema(request.body);
    }

    next();
  } catch (err: any) {
    return response.status(422).json(err).end();
  }
}
