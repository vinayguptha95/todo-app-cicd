import React from 'react';
import { Button, Badge } from 'react-bootstrap';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  return (
    <div className="todo-item">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <h5 className={todo.completed ? 'text-decoration-line-through text-muted' : ''}>
            {todo.title}
            {todo.completed && (
              <Badge bg="success" className="ms-2">Completed</Badge>
            )}
          </h5>
          {todo.description && (
            <p className="text-muted mb-1">{todo.description}</p>
          )}
          <small className="text-muted">
            Created: {new Date(todo.createdAt).toLocaleString()}
          </small>
        </div>
        <div className="d-flex gap-1">
          <Button
            variant={todo.completed ? "warning" : "success"}
            size="sm"
            onClick={() => onToggle(todo._id, todo.completed)}
          >
            {todo.completed ? 'Undo' : 'Complete'}
          </Button>
          <Button
            variant="info"
            size="sm"
            onClick={() => onEdit(todo)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(todo._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;