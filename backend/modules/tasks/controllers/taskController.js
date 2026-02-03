const responseUtils = require("utils/responseUtils");
const db = require("models");
const TaskStatus = require("enums/TaskStatus");
const TaskPriority = require("enums/TaskPriority");
const TaskType = require("enums/TaskType");
const ProjectMemberRole = require("enums/ProjectMemberRole");
const { Op } = require("sequelize");

const taskController = {
  // Create new task
  create: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId } = req.params;
      const {
        title,
        description,
        type,
        status,
        priority,
        assigned_to,
        progress,
        estimate_hour,
        due_date,
        parent_task_id,
      } = req.body;

      // Verify user has access to this project
      const project = await db.Project.findByPk(projectId);
      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      const isMember = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: userId,
        },
      });
      const isPM = project.pm_id === userId;

      if (!isMember && !isPM) {
        return responseUtils.forbidden(res, "You don't have access to this project");
      }

      // Create task
      const task = await db.Task.create({
        project_id: projectId,
        title: title.trim(),
        description: description?.trim() || null,
        type: type || TaskType.TASK,
        status: status || TaskStatus.TODO,
        priority: priority || TaskPriority.MEDIUM,
        assigned_to: assigned_to || null,
        reporter: userId,
        progress: progress || 0,
        estimate_hour: estimate_hour || null,
        due_date: due_date || null,
        parent_task_id: parent_task_id || null,
      });

      // Fetch created task with associations
      const createdTask = await db.Task.findByPk(task.id, {
        include: [
          {
            model: db.User,
            as: "assignedTo",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "reporterUser",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.Task,
            as: "parentTask",
            attributes: ["id", "title", "status"],
          },
        ],
      });

      return responseUtils.ok(res, createdTask);
    } catch (error) {
      console.error("Create task error:", error);
      return responseUtils.error(res, "Failed to create task");
    }
  },

  // Get all tasks in a project (with filtering and pagination)
  getAll: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId } = req.params;
      const { page = 1, limit = 50, status, priority, type, assigned_to, search } = req.query;

      // Verify user has access to this project
      const project = await db.Project.findByPk(projectId);
      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      const isMember = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: userId,
        },
      });
      const isPM = project.pm_id === userId;

      if (!isMember && !isPM) {
        return responseUtils.forbidden(res, "You don't have access to this project");
      }

      const offset = (page - 1) * limit;
      const where = { project_id: projectId };

      // Filter by status
      if (status) {
        where.status = parseInt(status);
      }

      // Filter by priority
      if (priority) {
        where.priority = parseInt(priority);
      }

      // Filter by type
      if (type) {
        where.type = parseInt(type);
      }

      // Filter by assigned user
      if (assigned_to) {
        where.assigned_to = assigned_to;
      }

      // Search by title or description
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      const { count, rows: tasks } = await db.Task.findAndCountAll({
        where,
        include: [
          {
            model: db.User,
            as: "assignedTo",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "reporterUser",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.Task,
            as: "parentTask",
            attributes: ["id", "title", "status"],
          },
          {
            model: db.Task,
            as: "subtasks",
            attributes: ["id", "title", "status", "priority"],
          },
        ],
        distinct: true,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["created_at", "DESC"]],
      });

      return responseUtils.ok(res, {
        tasks,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      console.error("Get all tasks error:", error);
      return responseUtils.error(res, "Failed to get tasks");
    }
  },

  // Get task by ID
  getById: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId, taskId } = req.params;

      // Verify user has access to this project
      const project = await db.Project.findByPk(projectId);
      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      const isMember = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: userId,
        },
      });
      const isPM = project.pm_id === userId;

      if (!isMember && !isPM) {
        return responseUtils.forbidden(res, "You don't have access to this project");
      }

      const task = await db.Task.findOne({
        where: {
          id: taskId,
          project_id: projectId,
        },
        include: [
          {
            model: db.User,
            as: "assignedTo",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "reporterUser",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.Task,
            as: "parentTask",
            attributes: ["id", "title", "status", "priority"],
          },
          {
            model: db.Task,
            as: "subtasks",
            attributes: ["id", "title", "status", "priority", "assigned_to"],
            include: [
              {
                model: db.User,
                as: "assignedTo",
                attributes: ["id", "name", "email", "avatar"],
              },
            ],
          },
          {
            model: db.TaskComment,
            as: "comments",
            include: [
              {
                model: db.User,
                as: "user",
                attributes: ["id", "name", "email", "avatar"],
              },
            ],
            order: [["created_at", "DESC"]],
          },
        ],
      });

      if (!task) {
        return responseUtils.notFound(res, "Task not found");
      }

      return responseUtils.ok(res, task);
    } catch (error) {
      console.error("Get task by ID error:", error);
      return responseUtils.error(res, "Failed to get task");
    }
  },

  // Update task
  update: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId, taskId } = req.params;
      const {
        title,
        description,
        type,
        status,
        priority,
        assigned_to,
        progress,
        estimate_hour,
        due_date,
        parent_task_id,
      } = req.body;

      // Verify user has access to this project
      const project = await db.Project.findByPk(projectId);
      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      const isMember = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: userId,
        },
      });
      const isPM = project.pm_id === userId;

      if (!isMember && !isPM) {
        return responseUtils.forbidden(res, "You don't have access to this project");
      }

      const task = await db.Task.findOne({
        where: {
          id: taskId,
          project_id: projectId,
        },
      });

      if (!task) {
        return responseUtils.notFound(res, "Task not found");
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (type !== undefined) updateData.type = parseInt(type);
      if (status !== undefined) updateData.status = parseInt(status);
      if (priority !== undefined) updateData.priority = parseInt(priority);
      if (assigned_to !== undefined) updateData.assigned_to = assigned_to || null;
      if (progress !== undefined) updateData.progress = parseInt(progress);
      if (estimate_hour !== undefined) updateData.estimate_hour = estimate_hour || null;
      if (due_date !== undefined) updateData.due_date = due_date || null;
      if (parent_task_id !== undefined) updateData.parent_task_id = parent_task_id || null;

      await task.update(updateData);

      // Fetch updated task with associations
      const updatedTask = await db.Task.findByPk(taskId, {
        include: [
          {
            model: db.User,
            as: "assignedTo",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "reporterUser",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.Task,
            as: "parentTask",
            attributes: ["id", "title", "status"],
          },
          {
            model: db.Task,
            as: "subtasks",
            attributes: ["id", "title", "status", "priority"],
          },
        ],
      });

      return responseUtils.ok(res, updatedTask);
    } catch (error) {
      console.error("Update task error:", error);
      return responseUtils.error(res, "Failed to update task");
    }
  },

  // Delete task
  delete: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId, taskId } = req.params;

      // Verify user has access to this project
      const project = await db.Project.findByPk(projectId);
      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      const member = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: userId,
        },
      });
      const isPM = project.pm_id === userId;
      const isLeader = member && member.role === ProjectMemberRole.LEADER;

      if (!isPM && !isLeader) {
        return responseUtils.forbidden(res, "Only PM or LEADER can delete tasks");
      }

      const task = await db.Task.findOne({
        where: {
          id: taskId,
          project_id: projectId,
        },
      });

      if (!task) {
        return responseUtils.notFound(res, "Task not found");
      }

      // Check if task has subtasks
      const subtasksCount = await db.Task.count({
        where: { parent_task_id: taskId },
      });

      if (subtasksCount > 0) {
        return responseUtils.invalidated(res, {
          task: "Cannot delete task with subtasks. Please delete or reassign subtasks first.",
        });
      }

      // Delete task (cascade delete will handle related records)
      await task.destroy();

      return responseUtils.ok(res, {
        message: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Delete task error:", error);
      return responseUtils.error(res, "Failed to delete task");
    }
  },

  // Update task status (quick status update)
  updateStatus: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId, taskId } = req.params;
      const { status } = req.body;

      // Verify user has access to this project
      const project = await db.Project.findByPk(projectId);
      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      const isMember = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: userId,
        },
      });
      const isPM = project.pm_id === userId;

      if (!isMember && !isPM) {
        return responseUtils.forbidden(res, "You don't have access to this project");
      }

      const task = await db.Task.findOne({
        where: {
          id: taskId,
          project_id: projectId,
        },
      });

      if (!task) {
        return responseUtils.notFound(res, "Task not found");
      }

      await task.update({ status: parseInt(status) });

      // Fetch updated task with associations
      const updatedTask = await db.Task.findByPk(taskId, {
        include: [
          {
            model: db.User,
            as: "assignedTo",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.User,
            as: "reporterUser",
            attributes: ["id", "name", "email", "avatar"],
          },
        ],
      });

      return responseUtils.ok(res, updatedTask);
    } catch (error) {
      console.error("Update task status error:", error);
      return responseUtils.error(res, "Failed to update task status");
    }
  },
};

module.exports = taskController;
