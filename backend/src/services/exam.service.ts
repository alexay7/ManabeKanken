import {Exercise} from "../models/exercise.model";
import {
    getExercisesForLevel,
    gradeChooseComponentExercise,
    gradeChooseExercise,
    gradeCommonKanjiExercise,
    gradeDefinitionsChooseExercise,
    gradeDefinitionsExercise,
    gradeGroupReadingExercise, gradeGroupWritingExercise,
    gradeMultipleKanjiChooseExercise, gradeOkuriganaExercise,
    gradeReadingExercise,
    gradeStrokeOrderExercise,
    gradeTomehaneExercise,
    gradeWriteHiraganaExercise,
    gradeWriteKanjiExercise,
    gradeWriteRadicalExercise, gradeWrongKanjiExercise
} from "../helpers/exercise";

export const examService = {
    getExercises: (type:string)=>{
        return Exercise.find({type,level:"10"});
    },

    getRandomRealExam: (level:string)=>{
        // Generate random index between 1 and 12
        const randomIndex = Math.floor(Math.random() * 12) + 1;

        return Exercise.aggregate([
            { $match: { level,examIndex:randomIndex } }
        ]);
    },

    generateRandomExam: async (level:string)=>{
        return getExercisesForLevel(level)
    },

    gradeExam: async (answers:Record<string, string[]>)=>{
        const fullExercises = await Exercise.find({
            _id: { $in: Object.keys(answers) },
        })

        const results = fullExercises.map((exercise) => {
            const answer = answers[exercise._id.toString()] || [];
            switch (exercise.type) {
                case "reading":
                    return gradeReadingExercise(exercise, answer);
                case "strokeorder":
                    return gradeStrokeOrderExercise(exercise, answer);
                case "groupreading":
                    return gradeGroupReadingExercise(exercise, answer);
                case "choose":
                case "choosetext":
                    return gradeChooseExercise(exercise, answer);
                case "hiragana":
                case "multiplechoose":
                case "multiplechoosetext":
                    return gradeWriteHiraganaExercise(exercise, answer);
                case "kanjirelated":
                case "textsquares":
                case "kanjicomponents":
                case "kanjirelatedgroup":
                case "completekanji":
                case "synonyms":
                    return gradeWriteKanjiExercise(exercise, answer);
                case "okurigana":
                    return gradeOkuriganaExercise(exercise, answer);
                case "tomehane":
                    return gradeTomehaneExercise(exercise, answer);
                case "components":
                    return gradeChooseComponentExercise(exercise, answer);
                case "multiplekanjichoose":
                    return gradeMultipleKanjiChooseExercise(exercise, answer);
                case "definitions":
                    return gradeDefinitionsExercise(exercise, answer);
                case "commonkanji":
                    return gradeCommonKanjiExercise(exercise, answer);
                case "definitionschoose":
                    return gradeDefinitionsChooseExercise(exercise, answer);
                case "writeradical":
                    return gradeWriteRadicalExercise(exercise, answer);
                case "wrongkanji":
                    return gradeWrongKanjiExercise(exercise, answer);
                case "groupwriting":
                    return gradeGroupWritingExercise(exercise, answer);
                default:
                    throw new Error(`Unknown exercise type: ${exercise}`);
            }
        });

        // Combine results into a single object
        return results.reduce((acc, result) => {
            return { ...acc, ...result };
        }, {});
    }
};