'use strict';
const { Model } = require('sequelize');
const ProjectStatus = require('../enums/ProjectStatus');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // Project PM
      Project.belongsTo(models.User, {
        foreignKey: 'pm_id',
        as: 'pm',
      });

      // Project members
      Project.hasMany(models.ProjectMember, {
        foreignKey: 'project_id',
        as: 'members',
      });

      // Project tasks
      Project.hasMany(models.Task, {
        foreignKey: 'project_id',
        as: 'tasks',
      });

      // Project dashboard cache
      Project.hasOne(models.DashboardCache, {
        foreignKey: 'project_id',
        as: 'dashboardCache',
      });
    }
  }

  Project.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pm_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: ProjectStatus.ACTIVE,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'projects',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Project;
};

