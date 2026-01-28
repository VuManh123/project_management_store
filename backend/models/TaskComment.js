'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskComment extends Model {
    static associate(models) {
      // Comment belongs to task
      TaskComment.belongsTo(models.Task, {
        foreignKey: 'task_id',
        as: 'task',
      });

      // Comment belongs to user
      TaskComment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  TaskComment.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      task_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: 'tasks',
          key: 'id',
        },
      },
      user_id: {
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
    },
    {
      sequelize,
      modelName: 'TaskComment',
      tableName: 'task_comments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return TaskComment;
};

