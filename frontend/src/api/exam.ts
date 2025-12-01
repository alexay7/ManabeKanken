import type {ExerciseType} from "@/types/exercises.type.ts";
import {api} from "@/api/request.ts";

export const ExamAPI = {
    getRandomExam: async (level: string) => {
        return api.get<ExerciseType[]>(`exams/${level}`);
    },
    gradeExam: async (answers: Record<string, string[]>) => {
        return api.post<{answers:Record<string, string[]>},Record<string, { isCorrect:boolean, correctAnswer:string }[]>>('exams/grade', {answers});
    }
}