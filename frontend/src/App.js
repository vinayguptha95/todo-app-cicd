import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || '/api';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/todos`);
      if (response.data.success) {
        setTodos(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/todos`, {
        title,
        description
      });
      
      if (response.data.success) {
        setTodos([response.data.data, ...todos]);
        setTitle('');
        setDescription('');
        setError('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const updateTodo = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        title: editTitle,
        description: editDescription
      });
      
      if (response.data.success) {
        setTodos(todos.map(todo => 
          todo._id === id ? response.data.data : todo
        ));
        setEditingId(null);
        setError('');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const toggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        completed: !completed
      });
      
      if (response.data.success) {
        setTodos(todos.map(todo => 
          todo._id === id ? response.data.data : todo
        ));
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo status.');
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    
    try {
      const response = await axios.delete(`${API_URL}/todos/${id}`);
      
      if (response.data.success) {
        setTodos(todos.filter(todo => todo._id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">📝 Todo Application</h2>
              <small>Full Stack CI/CD Demo | API: {API_URL}</small>
            </Card.Header>
            
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              {/* Add Todo Form */}
              <Form onSubmit={addTodo} className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter todo title"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description (optional)"
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={!title.trim()}>
                  Add Todo
                </Button>
              </Form>

              {/* Todo List */}
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Your Todos ({todos.length})</h5>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={fetchTodos}
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : 'Refresh'}
                    </Button>
                  </div>
                </Card.Header>
                
                <Card.Body>
                  {loading ? (
                    <div className="text-center">
                      <Spinner animation="border" />
                      <p className="mt-2">Loading todos...</p>
                    </div>
                  ) : todos.length === 0 ? (
                    <Alert variant="info">
                      No todos yet. Add your first todo above!
                    </Alert>
                  ) : (
                    <ListGroup variant="flush">
                      {todos.map((todo) => (
                        <ListGroup.Item key={todo._id} className="py-3">
                          {editingId === todo._id ? (
                            <div>
                              <Form.Group className="mb-2">
                                <Form.Control
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="mb-2"
                                />
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                />
                              </Form.Group>
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  onClick={() => updateTodo(todo._id)}
                                >
                                  Save
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={cancelEdit}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
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
                                    Created: {formatDate(todo.createdAt)}
                                  </small>
                                </div>
                                <div className="d-flex gap-1">
                                  <Button
                                    variant={todo.completed ? "warning" : "success"}
                                    size="sm"
                                    onClick={() => toggleComplete(todo._id, todo.completed)}
                                  >
                                    {todo.completed ? 'Undo' : 'Complete'}
                                  </Button>
                                  <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => startEdit(todo)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => deleteTodo(todo._id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Card.Body>
            
            <Card.Footer className="text-muted text-center">
              <small>Todo App - CI/CD Pipeline Demo | GitHub Actions + AKS + ACR</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;