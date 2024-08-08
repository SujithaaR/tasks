const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
    deadline: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
