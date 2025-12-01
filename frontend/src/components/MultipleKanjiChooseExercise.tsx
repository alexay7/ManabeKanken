import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import {twMerge} from "tailwind-merge";
import {getJapaneseIndex, renderRadicals} from "@/helpers/general.ts";
import type {ReactNode} from "react";
import {useExamStore} from "@/stores/exam-store.ts";

export default function MultipleKanjiChooseExercise({answers,answerQuestion,exercises}:ExerciseProps<Extract<ExerciseType, {type:"multiplekanjichoose"|"definitions"}>>) {
    const {correction}=useExamStore()

    function exerciseColor(exerciseId:string, questionId:number, option:string){
        if(correction?.[exerciseId]){
            const isCorrect = correction[exerciseId][questionId].isCorrect;

            if(correction[exerciseId][questionId].correctAnswer === option){
                return "border-green-600 text-green-600";
            }

            if(!isCorrect) return "border-red-600 text-red-600";
        }

        if(option.length){
            return "border-blue-600 text-blue-600";
        }

        return "border-red-600 text-red-600";
    }

    function createRadicalsExercise(
        exercise: Extract<ExerciseType, {type:"multiplekanjichoose"}>,
        questions: {text: string}[],questionIndex:number): ReactNode {
        const regex = /\[([^\]]+)\]/g;
        return questions.map((question,index) => {
            const realIndex = questionIndex*3+index
            //     Replace the brackets with a select
            const parts = question.text.split(regex);
            const answer = answers[exercise._id]?.[realIndex] || "";

            const q = parts.map((part, j) => {
                if (j % 2 === 0) {
                    // Even index, normal text
                    if(!part.length) return null;

                    return <span key={j} className="font-normal text-center vertical-text px-1">{part}</span>;
                } else {
                    const options = exercise.options;
                    // Odd index, this is the part with brackets
                    return (
                        <div className="group relative">
                            <p className="group-hover:flex hidden absolute text-green-600 justify-center items-center top-1 left-0">
                                {correction[exercise._id]?.[realIndex]?.correctAnswer}
                            </p>
                        <select disabled={!!correction[exercise._id]}
                            className={twMerge("text-center border-2 noarrow w-8 h-8", exerciseColor(exercise._id,realIndex,answer),!correction[exercise._id]?"":"group-hover:text-white")}
                                key={j}
                                onChange={(e) => answerQuestion(exercise._id,realIndex,e.target.value)}
                                value={answer}
                                style={{writingMode:"horizontal-tb"}}
                        >
                            <option value="" disabled></option>
                            {options.map((option, i) => (
                                <option value={option} key={i}
                                >{getJapaneseIndex(i)}</option>)
                            )};
                        </select>
                        </div>
                    );
                }
            })
            return (
                <div className="flex text-2xl vertical-text items-center" key={index}>
                {q}
                </div>
            );
        })
    }

    function createDefinitionsExercise(
        exercise: Extract<ExerciseType, {type:"definitions"}>,
        question: Extract<ExerciseType, { type:"definitions" }>["texts"][number],
        qIndex:number
    ): ReactNode {
        const regex = /\[([^\]]+)\]/g;
        const parts = question.text.split(regex);
        const q = parts.map((part, j) => {
            if (j % 2 === 0) {
                // Even index, normal text
                if(!part.length) return null;

                return <span key={j} className="font-normal text-center vertical-text px-1">{part}</span>;
            } else {
                const options = exercise.options[0];
                const realIndex = qIndex*2+ Math.floor(j/2);
                const answer = answers[exercise._id]?.[realIndex] || "";

                // Odd index, this is the part with brackets
                return (
                    <div className="group relative">
                        <p className="group-hover:flex hidden absolute text-green-600 justify-center items-center top-1 left-0">
                            {correction[exercise._id]?.[realIndex]?.correctAnswer}
                        </p>
                    <select disabled={!!correction[exercise._id]} className={twMerge("text-center noarrow w-8 h-8 border-2", exerciseColor(exercise._id,realIndex,answer),!correction[exercise._id]?"":"group-hover:text-white")}
                            key={j}
                            onChange={(e) => answerQuestion(exercise._id,realIndex,e.target.value)}
                            value={answer}
                            style={{writingMode:"horizontal-tb"}}
                    >
                        <option value="" disabled></option>
                        {options.map((option, i) => (
                            <option value={option} key={i}>{getJapaneseIndex(i)}</option>)
                        )};
                    </select>
                    </div>
                );
            }
        })
        return (
            <div className="flex text-2xl vertical-text" key={qIndex}>
                {q}
            </div>
        );

    }

    function renderExercise(exercise: typeof exercises[number],index:number) {
        switch (exercise.type) {
            case "multiplekanjichoose":
                return (
                    <div className="flex flex-row-reverse" key={index}>
                        {exercise.texts.map((q,qIndex)=>(
                            <div className="flex flex-col items-center gap-4 border-2 border-black py-2 nth-[1]:border-l-0 font-semibold">
                                <p className="text-2xl vertical-text py-4 px-2 border-b-2 border-black h-[4ch] text-center">{q.reading}</p>
                                {createRadicalsExercise(exercise, q.questions,qIndex)}
                            </div>
                        ))}
                        <div className="flex flex-row-reverse gap-2 mr-4">
                            <div className="flex flex-row-reverse gap-3 p-4 text-xl border border-black max-w-[120px] flex-wrap justify-center items-center gap-y-8" key={index}>
                                {exercise.options.map((option,i) => (
                                    <p className="text-sm vertical-text"><b>{getJapaneseIndex(i*option.length)}</b> <span className={twMerge("text-xl",answers[exercises[0]._id]?.some(x=>x===option)?"line-through":"")}>{renderRadicals(option)}</span></p>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case "definitions":
                return (
                    <div className="flex flex-row-reverse gap-4" key={index}>
                        {exercise.texts.map((question,qIndex) => createDefinitionsExercise(exercise, question, qIndex))}

                        <div className="flex flex-row-reverse gap-2 mr-4">
                            <div className="flex flex-row-reverse gap-3 p-4 text-xl border border-black max-w-[120px] flex-wrap justify-center items-center gap-y-8" key={index}>
                                {exercise.options[0].map((option,i) => (
                                    <p className="text-sm vertical-text"><b>{getJapaneseIndex(i)}</b> <span className={twMerge("text-xl",answers[exercises[0]._id]?.some(x=>x===option)?"line-through":"")}>{renderRadicals(option)}</span></p>
                                ))}
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="w-full flex flex-wrap flex-row-reverse gap-12">
            {exercises.map((exercise,i) => renderExercise(exercise,i))}
        </div>
    )
}
