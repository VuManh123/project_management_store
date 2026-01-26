import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload, message, Card } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useTaskStore from '../../store/taskStore';
import './SubmitReport.css';

const { TextArea } = Input;

const SubmitReport = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { selectedTask, fetchTaskById, isLoading } = useTaskStore();

  useEffect(() => {
    if (projectId && taskId) {
      fetchTaskById(projectId, taskId);
    }
  }, [projectId, taskId, fetchTaskById]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // API call to submit report
      // await taskAPI.submitReport(projectId, taskId, values);
      message.success('Report submitted successfully');
      navigate(`/projects/${projectId}/tasks/${taskId}`);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading && !selectedTask) {
    return <LoadingSpinner />;
  }

  return (
    <div className="submit-report-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/projects/${projectId}/tasks/${taskId}`)}
          style={{ marginBottom: 16 }}
        >
          Back to Task
        </Button>

        <Card title={`Submit Report - ${selectedTask?.title}`}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="summary"
              label="Summary"
              rules={[{ required: true, message: 'Please input summary!' }]}
            >
              <TextArea
                rows={4}
                placeholder="Brief summary of your work"
              />
            </Form.Item>

            <Form.Item
              name="details"
              label="Details"
              rules={[{ required: true, message: 'Please input details!' }]}
            >
              <TextArea
                rows={8}
                placeholder="Detailed description of completed work"
              />
            </Form.Item>

            <Form.Item
              name="files"
              label="Attachments"
            >
              <Upload
                beforeUpload={() => false}
                multiple
                maxCount={5}
              >
                <Button icon={<UploadOutlined />}>Upload Files</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit Report
                </Button>
                <Button onClick={() => navigate(`/projects/${projectId}/tasks/${taskId}`)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default SubmitReport;
