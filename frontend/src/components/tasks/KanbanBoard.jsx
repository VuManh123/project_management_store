import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Row, Col } from 'antd';
import DroppableColumn from './DroppableColumn';
import TaskCard from './TaskCard';
import useTaskStore from '../../store/taskStore';
import './KanbanBoard.css';

const KanbanBoard = ({ tasks, projectId }) => {
  const [activeId, setActiveId] = useState(null);
  const { updateTaskStatus, kanbanColumns } = useTaskStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = [
    { id: 'TODO', title: 'To Do', color: '#CBD5E1' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: '#3B82F6' },
    { id: 'REVIEW', title: 'Review', color: '#F59E0B' },
    { id: 'DONE', title: 'Done', color: '#22C55E' },
  ];

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      return;
    }

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Find current column
    const activeColumn = columns.find((col) =>
      kanbanColumns[col.id]?.some((t) => t.id === active.id)
    );

    // Check if dropped on a column (status column)
    const overColumn = columns.find((col) => col.id === over.id);

    if (activeColumn && overColumn && activeColumn.id !== overColumn.id) {
      // Status changed - update task status
      await updateTaskStatus(projectId, active.id, overColumn.id);
    }
    // If dropped on same column or on another task, do nothing (or implement reordering)
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="kanban-board"
      >
        <Row gutter={[16, 16]}>
          {columns.map((column) => {
            const columnTasks = kanbanColumns[column.id] || [];
            const items = columnTasks.map((t) => t.id);

            return (
              <Col xs={24} sm={12} lg={6} key={column.id}>
                <motion.div
                  variants={columnVariants}
                  className="kanban-column"
                >
                  <div
                    className="kanban-column-header"
                    style={{ borderTopColor: column.color }}
                  >
                    <h3>{column.title}</h3>
                    <span className="kanban-column-count">{columnTasks.length}</span>
                  </div>
                  <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="kanban-column-content">
                      {columnTasks.map((task) => (
                        <SortableTaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  </SortableContext>
                </motion.div>
              </Col>
            );
          })}
        </Row>
      </motion.div>
      <DragOverlay>
        {activeTask ? (
          <div style={{ opacity: 0.8, transform: 'rotate(5deg)' }}>
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
