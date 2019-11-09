import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, `../.env.${process.env.NODE_ENV}`) });

export const isProd = process.env.NODE_ENV === 'production';

export const isDev = process.env.NODE_ENV === 'development';

export const config = {
  // mysql
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  MYSQL_USERNAME: process.env.MYSQL_USERNAME,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
};
