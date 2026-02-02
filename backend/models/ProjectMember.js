'use strict';
const { Model } = require('sequelize');
const ProjectMemberRole = require('../enums/ProjectMemberRole');

module.exports = (sequelize, DataTypes) => {
  class ProjectMember extends Model {
    static associate(models) {
      // Project member belongs to project
      ProjectMember.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project',
      });

      // Project member belongs to user
      ProjectMember.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  ProjectMember.init(
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
      user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: ProjectMemberRole.MEMBER,
      },
      joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ProjectMember',
      tableName: 'project_members',
      timestamps: false,
    }
  );

  return ProjectMember;
};

