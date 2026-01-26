import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskCard from './SortableTaskCard';

const DroppableColumn = ({ id, title, color, tasks, count }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const items = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'drag-over' : ''}`}
      style={{
        borderTopColor: color,
      }}
    >
      <div className="kanban-column-header">
        <h3>{title}</h3>
        <span className="kanban-column-count">{count}</span>
      </div>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="kanban-column-content">
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default DroppableColumn;
