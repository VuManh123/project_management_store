'use strict';
const { Model } = require('sequelize');
const TaskReportStatus = require('../enums/TaskReportStatus');

module.exports = (sequelize, DataTypes) => {
  class TaskReport extends Model {
    static associate(models) {
      // Report belongs to task
      TaskReport.belongsTo(models.Task, {
        foreignKey: 'task_id',
        as: 'task',
      });

      // Report submitted by user
      TaskReport.belongsTo(models.User, {
        foreignKey: 'submitted_by',
        as: 'submittedBy',
      });

      // Report reviewed by user
      TaskReport.belongsTo(models.User, {
        foreignKey: 'reviewed_by',
        as: 'reviewedBy',
      });
    }
  }

  TaskReport.init(
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
      submitted_by: {
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
      attachments: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: TaskReportStatus.PENDING,
      },
      reviewed_by: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'TaskReport',
      tableName: 'task_reports',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return TaskReport;
};

