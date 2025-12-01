import {twMerge} from "tailwind-merge";
import {convertFurigana, getJapaneseIndex} from "@/helpers/general.ts";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import type {ReactNode} from "react";
import {useExamStore} from "@/stores/exam-store.ts";

export default function ChooseTextExercise({answers,answerQuestion,exercises,fontSize}:ExerciseProps<Extract<ExerciseType, {type:"choosetext"}>>) {
    const {correction}=useExamStore()

    function exerciseColor(exerciseId:string, questionId:number, option:string){
        if(correction?.[exerciseId]){
            const isCorrect = correction[exerciseId][questionId].isCorrect;

            if(correction[exerciseId][questionId].correctAnswer === option){
                return "border-green-600";
            }

            if(!isCorrect) return "border-red-600";
        }

        if(!answers[exerciseId]?.includes(option)) return "border-gray-300";

        return "border-blue-600 hover:border-blue-600!";
    }

    function createExercise(exercise:typeof exercises[number]): ReactNode {
        const text = convertFurigana(exercise.text);
        const regex = /\[([^\]]+)\]/g;
        const parts = text.split(regex);

        const htmlParts: ReactNode[] = [];

        const answer = answers[exercise._id]?.[0] || "";

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Normal text
                htmlParts.push(<span className="font-normal" key={`text-${i}`}>{parts[i]}</span>);
            } else {
                htmlParts.push(
                    <span className={twMerge("border-r-2 border-black font-semibold",!answer.length?"text-red-600 border-red-600":"text-blue-600 border-blue-600")} key={`answer-${i}`}>
                        {parts[i]}
                    </span>
                );
            }
        }

        return <span style={{fontSize,lineHeight: fontSize/16+0.5 + "rem"}}
                     className="inline-block gap-1 vertical-text text-start">
            {htmlParts}
        </span>;
    }

    return (
        <div className="w-full flex flex-wrap flex-row-reverse gap-12">
            {exercises.map((exercise,i) => (
            <div className="flex flex-row-reverse w-[100px] gap-4" key={i}>
                <div className="flex flex-col items-center gap-4">
                    <p>
                        <span className={twMerge("font-semibold",!answers[exercise._id]?.[0]?.length?"text-red-600":"text-blue-600")}>{i+1}</span>
                    </p>
                    {createExercise(exercise)}
                </div>
                <div className="flex flex-col gap-2 justify-evenly text-xl">
                    {exercise.options.map((option, index) => (
                        <button className={twMerge("flex flex-col items-center gap-2 w-[50px] bg-transparent !p-0 !pb-2 border-2 hover:border-gray-400!", exerciseColor(exercise._id,0, option))} onClick={() => answerQuestion(exercise._id,0, option)} key={index}>
                            <p>{getJapaneseIndex(index)}</p>
                            <p className="vertical-text">{option}</p>
                        </button>
                        ))}
                </div>
            </div>
                ))}
        </div>
    )
}