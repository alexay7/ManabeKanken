import {type ReactNode, useState} from "react";
import RomajiInput from "@/components/RomajiInput.tsx";
import {convertFurigana} from "@/helpers/general.ts";
import {twMerge} from "tailwind-merge";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {PopoverArrow} from "@radix-ui/react-popover";
import {useExamStore} from "@/stores/exam-store.ts";

export default function ReadingExercise({answers,answerQuestion,exercises,fontSize}:ExerciseProps<Extract<ExerciseType, {type:"reading"}>>) {
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
        if(!answer.length) return "border-red-600 text-red-600";

        if(correction?.[exerciseId]){
            const isCorrect = correction[exerciseId][questionId].isCorrect;
            return isCorrect ? "border-green-600 text-green-600" : "border-red-600 text-red-600";
        }

        return "border-blue-600 text-blue-600";
    }

    function createExercise(exercise: typeof exercises[number]): ReactNode {
        const text = convertFurigana(exercise.text).replaceAll(" ","")
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

                let rightSide:ReactNode = null;

                rightSide = <span style={{right: -fontSize-2}} className="absolute top-0 text-[12px] font-medium text-nowrap pointer-events-none">
                    <span className={twMerge(!correction[exercise._id]?"":"group-hover:hidden")}>{answer}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-green-600">{correction[exercise._id]?.[questionIndex].correctAnswer }</span>
                </span>;

                htmlParts.push(
                    <div className={twMerge("relative inline font-normal border-r-2 -mr-2 group", exerciseColor(exercise._id, questionIndex, answer)
                        )} key={`answer-${i}`}>
                        <Popover open={openedPopover===`${exercise._id}-${questionIndex}`} onOpenChange={(open)=>{
                            // If the answers ends with n, change it to ん
                            if (answer.endsWith("n")) {
                                answerQuestion(exercise._id, questionIndex, answer.slice(0, -1) + "ん");
                            }
                            if (!open) {
                                setOpenedPopover(null);
                            } else{
                                setOpenedPopover(`${exercise._id}-${questionIndex}`);
                            }
                        }}>
                            <PopoverTrigger className="font-semibold !rounded-none" tabIndex={questionIndex}
                                onClick={(e)=>{
                                    if(correction[exercise._id]) {
                                        e.preventDefault();
                                        return;
                                    }
                                    setOpenedPopover(openedPopover === `${exercise._id}-${questionIndex}` ? null : `${exercise._id}-${questionIndex}`);
                                }}
                            >{parts[i]}</PopoverTrigger>
                            <PopoverContent className="z-50 bg-white/80" side="bottom">
                                <PopoverArrow className="popoverArrow"/>
                                    <RomajiInput value={answer} setValue={(v)=>{
                                        answerQuestion(exercise._id, questionIndex, v);
                                    }} onKeyUp={(e)=>{
                                    //     If tab is pressed, move to next question
                                        if (e.key === "Tab"||e.key === "Enter") {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setOpenedPopover(null);

                                            // If shift is pressed, go to previous question
                                            if (e.shiftKey) {
                                                setTimeout(() => {
                                                    const previousQuestion = getPreviousQuestionIndex(exercise._id, questionIndex);
                                                    if (previousQuestion) {
                                                        setOpenedPopover(previousQuestion);
                                                    }
                                                }, 10);
                                                return;
                                            }

                                            setTimeout(() => {
                                                const nextQuestion = getNextQuestionIndex(exercise._id, questionIndex);
                                                if (nextQuestion) {
                                                    setOpenedPopover(nextQuestion);
                                                }
                                            }, 10);
                                        }
                                    }}/>
                            </PopoverContent>
                        </Popover>
                        {rightSide}
                    </div>
                );
            }
        }

        return <span style={{fontSize,lineHeight: fontSize/16+0.75 + "rem"}}
                     className="inline-block gap-1 vertical-text text-start">
            {htmlParts}
        </span>;
    }

    return (
        <div className="flex flex-row-reverse flex-wrap gap-6">
            {exercises.map((exercise, index) => {
                return (
                    <div className="flex flex-col relative" key={exercise._id}>
                        <div className="flex flex-row-reverse gap-6">
                            <div className={twMerge("flex items-center flex-col gap-2")} key={`question-${index}`}>
                                <p className="font-semibold text-center">{index+1}</p>
                                <div className="text-left w-full vertical-text h-[350px]">
                                    {createExercise(exercise)}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}