'use strict';
const { Model } = require('sequelize');
const ConversationType = require('../enums/ConversationType');

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      // Conversation members
      Conversation.hasMany(models.ConversationMember, {
        foreignKey: 'conversation_id',
        as: 'members',
      });

      // Conversation messages
      Conversation.hasMany(models.Message, {
        foreignKey: 'conversation_id',
        as: 'messages',
      });
    }
  }

  Conversation.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: ConversationType.PRIVATE,
      },
      last_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      last_message_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Conversation',
      tableName: 'conversations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Conversation;
};

