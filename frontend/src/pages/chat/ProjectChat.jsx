import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ChatWindow from '../../components/chat/ChatWindow';
import useProjectStore from '../../store/projectStore';
import './ProjectChat.css';

const ProjectChat = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedProject } = useProjectStore();

  return (
    <div className="project-chat-container">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`/projects/${projectId}`)}
        style={{ marginBottom: 16 }}
      >
        Back to Project
      </Button>
      <ChatWindow
        projectId={projectId}
        title={`Project Chat - ${selectedProject?.name || 'Project'}`}
      />
    </div>
  );
};

export default ProjectChat;
