import { Optional, Model, Sequelize, DataTypes } from 'sequelize';

export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  name?: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

export default class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  id!: number;
  username!: string;
  password!: string;
  name?: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
