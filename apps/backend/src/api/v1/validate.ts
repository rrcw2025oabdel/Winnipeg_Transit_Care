
import type {
  Request,
  Response,
  NextFunction,
} from "express";

type ValidationSchema = (body: unknown) => string[];


export const validateRequest = (
  schema: ValidationSchema
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const errors = schema(req.body);

    if (errors.length > 0) {
      res.status(400).json({
        message: "Validation failed.",
        errors,
      });

      return;
    }

    next();
  };
};
