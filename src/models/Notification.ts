import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    notification_type ENUM('appointment', 'service', 'system', 'general') DEFAULT 'system',
    related_entity_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
*/

export interface INotification {
  id?: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  notification_type?: 'appointment' | 'service' | 'system' | 'general';
  related_entity_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type NotificationCreationalAttributes = Optional<INotification, "id" | "is_read" | "notification_type" | "related_entity_id" | "createdAt" | "updatedAt">;

export class NotificationModel extends Model<INotification, NotificationCreationalAttributes> implements INotification {
  public id!: number;
  public user_id!: number;
  public title!: string;
  public message!: string;
  public is_read!: boolean;
  public notification_type!: 'appointment' | 'service' | 'system' | 'general';
  public related_entity_id?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

NotificationModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notification_type: {
      type: DataTypes.ENUM('appointment', 'service', 'system', 'general'),
      defaultValue: 'system',
      allowNull: true,
    },
    related_entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    modelName: "Notification",
    timestamps: true,
    underscored: true,
  }
);