import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

/*
CREATE TABLE chat_room (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL UNIQUE,
    professional_id INT NOT NULL,
    client_id INT NOT NULL,
    service_id INT NOT NULL,
    status ENUM('active', 'archived') DEFAULT 'active',
    last_message_preview VARCHAR(280),
    last_message_at DATETIME,
    last_sender_user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointment(id),
    FOREIGN KEY (professional_id) REFERENCES professional(id),
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (service_id) REFERENCES service(id),
    INDEX idx_chat_room_professional (professional_id, last_message_at),
    INDEX idx_chat_room_client (client_id, last_message_at)
)
*/

export interface IChatRoom {
  id?: number;
  appointment_id: number;
  professional_id: number;
  client_id: number;
  service_id: number;
  status?: "active" | "archived";
  last_message_preview?: string | null;
  last_message_at?: Date | null;
  last_sender_user_id?: number | null;
  createdAt?: Date;
}

type ChatRoomCreationalAttributes = Optional<
  IChatRoom,
  | "id"
  | "status"
  | "last_message_preview"
  | "last_message_at"
  | "last_sender_user_id"
>;

export class ChatRoomModel extends Model<
  IChatRoom,
  ChatRoomCreationalAttributes
> {
  public id!: number;
  public appointment_id!: number;
  public professional_id!: number;
  public client_id!: number;
  public service_id!: number;
  public status!: "active" | "archived";
  public last_message_preview?: string | null;
  public last_message_at?: Date | null;
  public last_sender_user_id?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatRoomModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "appointment",
        key: "id",
      },
    },
    professional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "professional",
        key: "id",
      },
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "client",
        key: "id",
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "service",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "archived"),
      defaultValue: "active",
    },
    last_message_preview: {
      type: DataTypes.STRING(280),
      allowNull: true,
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_sender_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "chat_room",
    underscored: true,
    indexes: [
      {
        name: "idx_chat_room_professional",
        fields: ["professional_id", "last_message_at"],
      },
      {
        name: "idx_chat_room_client",
        fields: ["client_id", "last_message_at"],
      },
    ],
    timestamps: true,
  }
);
