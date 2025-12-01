import {z} from "zod";

export const getExamDto = z.strictObject({
    level: z.string()
});

export const gradeExamDto = z.strictObject({
//     Object with _ids of exercises and their answers in arrays of strings
    answers: z.record(z.string(), z.array(z.string())),
})