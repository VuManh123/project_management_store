const responseUtils = require("utils/responseUtils");
const db = require("models");
const ProjectStatus = require("enums/ProjectStatus");
const ProjectMemberRole = require("enums/ProjectMemberRole");
const { Op } = require("sequelize");

const projectController = {
  // Create new project
  create: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { name, description, start_date, end_date, status, member_ids, member_emails } = req.body;

      // Create project
      const project = await db.Project.create({
        name: name.trim(),
        description: description?.trim() || null,
        pm_id: userId,
        status: status || ProjectStatus.ACTIVE,
        start_date: start_date || null,
        end_date: end_date || null,
      });

      // Add project members if provided (support both member_ids and member_emails)
      let memberUserIds = [];
      
      // Handle member_emails (from new UI)
      if (member_emails && Array.isArray(member_emails) && member_emails.length > 0) {
        const users = await db.User.findAll({
          where: {
            email: { [Op.in]: member_emails },
          },
          attributes: ['id', 'email'],
        });
        
        memberUserIds = users.map(u => u.id);
        
        // Warn about emails not found
        const foundEmails = users.map(u => u.email);
        const notFoundEmails = member_emails.filter(email => !foundEmails.includes(email));
        if (notFoundEmails.length > 0) {
          console.log('Warning: Users not found for emails:', notFoundEmails);
        }
      }
      
      // Handle member_ids (backward compatibility)
      if (member_ids && Array.isArray(member_ids) && member_ids.length > 0) {
        memberUserIds = [...new Set([...memberUserIds, ...member_ids])]; // Merge and deduplicate
      }

      // Add members to project
      if (memberUserIds.length > 0) {
        const members = memberUserIds.map((memberId) => ({
          project_id: project.id,
          user_id: memberId,
          role: ProjectMemberRole.MEMBER,
        }));
        await db.ProjectMember.bulkCreate(members);
      }

      // Fetch created project with associations
      const createdProject = await db.Project.findByPk(project.id, {
        include: [
          {
            model: db.User,
            as: "pm",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.ProjectMember,
            as: "members",
            include: [
              {
                model: db.User,
                as: "user",
                attributes: ["id", "name", "email", "avatar"],
              },
            ],
          },
        ],
      });

      return responseUtils.ok(res, createdProject);
    } catch (error) {
      console.error("Create project error:", error);
      return responseUtils.error(res, "Failed to create project");
    }
  },

  // Get all projects (with filtering and pagination)
  getAll: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { page = 1, limit = 10, status, search } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      // Filter by status if provided
      if (status) {
        where.status = parseInt(status);
      }

      // Search by name or description
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      // Find all project IDs where user is a member (any role)
      const memberProjects = await db.ProjectMember.findAll({
        where: { user_id: userId },
        attributes: ["project_id"],
        raw: true,
      });
      const memberProjectIds = memberProjects.map((mp) => mp.project_id);

      // Get projects where user is PM or member
      const projectWhere = {
        ...where,
        [Op.or]: [
          { pm_id: userId },
          ...(memberProjectIds.length > 0 ? [{ id: { [Op.in]: memberProjectIds } }] : []),
        ],
      };

      const { count, rows: projects } = await db.Project.findAndCountAll({
        where: projectWhere,
        include: [
          {
            model: db.User,
            as: "pm",
            attributes: ["id", "name", "email", "avatar"],
          },
        ],
        distinct: true,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["created_at", "DESC"]],
      });

      return responseUtils.ok(res, {
        projects,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      console.error("Get all projects error:", error);
      return responseUtils.error(res, "Failed to get projects");
    }
  },

  // Get project by ID
  getById: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId } = req.params;

      const project = await db.Project.findOne({
        where: { id: projectId },
        include: [
          {
            model: db.User,
            as: "pm",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.ProjectMember,
            as: "members",
            include: [
              {
                model: db.User,
                as: "user",
                attributes: ["id", "name", "email", "avatar"],
              },
            ],
          },
          {
            model: db.Task,
            as: "tasks",
            attributes: ["id", "title", "status", "priority"],
          },
        ],
      });

      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      // Check if user has access to this project
      const isMember = project.members.some((member) => member.user_id === userId);
      const isPM = project.pm_id === userId;

      if (!isMember && !isPM) {
        return responseUtils.forbidden(res, "You don't have access to this project");
      }

      return responseUtils.ok(res, project);
    } catch (error) {
      console.error("Get project by ID error:", error);
      return responseUtils.error(res, "Failed to get project");
    }
  },

  // Update project
  update: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId } = req.params;
      const { name, description, status, start_date, end_date } = req.body;

      const project = await db.Project.findByPk(projectId);

      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      // Check if user is PM of this project
      if (project.pm_id !== userId) {
        return responseUtils.forbidden(res, "Only PM can update the project");
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (status !== undefined) updateData.status = parseInt(status);
      if (start_date !== undefined) updateData.start_date = start_date || null;
      if (end_date !== undefined) updateData.end_date = end_date || null;

      await project.update(updateData);

      // Fetch updated project with associations
      const updatedProject = await db.Project.findByPk(projectId, {
        include: [
          {
            model: db.User,
            as: "pm",
            attributes: ["id", "name", "email", "avatar"],
          },
          {
            model: db.ProjectMember,
            as: "members",
            include: [
              {
                model: db.User,
                as: "user",
                attributes: ["id", "name", "email", "avatar"],
              },
            ],
          },
        ],
      });

      return responseUtils.ok(res, updatedProject);
    } catch (error) {
      console.error("Update project error:", error);
      return responseUtils.error(res, "Failed to update project");
    }
  },

  // Delete project
  delete: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId } = req.params;

      const project = await db.Project.findByPk(projectId);

      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      // Check if user is PM of this project
      if (project.pm_id !== userId) {
        return responseUtils.forbidden(res, "Only PM can delete the project");
      }

      // Delete project (cascade delete will handle related records)
      await project.destroy();

      return responseUtils.ok(res, {
        message: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Delete project error:", error);
      return responseUtils.error(res, "Failed to delete project");
    }
  },

  // Add member to project
  addMember: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId } = req.params;
      const { user_id, role } = req.body;

      const project = await db.Project.findByPk(projectId);

      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      // Check if user is PM or LEADER of this project
      const isPM = project.pm_id === userId;
      const isLeader = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: userId,
          role: ProjectMemberRole.LEADER,
        },
      });

      if (!isPM && !isLeader) {
        return responseUtils.forbidden(res, "Only PM or LEADER can add members");
      }

      // Check if user already a member
      const existingMember = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: user_id,
        },
      });

      if (existingMember) {
        return responseUtils.invalidated(res, {
          user_id: "User is already a member of this project",
        });
      }

      // Check if user exists
      const userExists = await db.User.findByPk(user_id);
      if (!userExists) {
        return responseUtils.notFound(res, "User not found");
      }

      // Add member
      const member = await db.ProjectMember.create({
        project_id: projectId,
        user_id: user_id,
        role: role || ProjectMemberRole.MEMBER,
      });

      // Fetch member with user details
      const newMember = await db.ProjectMember.findByPk(member.id, {
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["id", "name", "email", "avatar"],
          },
        ],
      });

      return responseUtils.ok(res, newMember);
    } catch (error) {
      console.error("Add member error:", error);
      return responseUtils.error(res, "Failed to add member");
    }
  },

  // Remove member from project
  removeMember: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId, memberId } = req.params;

      const project = await db.Project.findByPk(projectId);

      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      // Check if user is PM or LEADER of this project
      const isPM = project.pm_id === userId;
      const isLeader = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: userId,
          role: ProjectMemberRole.LEADER,
        },
      });

      if (!isPM && !isLeader) {
        return responseUtils.forbidden(res, "Only PM or LEADER can remove members");
      }

      // Find member
      const member = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: memberId,
        },
      });

      if (!member) {
        return responseUtils.notFound(res, "Member not found in this project");
      }

      // Remove member
      await member.destroy();

      return responseUtils.ok(res, {
        message: "Member removed successfully",
      });
    } catch (error) {
      console.error("Remove member error:", error);
      return responseUtils.error(res, "Failed to remove member");
    }
  },

  // Update member role
  updateMemberRole: async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { projectId, memberId } = req.params;
      const { role } = req.body;

      const project = await db.Project.findByPk(projectId);

      if (!project) {
        return responseUtils.notFound(res, "Project not found");
      }

      // Only PM can update member roles
      if (project.pm_id !== userId) {
        return responseUtils.forbidden(res, "Only PM can update member roles");
      }

      // Find member
      const member = await db.ProjectMember.findOne({
        where: {
          project_id: projectId,
          user_id: memberId,
        },
      });

      if (!member) {
        return responseUtils.notFound(res, "Member not found in this project");
      }

      // Update role
      await member.update({ role: parseInt(role) });

      // Fetch updated member with user details
      const updatedMember = await db.ProjectMember.findByPk(member.id, {
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["id", "name", "email", "avatar"],
          },
        ],
      });

      return responseUtils.ok(res, updatedMember);
    } catch (error) {
      console.error("Update member role error:", error);
      return responseUtils.error(res, "Failed to update member role");
    }
  },
};

module.exports = projectController;
