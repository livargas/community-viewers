import * as Joi from "joi";

export const JoiValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().required()
    .valid("development", "production", "test")
    .default("development"),
  MYSQL_DATABASE: Joi.string().required(),
  MYSQL_USERNAME: Joi.string().required(),
  MYSQL_ROOT_PASSWORD: Joi.string().required(),
  MYSQL_HOST: Joi.string().required(),
  MYSQL_PORT: Joi.string().required(),
  PASSPORT_PRIVATE_KEY: Joi.string().required(),
  PASSPORT_PUBLIC_KEY: Joi.string().required(),
});
