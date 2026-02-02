'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversation_members', {
      conversation_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'conversations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addIndex('conversation_members', ['conversation_id', 'user_id'], {
      unique: true,
      name: 'conversation_members_conversation_user_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('conversation_members');
  }
};

