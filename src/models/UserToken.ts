import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface UserTokenAttributes {
  id: number;
  user_id: string;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserTokenCreationAttributes extends Optional<UserTokenAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class UserTokenModel extends Model<UserTokenAttributes, UserTokenCreationAttributes> implements UserTokenAttributes {
  public id!: number;
  public user_id!: string; 
  public token!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize): void {
    UserTokenModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        token: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        tableName: 'UserTokens',
        sequelize, 
        timestamps: true,
      }
    );
  }
}
