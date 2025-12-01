import {twMerge} from "tailwind-merge";
import RenderKanji from "@/components/RenderKanji.tsx";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import type {ReactNode} from "react";
import {convertFurigana} from "@/helpers/general.ts";
import {useExamStore} from "@/stores/exam-store.ts";

export default function TomehaneExercise({answers,answerQuestion,exercises,fontSize}:ExerciseProps<Extract<ExerciseType, {type:"tomehane"}>>) {
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

    function createExercise(exercise: typeof exercises[number]): ReactNode {
        const text = convertFurigana(exercise.text)
        const regex = /\[([^\]]+)\]/g;
        const parts = text.split(regex);

        const htmlParts:ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Normal text
                htmlParts.push(<span className="font-normal" key={`text-${i}`}>{parts[i]}</span>);
            } else {
                const questionIndex = Math.floor(i / 2);

                // Text inside brackets
                const answer = answers[exercise._id]?.[questionIndex] || "";

                htmlParts.push(
                    <div className={twMerge("relative inline font-normal -mr-2", !answer.length ? "text-red-600 border-red-600":"text-blue-600 border-blue-600")} key={`answer-${i}`}>
                        <div className="w-[50px] h-[50px] flex justify-center items-center">
                            <RenderKanji kanji={exercise.kanji} strokes={false} circleCoords={exercise.coords} width={50} height={50}/>
                        </div>
                    </div>
                );
            }
        }

        return <span style={{fontSize,lineHeight: fontSize/16+0.75 + "rem"}}
                     className="flex gap-2 text-start items-center">
            {htmlParts}
        </span>;
    }

    return(
        <div className="flex flex-row-reverse flex-wrap gap-8 gap-y-4 h-fit max-w-[136px]">
            {exercises.map((exercise,i) => (
            <div className="flex flex-col items-center gap-4" key={i}>
                <div className="inline-flex vertical-text items-center text-2xl">
                    {createExercise(exercise)}
                </div>

                <div className="flex gap-2 flex-col">
                    {exercise.options.map((option) => (
                    <button className={twMerge("border-2 px-2 py-1", exerciseColor(exercise._id, 0, option))} key={option}
                            onClick={() => answerQuestion(exercise._id, 0, option)}>{option}</button>
                    ))}
                </div>
            </div>
                ))}
        </div>
    )
}