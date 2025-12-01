import Bracket from "../assets/bracket.svg?react"
import {twMerge} from "tailwind-merge";
import {convertFurigana, renderRadicals} from "@/helpers/general.ts";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import {useExamStore} from "@/stores/exam-store.ts";

export default function ChooseExercise({answers,answerQuestion,exercises}:ExerciseProps<Extract<ExerciseType, {type:"choose"}>>) {
    const {correction}=useExamStore()

    function convertTextToHtml(text: string): string {
    //     The text in brackets should be curly underlined
        return text.replace(/\[([^\]]+)\]/g, (_, word) => {
            return `<span class="border-r-2 border-black">${word}</span>`;
        });
    }

    const biggestTextLength = Math.max(...exercises.map(e => e.text.replaceAll("[","").replaceAll("]","").split(";")[0].length));

    function exerciseColor(exerciseId:string, questionId:number, option:string){
        if(correction?.[exerciseId]){
            const isCorrect = correction[exerciseId][questionId].isCorrect;

            if(correction[exerciseId][questionId].correctAnswer === option){
                return "border-green-600";
            }

            if(!answers[exerciseId]?.includes(option)) return "border-gray-300";

            if(!isCorrect) return "border-red-600";
        }

        if(!answers[exerciseId]?.includes(option)) return "border-gray-300";

        return "border-blue-600 hover:border-blue-600!";
    }

    return (
            <div className={twMerge("flex flex-wrap flex-row-reverse gap-8")}>
                {exercises.map((exercise, index) => (
                <div className="flex flex-col w-[150px] items-center gap-4" key={index}>
                    <p className={twMerge("font-semibold",!answers[exercise._id]?.[0]?.length?"text-red-600":"text-blue-600")}>{index+1}</p>
                    <p className="vertical-text text-2xl font-semibold text-end" dangerouslySetInnerHTML={{__html: convertTextToHtml(convertFurigana(exercise.text))}}
                    style={{height: `${biggestTextLength}ch`}}
                    ></p>
                    <Bracket className="w-full h-[10px]"/>
                    <div className="flex flex-row-reverse gap-2 justify-evenly w-full text-xl">
                        {exercise.options.map((option, optionIndex) => (
                        <button className={twMerge("flex flex-col items-center gap-2 bg-transparent !p-0 !pb-2 hover:border-gray-400! border-2", exerciseColor(exercise._id,0, option)
                        )} onClick={() => {
                            if(correction[exercise._id]) return;
                            answerQuestion(exercise._id,0, option)
                        }} key={optionIndex}>
                            <p>{optionIndex+1}</p>
                            <p className="vertical-text radicals">{renderRadicals(option)}</p>
                        </button>
                            ))}
                    </div>
                </div>
                    ))}
            </div>
    )
}