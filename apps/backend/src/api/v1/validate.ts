
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import type { ZodType } from "zod";

// middleware for validating requests.
export const validateRequest = (
  schema: ZodType,
  source: "body" | "query" | "params" = "body"
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {

    const result = schema.safeParse(req[source]);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed.",
        errors: result.error.issues.map(
          (issue) => issue.message
        ),
      });

      return;
    }

    // Storing the validated and transformed data.
    res.locals.validatedData = result.data;

    next();
  };
};
