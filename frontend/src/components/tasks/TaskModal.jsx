import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal, Form, Input, Select, DatePicker, InputNumber, message } from 'antd';
import { usePermission } from '../../hooks/usePermission';
import useProjectStore from '../../store/projectStore';
import dayjs from 'dayjs';
import './TaskModal.css';

const { TextArea } = Input;
const { Option } = Select;

const TaskModal = ({ open, onCancel, onOk, task = null, projectId }) => {
  const [form] = Form.useForm();
  const { canAssignTask } = usePermission();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    if (open) {
      fetchProjects();
    }
  }, [open, fetchProjects]);

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [task, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };
      onOk(formattedValues);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <Modal
      title={task ? 'Edit Task' : 'Create Task'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText={task ? 'Update' : 'Create'}
      cancelText="Cancel"
      className="task-modal"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={modalVariants}
        transition={{ duration: 0.2 }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'TODO',
            priority: 'medium',
            progress: 0,
          }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input task title!' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea
              rows={4}
              placeholder="Enter task description"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="TODO">To Do</Option>
              <Option value="IN_PROGRESS">In Progress</Option>
              <Option value="REVIEW">Review</Option>
              <Option value="DONE">Done</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="urgent">Urgent</Option>
            </Select>
          </Form.Item>

          {canAssignTask() && (
            <Form.Item
              name="assigneeId"
              label="Assignee"
            >
              <Select
                placeholder="Select assignee"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {/* Options will be populated from project members */}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="dueDate"
            label="Due Date"
          >
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>

          <Form.Item
            name="progress"
            label="Progress (%)"
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: '100%' }}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
            />
          </Form.Item>
        </Form>
      </motion.div>
    </Modal>
  );
};

export default TaskModal;
