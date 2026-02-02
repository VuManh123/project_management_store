'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_histories', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        defaultValue: Sequelize.literal('(UUID())'),
      },
      task_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'tasks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      batch_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        unique: true,
      },
      field: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      old_value: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      new_value: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      changed_by: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      changed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_histories');
  }
};

