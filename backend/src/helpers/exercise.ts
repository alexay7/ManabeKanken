import {ExerciseType, WriteKanjiTextType} from "../types/exercise.type";
import {Exercise} from "../models/exercise.model";
import {Types} from "mongoose";

export function gradeReadingExercise(exercise:Extract<ExerciseType, { type: "reading" }>,answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.questions.map(q => q.answer);

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeStrokeOrderExercise(exercise:Extract<ExerciseType, { type: "strokeorder" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.answers;
    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect:parseInt(ans) === correctAnswers[index],
            correctAnswer: correctAnswers[index].toString()
        }))
    };
}

export function gradeGroupReadingExercise(exercise:Extract<ExerciseType, { type: "groupreading" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.questions.map(q => q.answer);

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeGroupWritingExercise(exercise:Extract<ExerciseType, { type: "groupwriting" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.questions.map(q => q.answer.text);

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    }
}

export function gradeChooseExercise(exercise:Extract<ExerciseType, { type: "choose"|"choosetext" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswer = exercise.answer;

    return {
        [exercise._id.toString()]: answer.map(ans => ({
            isCorrect: ans === correctAnswer,
            correctAnswer: correctAnswer
        }))
    };
}

export function gradeWriteHiraganaExercise(exercise:Extract<ExerciseType, { type: "hiragana"|"multiplechoose"|"multiplechoosetext" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.questions.map(q => q.answer);

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeWriteKanjiExercise(exercise:Extract<ExerciseType, { category: "writeKanji" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.questions.map(q => q.answer.kanjis.join(""));

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeOkuriganaExercise(exercise:WriteKanjiTextType&{_id:string}, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.questions.map(q => q.answer.text);

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeTomehaneExercise(exercise:Extract<ExerciseType, { type: "tomehane" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.answer;

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers,
            correctAnswer: correctAnswers
        }))
    };
}

export function gradeChooseComponentExercise(exercise:Extract<ExerciseType, { type: "components" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.texts.reduce((acc, curr) => {
        const answers = curr.questions.map(q=>q.answer);
        return [...acc, ...answers];
    }, [] as string[]);

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeMultipleKanjiChooseExercise(exercise:Extract<ExerciseType, { type: "multiplekanjichoose" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.texts.reduce((acc, curr) => {
        const answers = curr.questions.map(q => q.answer);
        return [...acc, ...answers];
    }, [] as string[]);

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeDefinitionsExercise(exercise:Extract<ExerciseType, { type: "definitions" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.texts.reduce((acc, curr) => {
        const answers = curr.answer;
        return [...acc, ...answers];
    }, [] as string[]);

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeCommonKanjiExercise(exercise:Extract<ExerciseType, { type: "commonkanji" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.questions.map(q => q.answer);

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeWrongKanjiExercise(exercise:Extract<ExerciseType, { type: "wrongkanji" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = [exercise.answer.wrong,exercise.answer.kanjis.join("")]

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeWriteRadicalExercise(exercise:Extract<ExerciseType, { type: "writeradical" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = [exercise.answer]

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export function gradeDefinitionsChooseExercise(exercise:Extract<ExerciseType, { type: "definitionschoose" }>, answer:string[]):Record<string, {isCorrect:boolean,correctAnswer:string}[]>{
    const correctAnswers = exercise.questions.reduce((acc, curr) => {
        const answer = curr.answer;
        return [...acc, answer];
    }, [] as string[]);

    return {
        [exercise._id.toString()]: answer.map((ans, index) => ({
            isCorrect: ans === correctAnswers[index],
            correctAnswer: correctAnswers[index]
        }))
    };
}

export async function getExercisesForLevel(level:string){
    switch (level) {
        case "10":{
            const first = await Exercise.aggregate().match({level:"10",exerciseIndex:1}).sample(6);
            const second = await Exercise.aggregate().match({level:"10",exerciseIndex:2}).sample(12);
            const third = await Exercise.aggregate().match({level:"10",exerciseIndex:3}).sample(4);
            const fourth = await Exercise.aggregate().match({level:"10",exerciseIndex:4}).sample(5);
            const fifth = await Exercise.aggregate().match({level:"10",exerciseIndex:5}).sample(5);
            const sixth = await Exercise.aggregate().match({level:"10",exerciseIndex:6}).sample(10);
            const seventh = await Exercise.aggregate().match({level:"10",exerciseIndex:7}).sample(6);
            return [...first,...second,...third,...fourth,...fifth,...sixth,...seventh
            ];
        }
        case "9": {
            const first = await Exercise.aggregate().match({level:"9",exerciseIndex:1}).sample(6);
            const second = await Exercise.aggregate().match({level:"9",exerciseIndex:2}).sample(10);
            const third = await Exercise.aggregate().match({level:"9",exerciseIndex:3}).sample(5);
            const fourth = await Exercise.aggregate().match({level:"9",exerciseIndex:4}).sample(4);
            const fifth = await Exercise.aggregate().match({level:"9",exerciseIndex:5}).sample(5);
            const sixth = await Exercise.aggregate().match({level:"9",exerciseIndex:6}).sample(6);
            const seventh = await Exercise.aggregate().match({level:"9",exerciseIndex:7}).sample(5);
            const eighth = await Exercise.aggregate().match({level:"9",exerciseIndex:8}).sample(10);
            const ninth = await Exercise.aggregate().match({level:"9",exerciseIndex:9}).sample(7);
            return [...first,...second,...third,...fourth,...fifth,...sixth,...seventh,...eighth,...ninth
            ];
        }
        case "8": {
            const first = await Exercise.aggregate().match({level:"8",exerciseIndex:1}).sample(30);
            const second = await Exercise.aggregate().match({level:"8",exerciseIndex:2}).sample(10);
            const third = await Exercise.aggregate().match({level:"8",exerciseIndex:3}).sample(5);
            const fourth = await Exercise.aggregate().match({level:"8",exerciseIndex:4}).sample(5);
            const fifth = await Exercise.aggregate().match({level:"8",exerciseIndex:5}).sample(5);
            const sixth = await Exercise.aggregate().match({level:"8",exerciseIndex:6}).sample(5);
            const seventh = await Exercise.aggregate().match({level:"8",exerciseIndex:7}).sample(5);
            const eighth = await Exercise.aggregate().match({level:"8",exerciseIndex:8}).sample(10);
            return [...first,...second,...third,...fourth,...fifth,...sixth,...seventh,...eighth
            ];
        }
        case "7": {
            const first = await Exercise.aggregate().match({level:"7",exerciseIndex:1}).sample(20)
            const second = await Exercise.aggregate().match({level:"7",exerciseIndex:2}).sample(5);
            const third = await Exercise.aggregate().match({level:"7",exerciseIndex:3}).sample(10);
            const fourth_1 = await Exercise.aggregate().match({level:"7",exerciseIndex:4,stroke:{$ne:null}}).sample(5);
            const fourth_2 = await Exercise.aggregate().match({level:"7",exerciseIndex:4,stroke:null}).sample(5);
            const fifth = await Exercise.aggregate().match({level:"7",exerciseIndex:5}).sample(10);
            const sixth = await Exercise.aggregate().match({level:"7",exerciseIndex:6}).sample(1);
            const seventh = await Exercise.aggregate().match({level:"7",exerciseIndex:7}).sample(7);
            const eighth = await Exercise.aggregate().match({level:"7",exerciseIndex:8}).sample(3);
            const ninth = await Exercise.aggregate().match({level:"7",exerciseIndex:9}).sample(4);
            const tenth = await Exercise.aggregate().match({level:"7",exerciseIndex:10}).sample(5);
            const eleventh = await Exercise.aggregate().match({level:"7",exerciseIndex:11}).sample(20);
            return [...first,...second,...third,...fourth_1,...fourth_2,...fifth,...sixth,...seventh,...eighth,...ninth,...tenth,...eleventh
            ];
        }
        case "6": {
            const first = await Exercise.aggregate().match({level:"6",exerciseIndex:1}).sample(20);
            const second = await Exercise.aggregate().match({level:"6",exerciseIndex:2}).sample(5);
            const third = await Exercise.aggregate().match({level:"6",exerciseIndex:3}).sample(1);
            const fourth = await Exercise.aggregate().match({level:"6",exerciseIndex:4}).sample(5);
            const fifth = await Exercise.aggregate().match({level:"6",exerciseIndex:5}).sample(10);
            const sixth = await Exercise.aggregate().match({level:"6",exerciseIndex:6}).sample(10);
            const seventh_1 = await Exercise.aggregate().match({level:"6",exerciseIndex:7,group:"類"}).sample(1);
            const seventh_2 = await Exercise.aggregate().match({level:"6",exerciseIndex:7,group:"対"}).sample(1);
            const eighth = await Exercise.aggregate().match({level:"6",exerciseIndex:8}).sample(1);
            const ninth = await Exercise.aggregate().match({level:"6",exerciseIndex:9}).sample(10);
            const tenth = await Exercise.aggregate().match({level:"6",exerciseIndex:10}).sample(9);
            const eleventh = await Exercise.aggregate().match({level:"6",exerciseIndex:11}).sample(20);
            return [...first,...second,...third,...fourth,...fifth,...sixth,...seventh_1,...seventh_2,...eighth,...ninth,...tenth,...eleventh
            ];
        }
        case "5":{
            const first = await Exercise.aggregate().match({level:"5",exerciseIndex:1}).sample(20);
            const second = await Exercise.aggregate().match({level:"5",exerciseIndex:2}).sample(1);
            const third = await Exercise.aggregate().match({level:"5",exerciseIndex:3}).sample(5);
            const fourth = await Exercise.aggregate().match({level:"5",exerciseIndex:4}).sample(5);
            const fifth = await Exercise.aggregate().match({level:"5",exerciseIndex:5}).sample(10);
            const sixth = await Exercise.aggregate().match({level:"5",exerciseIndex:6}).sample(10);
            const seventh_1 = await Exercise.aggregate().match({level:"5",exerciseIndex:7,group:"類"}).sample(1);
            // same hint as seventh_1
            const seventh_2 = await Exercise.aggregate().match({level:"5",exerciseIndex:7,group:"対",hint:seventh_1[0].hint}).sample(1);
            const eighth = await Exercise.aggregate().match({level:"5",exerciseIndex:8}).sample(1);
            const ninth = await Exercise.aggregate().match({level:"5",exerciseIndex:9}).sample(10);
            const tenth = await Exercise.aggregate().match({level:"5",exerciseIndex:10}).sample(10);
            const eleventh = await Exercise.aggregate().match({level:"5",exerciseIndex:11}).sample(20);
            return [...first,...second,...third,...fourth,...fifth,...sixth,...seventh_1, ...seventh_2, ...eighth,...ninth,...tenth,...eleventh
            ];
        }
        case "4": {
            const first = await Exercise.aggregate().match({level:"4",exerciseIndex:1}).sample(30);
            const second = await Exercise.aggregate().match({level:"4",exerciseIndex:2}).sample(5);
            const third = await Exercise.aggregate().match({level:"4",exerciseIndex:3}).sample(1);
            const fourth = await Exercise.aggregate().match({level:"4",exerciseIndex:4}).sample(10);
            const fifth = await Exercise.aggregate().match({level:"4",exerciseIndex:5}).sample(10);
            const sixth_1 = await Exercise.aggregate().match({level:"4",exerciseIndex:6,group:"類"}).sample(1);
            // same hint as sixth_1
            const sixth_2 = await Exercise.aggregate().match({level:"4",exerciseIndex:6,group:"対",hint:sixth_1[0].hint}).sample(1);
            const seventh = await Exercise.aggregate().match({level:"4",exerciseIndex:7}).sample(5);
            const eighth = await Exercise.aggregate().match({level:"4",exerciseIndex:8}).sample(10);
            const ninth = await Exercise.aggregate().match({level:"4",exerciseIndex:9}).sample(5);
            const tenth = await Exercise.aggregate().match({level:"4",exerciseIndex:10}).sample(20);
            return [...first,...second,...third,...fourth,...fifth,...sixth_1,...sixth_2,...seventh,...eighth,...ninth,...tenth
            ];
        }
        case "3": {
            const first = await Exercise.aggregate().match({level:"3",exerciseIndex:1}).sample(30);
            const second = await Exercise.aggregate().match({level:"3",exerciseIndex:2}).sample(5);
            const third = await Exercise.aggregate().match({level:"3",exerciseIndex:3}).sample(1);
            const fourth = await Exercise.aggregate().match({level:"3",exerciseIndex:4}).sample(10);
            const fifth = await Exercise.aggregate().match({level:"3",exerciseIndex:5}).sample(10);
            const sixth_1 = await Exercise.aggregate().match({level:"3",exerciseIndex:6,group:"類"}).sample(1);
            // same hint as sixth_1
            const sixth_2 = await Exercise.aggregate().match({level:"3",exerciseIndex:6,group:"対",hint:sixth_1[0].hint}).sample(1);
            const seventh = await Exercise.aggregate().match({level:"3",exerciseIndex:7}).sample(5);
            const eighth = await Exercise.aggregate().match({level:"3",exerciseIndex:8}).sample(10);
            const ninth = await Exercise.aggregate().match({level:"3",exerciseIndex:9}).sample(5);
            const tenth = await Exercise.aggregate().match({level:"3",exerciseIndex:10}).sample(20);
            return [...first,...second,...third,...fourth,...fifth,...sixth_1,...sixth_2,...seventh,...eighth,...ninth,...tenth
            ];
        }
        case "pre2":{
            const first = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:1}).sample(30);
            const second = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:2}).sample(10);
            const third = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:3}).sample(10);
            const fourth = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:4}).sample(1);
            const fifth = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:5}).sample(1);
            const sixth_1 = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:6,group:"類"}).sample(1);
            // same hint as sixth_1
            const sixth_2 = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:6,group:"対",hint:sixth_1[0].hint}).sample(1);
            const seventh = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:7}).sample(5);
            const eighth = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:8}).sample(5);
            const ninth = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:9}).sample(5);
            const tenth = await Exercise.aggregate().match({level:"pre 2",exerciseIndex:10}).sample(25);
            return [...first,...second,...third,...fourth,...fifth,...sixth_1,...sixth_2,...seventh,...eighth,...ninth,...tenth
            ];
        }
        case "2":{
            const first = await Exercise.aggregate().match({level:"2",exerciseIndex:1}).sample(30);
            const second = await Exercise.aggregate().match({level:"2",exerciseIndex:2}).sample(10);
            const third = await Exercise.aggregate().match({level:"2",exerciseIndex:3}).sample(10);
            const fourth = await Exercise.aggregate().match({level:"2",exerciseIndex:4}).sample(1);
            const fifth = await Exercise.aggregate().match({level:"2",exerciseIndex:5}).sample(1);
            const sixth_1 = await Exercise.aggregate().match({level:"2",exerciseIndex:6,group:"類"}).sample(1);
            // same hint as sixth_1
            const sixth_2 = await Exercise.aggregate().match({level:"2",exerciseIndex:6,group:"対",hint:sixth_1[0].hint}).sample(1);
            const seventh = await Exercise.aggregate().match({level:"2",exerciseIndex:7}).sample(5);
            const eighth = await Exercise.aggregate().match({level:"2",exerciseIndex:8}).sample(5);
            const ninth = await Exercise.aggregate().match({level:"2",exerciseIndex:9}).sample(5);
            const tenth = await Exercise.aggregate().match({level:"2",exerciseIndex:10}).sample(25);
            return [...first,...second,...third,...fourth,...fifth,...sixth_1,...sixth_2,...seventh,...eighth,...ninth,...tenth
            ];
        }
    }
}