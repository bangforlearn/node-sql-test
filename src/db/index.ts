import { Sequelize } from 'sequelize';
import { GetEnvConfig } from '../utils';

const env = GetEnvConfig();
const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mariadb',
  logging: false,
});

export { sequelize };
