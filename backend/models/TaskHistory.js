'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskHistory extends Model {
    static associate(models) {
      // History belongs to task
      TaskHistory.belongsTo(models.Task, {
        foreignKey: 'task_id',
        as: 'task',
      });

      // History changed by user
      TaskHistory.belongsTo(models.User, {
        foreignKey: 'changed_by',
        as: 'changedBy',
      });
    }
  }

  TaskHistory.init(
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
      batch_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        unique: true,
      },
      field: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      old_value: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      new_value: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      changed_by: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      changed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'TaskHistory',
      tableName: 'task_histories',
      timestamps: false,
    }
  );

  return TaskHistory;
};

