// backend/routes/todos.js
module.exports = (app, Todo) => {
    // Get all todos
    app.get('/api/todos', async (req, res) => {
        try {
            const todos = await Todo.find();
            res.json(todos);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Add a new todo
    app.post('/api/todos', async (req, res) => {
        try {
            const newTodo = new Todo(req.body);
            await newTodo.save();
            res.status(201).json(newTodo);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};
