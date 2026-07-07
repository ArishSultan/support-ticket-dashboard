import * as Joi from 'joi';

export const configSchema = Joi.object({
  APP_MODE: Joi.string().valid('DEV', 'PROD').default('DEV'),
  APP_URL: Joi.string().uri().required(),

  API_URL: Joi.string().uri().required(),
  API_HOST: Joi.string().hostname().default('0.0.0.0'),
  API_PORT: Joi.number().port().default(4000),

  DB_URL: Joi.string().required(),

  BETTER_AUTH_SECRET: Joi.string().min(32).required(),
  BETTER_AUTH_SESSION_EXPIRES_IN: Joi.number().default(604800),
  BETTER_AUTH_SESSION_UPDATE_AGE: Joi.number().default(86400),
  BETTER_AUTH_SESSION_COOKIE_MAX_AGE: Joi.number().default(300),
});
