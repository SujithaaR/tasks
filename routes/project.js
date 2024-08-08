const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { isAdmin, isTeamLead } = require('../middlewares/authMiddleware');

router.post('/', isAdmin, async (req, res) => {
    try {
        const { name, description, owner } = req.body;

        // Validate input
        if (!name || !description || !owner) {
            return res.status(400).send('Bad Request: Missing required fields');
        }

        console.log('Received data:', { name, description, owner });
        console.log('Admin ID:', req.user._id);

        // Create new project
        const project = new Project({ name, description, owner, createdBy: req.user._id });
        await project.save();
        console.log("project"+ project);
        
        res.status(201).send(project);
    } catch (error) {
        console.error('Error creating project:', error.message);
        res.status(500).send(`Error creating project: ${error.message}`);
    }
});


// GET route to get all projects created by the admin (admin only)
router.get('/', isAdmin, async (req, res) => {
    try {
        console.log(req.user._id);
        const projects = await Project.find({ createdBy: req.user._id });
        console.log(projects);
        
        res.status(200).send(projects);
    } catch (error) {
        console.error('Error fetching projects for admin:', error);
        res.status(500).send('Error fetching projects');
    }
});

// GET route to get projects assigned to a team lead (team lead only)
router.get('/teamlead/projects', isTeamLead, async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id });
        res.status(200).send(projects);
    } catch (error) {
        console.error('Error fetching projects for team lead:', error);
        res.status(500).send('Error fetching projects');
    }
});

module.exports = router;


