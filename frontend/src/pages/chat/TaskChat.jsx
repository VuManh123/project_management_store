import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ChatWindow from '../../components/chat/ChatWindow';
import useTaskStore from '../../store/taskStore';
import './TaskChat.css';

const TaskChat = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { selectedTask } = useTaskStore();

  return (
    <div className="task-chat-container">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`/projects/${projectId}/tasks/${taskId}`)}
        style={{ marginBottom: 16 }}
      >
        Back to Task
      </Button>
      <ChatWindow
        projectId={projectId}
        taskId={taskId}
        title={`Task Chat - ${selectedTask?.title || 'Task'}`}
      />
    </div>
  );
};

export default TaskChat;
