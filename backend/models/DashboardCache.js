'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DashboardCache extends Model {
    static associate(models) {
      // Cache belongs to project
      DashboardCache.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project',
      });
    }
  }

  DashboardCache.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      project_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        unique: true,
        references: {
          model: 'projects',
          key: 'id',
        },
      },
      total_tasks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      done_tasks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      overdue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'DashboardCache',
      tableName: 'dashboards_cache',
      timestamps: true,
      createdAt: false,
      updatedAt: 'updated_at',
    }
  );

  return DashboardCache;
};

