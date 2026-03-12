import mongoose from 'mongoose';

const quizStateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: { type: Map, of: String, default: {} },
    startedAt: { type: Date, default: Date.now },
    timeRemaining: { type: Number, required: true },
    lastSavedAt: { type: Date, default: Date.now },
    flagCount: { type: Number, default: 0 },
    flagEvents: [{
        type: { type: String, enum: ['tab_switch', 'fullscreen_exit', 'page_blur', 'refresh'], required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Compound index to ensure one state per user per quiz
quizStateSchema.index({ userId: 1, quizId: 1 }, { unique: true });

export default mongoose.model('QuizState', quizStateSchema);
