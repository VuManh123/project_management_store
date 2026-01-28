'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dashboards_cache', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        defaultValue: Sequelize.literal('(UUID())'),
      },
      project_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      total_tasks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      done_tasks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      overdue: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      progress: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('dashboards_cache');
  }
};

