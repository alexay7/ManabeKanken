import {type ReactNode, useState} from "react";
import RomajiInput from "@/components/RomajiInput.tsx";
import {convertFurigana} from "@/helpers/general.ts";
import {twMerge} from "tailwind-merge";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {PopoverArrow} from "@radix-ui/react-popover";
import Bracket from "../assets/bracket.svg?react"
import {useExamStore} from "@/stores/exam-store.ts";

export default function GroupReadingExercise({answers,answerQuestion,exercises,fontSize}:ExerciseProps<Extract<ExerciseType, {type:"groupreading"}>>) {
    const {correction}=useExamStore()

    const [openedPopover, setOpenedPopover] = useState<string|null>(null);

    function getNextQuestionIndex(currentQuestionId:string, questionIndex:number):string {
        const exercise = exercises.find(ex => ex._id === currentQuestionId);
        if (!exercise) return "";

        const exerciseQuestions = exercise.questions.length;

        if (questionIndex + 1 < exerciseQuestions) {
            return `${exercise._id}-${questionIndex + 1}`;
        } else {
            const nextExerciseIndex = exercises.findIndex(ex => ex._id === currentQuestionId) + 1;
            if (nextExerciseIndex < exercises.length) {
                return `${exercises[nextExerciseIndex]._id}-0`;
            }
        }
        return "";
    }

    function getPreviousQuestionIndex(currentQuestionId:string, questionIndex:number):string {
        const exercise = exercises.find(ex => ex._id === currentQuestionId);
        if (!exercise) return "";

        if (questionIndex > 0) {
            return `${exercise._id}-${questionIndex - 1}`;
        } else {
            const previousExerciseIndex = exercises.findIndex(ex => ex._id === currentQuestionId) - 1;
            if (previousExerciseIndex >= 0) {
                const previousExercise = exercises[previousExerciseIndex];
                return `${previousExercise._id}-${previousExercise.questions.length - 1}`;
            }
        }
        return "";
    }

    function exerciseColor(exerciseId:string, questionId:number, answer:string){
        if(!answer.length) return "text-red-600";

        if(correction?.[exerciseId]){
            const isCorrect = correction[exerciseId][questionId].isCorrect;
            return isCorrect ? "text-green-600" : "text-red-600";
        }

        return "text-blue-600";
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
                // Text inside brackets
                const answer = answers[exercise._id]?.[index] || "";

                let rightSide: ReactNode = null;

                rightSide = <span className="absolute top-0 -right-6 text-[12px] font-medium text-nowrap">
                    <span className={twMerge(!correction[exercise._id]?"":"group-hover:hidden")}>{answer}</span>
                <span className="opacity-0 group-hover:opacity-100 text-green-600">{correction[exercise._id]?.[index].correctAnswer }</span>
                </span>;

                htmlParts.push(
                    <div className={twMerge("relative inline font-normal group", exerciseColor(exercise._id, index, answer))}
                        key={`answer-${i}`}>
                        <Popover open={openedPopover===`${exercise._id}-${index}`} onOpenChange={(open)=>{
                            if (!open) {
                                setOpenedPopover(null);
                            } else{
                                setOpenedPopover(`${exercise._id}-${index}`);
                            }
                        }}>
                            <PopoverTrigger className="font-semibold !rounded-none" tabIndex={index}
                                            onClick={(e)=>{
                                                if(correction[exercise._id]) {
                                                    e.preventDefault();
                                                    return;
                                                }
                                                setOpenedPopover(openedPopover === `${exercise._id}-${index}` ? null : `${exercise._id}-${index}`);
                                            }}
                            >{parts[i]}</PopoverTrigger>
                            <PopoverContent className="z-50 bg-white/80" side="bottom">
                                <PopoverArrow className="popoverArrow"/>
                                <div className="">
                                    <RomajiInput value={answer} setValue={(v)=>{
                                        answerQuestion(exercise._id, index, v);
                                    }} onKeyUp={(e)=>{
                                        //     If tab is pressed, move to next question
                                        if (e.key === "Tab"||e.key === "Enter") {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setOpenedPopover(null);

                                            // If shift is pressed, go to previous question
                                            if (e.shiftKey) {
                                                setTimeout(() => {
                                                    const previousQuestion = getPreviousQuestionIndex(exercise._id, index);
                                                    if (previousQuestion) {
                                                        setOpenedPopover(previousQuestion);
                                                    }
                                                }, 10);
                                                return;
                                            }

                                            setTimeout(() => {
                                                const nextQuestion = getNextQuestionIndex(exercise._id, index);
                                                if (nextQuestion) {
                                                    setOpenedPopover(nextQuestion);
                                                }
                                            }, 10);
                                        }
                                    }}/>
                                </div>
                            </PopoverContent>
                        </Popover>
                        {rightSide}
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