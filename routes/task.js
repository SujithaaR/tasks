const express = require('express');
const router = express.Router();
const Task = require('../models/Tasks');
const Project = require('../models/Project');

const { isAdmin, isTeamLead, isUser } = require('../middlewares/authMiddleware');

// POST route to create a new task (team leads only)
router.post('/', isTeamLead, async (req, res) => {
    try {
        const { title, description, project, assignedTo, deadline } = req.body;
        // Verify that the project is assigned to the team lead
        const projectDetails = await Project.findById(project);
        if (!projectDetails) {
            return res.status(403).send('Forbidden');
        }
        const task = new Task({ title, description, project, assignedTo, deadline });
        await task.save();
        console.log("task"+ task);
        res.status(201).send(task);

    } catch (error) {
        console.error('Error creating project:', error.message);
        res.status(500).send(`Error creating project: ${error.message}`);
    }
});

// PUT route to update a task (user can update only their own tasks)
router.put('/:id', isUser, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send('Task not found');
        if (task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).send('Forbidden');
        }
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedTask);
    } catch (error) {
        res.status(500).send('Error updating task');
    }
});

// DELETE route to delete a task (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).send('Task not found');
        res.status(200).send('Task deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting task');
    }
});

module.exports = router;

