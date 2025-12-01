import {type ReactNode} from "react";
import {twMerge} from "tailwind-merge";
import RomajiInput from "@/components/RomajiInput.tsx";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import {useExamStore} from "@/stores/exam-store.ts";

export default function WriteHiraganaExercise({answers,answerQuestion,exercises}:ExerciseProps<Extract<ExerciseType, {type:"hiragana"}>>) {
    const {correction}=useExamStore()

    function exerciseColor(exerciseId:string, questionId:number, answer:string){
        if(!answer.length) return "border-red-600 text-red-600";

        if(correction?.[exerciseId]){
            const isCorrect = correction[exerciseId][questionId].isCorrect;
            return isCorrect ? "border-green-600 text-green-600" : "border-red-600 text-red-600";
        }

        return "border-blue-600 text-blue-600";
    }

    function createHiraganaExercise(exercise:typeof exercises[number]): ReactNode {
        const regex = /\[([^\]]+)\]/g;
        const parts = exercise.questions.map(q=>q.text).join("").split(regex);
        const htmlParts: ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {

            if (i % 2 === 0) {
                // Normal text
                htmlParts.push(<span key={i}>{parts[i]}</span>);
            } else {
                const questionNum = Math.floor(i / 2);

                const answer = answers[exercise._id]?.[questionNum] || "";

                // Input box with text at the right
                htmlParts.push(
                    <div className={twMerge("w-8 min-h-8 border-2 relative inline-flex mx-1", exerciseColor(exercise._id, questionNum, answer),!correction[exercise._id]?"":"group")}
                         style={{height:answer.length*1.5+"em"}} key={`part-${i}`}>
                        <p className={twMerge("absolute -top-1 -right-9 text-[12px] pointer-events-none")}>{parts[i]}</p>
                        <div className="relative h-full">
                            <RomajiInput readOnly={!!correction[exercise._id]} type="text" className={twMerge("w-full h-full text-center text-2xl p-0 absolute",!correction[exercise._id]?"":"group-hover:text-white")}
                                         value={answer}
                                         setValue={(value) => {
                                             answerQuestion(exercise._id, questionNum, value);
                                         }}
                            />
                            <p className="absolute hidden w-8 h-8 left-[6px] justify-center group-hover:flex text-green-600">{correction[exercise._id]?.[questionNum]?.correctAnswer }</p>
                        </div>
                    </div>
                );
            }
        }

        return <div className="inline-block text-2xl leading-12">{htmlParts}</div>;
    }

    return (
            <div className="flex flex-row-reverse gap-4 flex-wrap">
                {exercises.map((exercise) => (
                    <div className="flex flex-col items-center gap-1" key={exercise._id}>
                        <p className="vertical-text text-2xl">{exercise.text}</p>
                        <p className="text-lg" style={{writingMode:"vertical-rl"}}>・・・</p>
                        { exercise.questions.length > 0 && (
                            <div className="vertical-text">
                                {createHiraganaExercise(exercise)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
    );
}