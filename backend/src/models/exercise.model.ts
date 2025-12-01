import mongoose, {Schema, Types} from "mongoose";
import {ExerciseType} from "../types/exercise.type";

const kanjiAnswerSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    kanjis: {
        type: [String],
        required: true
    }
});

const exerciseSchema = new Schema<ExerciseType>({
    text: {
        type:String,
        required:true
    },
    texts: [{
        questions: {
            type: [Schema.Types.Mixed],
            required: false
        },
        text: {
            type: String,
            required: false
        },
        answer: {
            type: [String],
            required: false
        },
    }],
    questions: [{
        text: {
            type: String,
            required: true
        },
        answer: {
            type: Schema.Types.Mixed,
            required: true
        },
    }],
    options: {
        type: [String],
        required: false,
        default: []
    },
    answers: {
        type: [Number],
        required: false,
        default: []
    },
    answer: {
        type: Schema.Types.Mixed,
        required: false,
        default: null
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    exerciseIndex: {
        type: Number,
        required: true
    },
    examIndex: {
        type: Number,
        required: false,
        default: null
    },
});

export const Exercise = mongoose.model('Exercise', exerciseSchema);