import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const rootDir = process.cwd();
if (fs.existsSync(path.resolve(rootDir, '.env'))) {
  dotenv.config({ path: path.resolve(rootDir, '.env') });
} else if (fs.existsSync(path.resolve(rootDir, '.env.local'))) {
  dotenv.config({ path: path.resolve(rootDir, '.env.local') });
} else if (fs.existsSync(path.resolve(rootDir, '.env.production'))) {
  dotenv.config({ path: path.resolve(rootDir, '.env.production') });
} else {
  dotenv.config();
}

export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: 'prisma/migrations',
  },
};
