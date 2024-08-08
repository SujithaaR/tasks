const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, description, owner } = req.body;
        const project = new Project({ name, description, owner });
        await project.save();
        res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
        console.error('Error creating project:', error); // Log the error for debugging
        res.status(400).json({ error: 'Project creation failed', details: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('owner', 'username email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('owner', 'username email');
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

module.exports = router;
