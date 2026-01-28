'use strict';
const { Model } = require('sequelize');
const UserStatus = require('../enums/UserStatus');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User as PM of projects
      User.hasMany(models.Project, {
        foreignKey: 'pm_id',
        as: 'managedProjects',
      });

      // User as project member
      User.hasMany(models.ProjectMember, {
        foreignKey: 'user_id',
        as: 'projectMemberships',
      });

      // User assigned tasks
      User.hasMany(models.Task, {
        foreignKey: 'assigned_to',
        as: 'assignedTasks',
      });

      // User reported tasks
      User.hasMany(models.Task, {
        foreignKey: 'reporter',
        as: 'reportedTasks',
      });

      // User comments
      User.hasMany(models.TaskComment, {
        foreignKey: 'user_id',
        as: 'taskComments',
      });

      // User task histories
      User.hasMany(models.TaskHistory, {
        foreignKey: 'changed_by',
        as: 'taskHistories',
      });

      // User submitted reports
      User.hasMany(models.TaskReport, {
        foreignKey: 'submitted_by',
        as: 'submittedReports',
      });

      // User reviewed reports
      User.hasMany(models.TaskReport, {
        foreignKey: 'reviewed_by',
        as: 'reviewedReports',
      });

      // User conversation memberships
      User.hasMany(models.ConversationMember, {
        foreignKey: 'user_id',
        as: 'conversationMemberships',
      });

      // User sent messages
      User.hasMany(models.Message, {
        foreignKey: 'sender_id',
        as: 'sentMessages',
      });

      // User notifications
      User.hasMany(models.Notification, {
        foreignKey: 'user_id',
        as: 'notifications',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: UserStatus.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return User;
};

