'use strict';
const { Model } = require('sequelize');
const TaskType = require('../enums/TaskType');
const TaskStatus = require('../enums/TaskStatus');
const TaskPriority = require('../enums/TaskPriority');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Task belongs to project
      Task.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project',
      });

      // Task assigned to user
      Task.belongsTo(models.User, {
        foreignKey: 'assigned_to',
        as: 'assignedTo',
      });

      // Task reporter
      Task.belongsTo(models.User, {
        foreignKey: 'reporter',
        as: 'reporterUser',
      });

      // Task parent (self-reference)
      Task.belongsTo(models.Task, {
        foreignKey: 'parent_task_id',
        as: 'parentTask',
      });

      // Task subtasks
      Task.hasMany(models.Task, {
        foreignKey: 'parent_task_id',
        as: 'subtasks',
      });

      // Task comments
      Task.hasMany(models.TaskComment, {
        foreignKey: 'task_id',
        as: 'comments',
      });

      // Task histories
      Task.hasMany(models.TaskHistory, {
        foreignKey: 'task_id',
        as: 'histories',
      });

      // Task reports
      Task.hasMany(models.TaskReport, {
        foreignKey: 'task_id',
        as: 'reports',
      });
    }
  }

  Task.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      project_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: TaskType.TASK,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: TaskStatus.TODO,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: TaskPriority.MEDIUM,
      },
      assigned_to: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      reporter: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
      },
      estimate_hour: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      parent_task_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: 'tasks',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'tasks',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Task;
};

