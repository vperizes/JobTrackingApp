import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      //if isEmpty is false then we have an error and need to return msg
      if (!errors.isEmpty()) {
        const errMessages = errors.array().map((error) => error.msg); //getting msg property from error object
        throw new BadRequestError(errMessages);
      }
      next();
    },
  ];
};

//invoke withValidationErrors and get back 2 middlewares

export const validateJobInput = withValidationErrors([
  //checks that company and position properties in body are not empty. if it is it sends back the chained message
  body("company").notEmpty().withMessage("company name is required"),
  body("position").notEmpty().withMessage("position is required"),
  body("jobLocation").notEmpty().withMessage("job position is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid type value"),
]);