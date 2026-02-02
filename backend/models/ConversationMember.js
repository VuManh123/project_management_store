'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConversationMember extends Model {
    static associate(models) {
      // Member belongs to conversation
      ConversationMember.belongsTo(models.Conversation, {
        foreignKey: 'conversation_id',
        as: 'conversation',
      });

      // Member belongs to user
      ConversationMember.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  ConversationMember.init(
    {
      conversation_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'conversations',
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ConversationMember',
      tableName: 'conversation_members',
      timestamps: false,
    }
  );

  return ConversationMember;
};

