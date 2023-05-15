import User from '.';
import { DataTypes } from 'sequelize';
import { sequelize } from '..';
import { PasswordHash } from '../../utils';

export default async function initTableUser() {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      indexes: [
        {
          name: 'index-username',
          using: 'BTREE',
          fields: ['username'],
        },
      ],
      sequelize,
    }
  );

  await sequelize.sync();
  const count = await User.count();
  if (count === 0) {
    await User.create({
      username: 'bang',
      password: PasswordHash.getHash('123456'),
      name: 'Bang Wang',
    });
    await User.create({
      username: 'bang2',
      password: PasswordHash.getHash('123456'),
      name: 'Bang Wang2',
    });
  }
}

/**  */
