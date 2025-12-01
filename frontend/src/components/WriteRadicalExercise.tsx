import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import {useState} from "react";
import RomajiAnswerDialog from "@/components/RomajiAnswerDialog.tsx";
import {renderRadicals} from "@/helpers/general.ts";
import {useExamStore} from "@/stores/exam-store.ts";
import {twMerge} from "tailwind-merge";

export default function WriteRadicalExercise({answers,answerQuestion,exercises}:ExerciseProps<Extract<ExerciseType, {type:"writeradical"}>>) {
    const {correction}=useExamStore()

    const [showAnswerDialog, setShowAnswerDialog] = useState<{
        exerciseId:string;
        questionIndex:number;
        question:{answer:string}
    } | null>(null);

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

        return "border-red-400 text-red-400";
    }

    return(
        <div className="w-[350px] flex flex-row-reverse gap-8 flex-wrap">
            {showAnswerDialog&&(
                <RomajiAnswerDialog closeDialog={()=>{
                    setShowAnswerDialog(null);
                }} questionIndex={0} questionDetails={showAnswerDialog.question} setAnswer={(v)=>{
                    answerQuestion(showAnswerDialog.exerciseId,0,v)
                }}/>
            )}

            {exercises.map((exercise, i) => (
                <div className="flex vertical-text gap-4 items-center group" key={i}>
                    <p style={{writingMode:"horizontal-tb"}} className={answers[exercise._id]?.[0] ? "text-blue-600":"text-red-600"}>{i + 1}</p>
                    <p className="text-4xl">{exercise.text}</p>
                        <button disabled={!!answers[exercise._id] && answers[exercise._id].length>=2} className={twMerge("cursor-pointer radicals rounded-none! border-2 w-10 h-10 text-4xl", exerciseColor(exercise._id,0,answers[exercise._id]?.[0]||""))} onClick={() => {
                            setShowAnswerDialog({
                                exerciseId: exercise._id,
                                questionIndex: i,
                                question: {
                                    answer: exercise.answer
                                }
                            });
                        }}>
                            <span className={correction[exercise._id]?"group-hover:hidden":""}>{answers[exercise._id] ? renderRadicals(answers[exercise._id][0]) : ""}</span>
                            <span className="hidden group-hover:inline text-green-600">{renderRadicals(correction[exercise._id]?.[0]?.correctAnswer||"")}</span>
                        </button>
                </div>
            ))}
        </div>
    )
}