import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  saltRounds: process.env.BCRYPT_SALT_ROUNDS,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
};