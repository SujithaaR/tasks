const express = require('express');
const Task = require('../models/Tasks');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { title, description, project, assignedTo, deadline } = req.body;
        const task = new Task({ title, description, project, assignedTo, deadline });
        await task.save();
        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Task creation failed' });
    }
});

// Get tasks by project ID or all tasks
router.get('/', async (req, res) => {
    try {
        const { project } = req.query;
        const query = project ? { project } : {};
        const tasks = await Task.find(query).populate('project', 'name').populate('assignedTo', 'username email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
    }
});

module.exports = router;
