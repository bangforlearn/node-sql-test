import express from 'express';
import cors from 'cors';
import { ReqBodyUserSignin } from './app.types';
import initTableUser from './db/user/init-table';
import User from './db/user';
import { GetEnvConfig, JwtToken, PasswordHash } from './utils';

function StartAppServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.post('/signin', async (req, res) => {
    try {
      const inputData = req.body as ReqBodyUserSignin;
      const user = await User.findOne({
        where: {
          username: inputData.username,
        },
      });
      if (!user) {
        res.json({
          status: 'error',
          data: '',
          error: `找不到帳號：${inputData.username}`,
        });
        return;
      }
      const matchPassword = PasswordHash.compare(
        inputData.password,
        user.password
      );
      if (!matchPassword) {
        res.json({
          status: 'error',
          data: '',
          error: `密碼輸入有誤！`,
        });
        return;
      }

      res.json({
        status: 'success',
        data: {
          token: JwtToken.get(user.username),
        },
        error: undefined,
      });
    } catch (e) {
      console.log(e);
    }
  });

  app.get('/user', async (req, res) => {
    try {
      const token = req.headers['authorization'];
      if (!token) throw Error(`驗證失敗，尚未登入！`);
      const jwtResult = JwtToken.verify(token);

      if (jwtResult.id) {
        const user = await User.findOne({
          where: {
            username: jwtResult.id,
          },
        });
        if (!user) throw Error(`找不到帳號：${jwtResult.id}`);

        const data = {
          username: user.username,
          name: user.name,
        };

        res.json({
          status: 'success',
          data,
          error: undefined,
        });
      } else {
        throw Error(`驗證失敗，尚未登入！`);
      }
    } catch (error) {
      res.json({
        status: 'error',
        data: '',
        error: error,
      });
    }
  });

  const port = GetEnvConfig().PORT;
  app.listen(port, () => {
    console.log(`Example app on url: http://localhost:${port}`);
  });
}

(async () => {
  await initTableUser();
  StartAppServer();
})();
