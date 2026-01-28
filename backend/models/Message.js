'use strict';
const { Model } = require('sequelize');
const MessageType = require('../enums/MessageType');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // Message belongs to conversation
      Message.belongsTo(models.Conversation, {
        foreignKey: 'conversation_id',
        as: 'conversation',
      });

      // Message sender
      Message.belongsTo(models.User, {
        foreignKey: 'sender_id',
        as: 'sender',
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      conversation_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: 'conversations',
          key: 'id',
        },
      },
      sender_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: MessageType.TEXT,
      },
      is_read_by: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Message;
};

