import {type ReactNode, useState} from "react";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import {twMerge} from "tailwind-merge";
import Bracket from "../assets/bracket.svg?react"
import {convertFurigana} from "@/helpers/general.ts";
import KanjiAnswerDialog from "@/components/KanjiAnswerDialog.tsx";
import {useExamStore} from "@/stores/exam-store.ts";

export default function GroupWritingExercise({answers, answerQuestion, exercises, fontSize}: ExerciseProps<Extract<ExerciseType, {type: "groupwriting"}>>) {
    const {correction}=useExamStore()

    const [showAnswerDialog, setShowAnswerDialog] = useState<{
        exerciseId:string;
        questionIndex:number;
        question:{text:string,answer:{text:string,kanjis:string[]}}
    } | null>(null);

    function exerciseColor(exerciseId:string, questionId:number, answer:string){
        if(!answer.length) return "border-red-600 text-red-600";

        if(correction?.[exerciseId]){
            const isCorrect = correction[exerciseId][questionId].isCorrect;
            return isCorrect ? "border-green-600 text-green-600" : "border-red-600 text-red-600";
        }

        return "border-blue-600 text-blue-600";
    }

    function createExercise(exercise:typeof exercises[number], text:string, index:number): ReactNode {
        text = convertFurigana(text);
        const regex = /\[([^\]]+)\]/g;
        const parts = text.split(regex);

        const htmlParts: ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Normal text
                htmlParts.push(<span className="font-normal" key={`text-${i}`}
                >{parts[i]}</span>);
            } else {
                const answer = answers[exercise._id]?.[index] || "";

                // Input box with text at the right
                htmlParts.push(
                    <div className={twMerge("w-8 min-h-8 border-2 relative inline-flex mx-1 group", exerciseColor(exercise._id, index, answer))}
                         style={{height:answer.length*1.5+"em"}} key={`part-${i}`}>
                        <p className={twMerge("absolute top-0 -right-[21px] text-[12px] pointer-events-none font-semibold text-nowrap")}>{parts[i]}</p>
                        <button disabled={!!answer.length} className={twMerge("w-full h-full text-center text-2xl !p-0 bg-transparent",!answer.length?"border-red-600":"border-blue-600")}
                                onClick={() => {
                                    if(correction?.[exercise._id]) return;
                                    setShowAnswerDialog({
                                        exerciseId: exercise._id,
                                        questionIndex: index,
                                        question: {
                                            text: text,
                                            answer:{
                                                text: exercise.questions[index].answer.text,
                                                kanjis:exercise.questions[index].answer.kanjis,
                                            }
                                        }
                                    });

                                }}
                        >
                            <span className={twMerge(!correction[exercise._id]?"":"group-hover:hidden")}>{answer}</span>
                            <span className="opacity-0 group-hover:opacity-100 text-green-600 flex h-max bg-white border border-gray-200">{correction[exercise._id]?.[index].correctAnswer }</span></button>
                    </div>
                );
            }
        }

        return <span style={{fontSize,lineHeight: fontSize/16+0.5 + "rem"}}
                     className="inline-block gap-1 vertical-text text-start">
            {htmlParts}
        </span>;
    }

    return (
        <div className="flex flex-wrap flex-row-reverse gap-10">
            {showAnswerDialog&&(
                <KanjiAnswerDialog closeDialog={()=>{
                    setShowAnswerDialog(null);
                }} questionIndex={showAnswerDialog.questionIndex}
                                   questionDetails={showAnswerDialog.question}
                                   setAnswer={(v)=>{
                    answerQuestion(showAnswerDialog.exerciseId,showAnswerDialog.questionIndex,v)
                }}/>
            )}
            {exercises.map((exercise,index) => (
                    <div className="flex flex-col relative gap-2" key={`group-${index}`}>
                        <Bracket className="w-full h-[10px]"/>
                        <div className="flex flex-row-reverse gap-6">
                            {exercise.texts.map((question,i) => {
                                return (
                                    <div className={"flex items-end flex-col gap-2"} key={`${exercise._id}-question-${i}`}>
                                        <div className="text-left w-full h-[350px] vertical-text">
                                            {createExercise(exercise,question.text,i)}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            )}
        </div>
    )
}