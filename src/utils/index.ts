import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface IEnvConfig {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
}
export function GetEnvConfig() {
  const result: IEnvConfig = {
    DB_HOST: process.env.DB_HOST ?? 'localhost',
    DB_NAME: process.env.DB_NAME ?? 'default_database',
    DB_PASSWORD: process.env.DB_PASSWORD ?? 'root',
    DB_PORT: process.env.DB_PORT
      ? parseInt(process.env.DB_PORT)
      : undefined ?? 3306,
    DB_USER: process.env.DB_USER ?? 'root',
    JWT_SECRET: process.env.JWT_SECRET ?? '123456',
    PORT: process.env.PORT ? parseInt(process.env.PORT) : undefined ?? 3000,
  };
  return result;
}
export class PasswordHash {
  static saltRounds = 10;

  public static getHash(password: string) {
    const hash = bcrypt.hashSync(password, PasswordHash.saltRounds);
    return hash;
  }

  public static compare(password: string, hashedPassword: string) {
    const result = bcrypt.compareSync(password, hashedPassword);
    return result;
  }
}

export class JwtToken {
  public static refresh(token: string) {
    const id = JwtToken.verify(token).id;
    return JwtToken.get(id);
  }

  public static get(id: string) {
    const secret = GetEnvConfig().JWT_SECRET;
    const token = jwt.sign({ id: id }, secret, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    return token;
  }
  public static verify(token: string) {
    const secret = GetEnvConfig().JWT_SECRET;
    const result = jwt.verify(token, secret);

    return result as {
      id: string;
      iat: number;
      exp: number;
    };
  }
}
