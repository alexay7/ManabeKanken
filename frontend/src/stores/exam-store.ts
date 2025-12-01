import {create} from "zustand";
import {persist, createJSONStorage} from 'zustand/middleware'
import type {ExerciseType} from "@/types/exercises.type.ts";

type ExamStore = {
    exam: ExerciseType[] | undefined;
    setExam: (exam: ExerciseType[] | undefined) => void;

    correction: Record<string, { isCorrect:boolean, correctAnswer:string }[]>;
    setCorrection: (answers: Record<string, { isCorrect:boolean, correctAnswer:string }[]>) => void;

    pastResults: {
        timestamp: number;
        level:string;
        score:number;
        passed:boolean;
        exam: ExerciseType[];
        answers: Record<string, string[]>;
        correction: Record<string, { isCorrect:boolean, correctAnswer:string }[]>;
    }[],
    addPastResult: (exam:ExerciseType[], answers: Record<string, string[]>, correction: Record<string, { isCorrect:boolean, correctAnswer:string }[]>,score:number,level:string,passed:boolean) => void;

    resetExam: () => void;
};

export const useExamStore = create(persist<ExamStore>((set,get) => ({
    exam: undefined,
    setExam: (exam) => {
        set({exam})
    },

    correction: {},
    setCorrection: (correction) => {
        set({correction})
    },

    pastResults: [],
    addPastResult: (exam, answers, correction, score, level, passed) => {
        // If another result with same level and score exists, do not add
        const existing = get().pastResults.find(r => r.level === level && r.score === score && r.passed === passed);
        if (existing) return;

        set((state) => ({
            pastResults: [
                ...state.pastResults,
                {
                    timestamp: Date.now(),
                    level,
                    score,
                    passed,
                    exam,
                    answers,
                    correction
                }
            ]
        }))
    },

    resetExam: () => {
        set({
            exam: undefined,
            correction: {}
        })
    }
}), {
    name: 'exam-store',
    storage: createJSONStorage(() => localStorage),
}));
