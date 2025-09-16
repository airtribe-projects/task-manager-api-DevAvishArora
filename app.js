const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tasks = [];
let nextId = 1;

try {
    const tasksData = JSON.parse(fs.readFileSync(path.join(__dirname, 'task.json'), 'utf8'));
    tasks = (tasksData.tasks || []).map(task => ({
        ...task,
        priority: task.priority || 'medium',
        createdAt: task.createdAt || new Date().toISOString()
    }));
    if (tasks.length > 0) {
        nextId = Math.max(...tasks.map(task => task.id)) + 1;
    }
} catch (error) {
    console.log('Could not load tasks from task.json, starting with empty array');
}

const validateTask = (req, res, next) => {
    const { title, description, completed, priority } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
    
    if (!description || typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({ error: 'Description is required and must be a non-empty string' });
    }
    
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean value' });
    }
    
    if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Priority must be one of: low, medium, high' });
    }
    
    next();
};

app.get('/tasks', (req, res) => {
    const { completed, priority, sort } = req.query;
    
    let filteredTasks = [...tasks];
    
    if (completed !== undefined) {
        const isCompleted = completed === 'true';
        filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
    }
    
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    
    if (sort === 'createdAt' || sort === 'date') {
        filteredTasks.sort((a, b) => a.id - b.id);
    } else if (sort === 'createdAt-desc' || sort === 'date-desc') {
        filteredTasks.sort((a, b) => b.id - a.id); 
    }
    
    res.json(filteredTasks);
});

app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    
    if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
});

app.post('/tasks', validateTask, (req, res) => {
    const { title, description, completed = false, priority = 'medium' } = req.body;
    
    const newTask = {
        id: nextId++,
        title: title.trim(),
        description: description.trim(),
        completed,
        priority,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', validateTask, (req, res) => {
    const taskId = parseInt(req.params.id);
    
    if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const { title, description, completed, priority } = req.body;
    
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title.trim(),
        description: description.trim(),
        completed: completed !== undefined ? completed : tasks[taskIndex].completed,
        priority: priority !== undefined ? priority : tasks[taskIndex].priority || 'medium'
    };
    
    res.json(tasks[taskIndex]);
});

app.get('/tasks/priority/:level', (req, res) => {
    const priorityLevel = req.params.level.toLowerCase();
    
    if (!['low', 'medium', 'high'].includes(priorityLevel)) {
        return res.status(400).json({ error: 'Invalid priority level. Must be one of: low, medium, high' });
    }
    
    const filteredTasks = tasks.filter(task => (task.priority || 'medium') === priorityLevel);
    res.json(filteredTasks);
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    
    if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.json({ message: 'Task deleted successfully', task: deletedTask });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;