import {twMerge} from "tailwind-merge";
import RenderKanji from "@/components/RenderKanji.tsx";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import {useExamStore} from "@/stores/exam-store.ts";

export default function StrokeOrderExercise({answers,answerQuestion,exercises}:ExerciseProps<Extract<ExerciseType,{type:"strokeorder"}>>) {
    const screenWidth = window.innerWidth;

    const {correction}=useExamStore()

    function getNextQuestionIndex(currentQuestionId:number, questionIndex:number):string {
        const exercise = exercises[currentQuestionId];
        if (!exercise) return "";

        if(questionIndex === 1 && exercise.multiple) {
            return `${questionIndex}-2`;
        }else{
            const nextExerciseIndex = currentQuestionId + 1;
            if (nextExerciseIndex < exercises.length) {
                return `${nextExerciseIndex}-1`;
            }
        }
        return "";
    }

    function getPreviousQuestionIndex(currentQuestionId:number, questionIndex:number):string {
        const exercise = exercises[currentQuestionId];
        if (!exercise) return "";

        if(questionIndex === 2 && exercise.multiple) {
            return `${currentQuestionId}-1`;
        }else{
            const previousExerciseIndex = currentQuestionId - 1;
            if (previousExerciseIndex >= 0) {
                return `${previousExerciseIndex}-${exercises[previousExerciseIndex].multiple ? 2 : 1}`;
            }
        }
        return "";
    }

    function sortExercises(exs: typeof exercises): typeof exercises {
    //     Get all the exercises where the stroke is null
        const generalExercises = exs.filter(exercise => exercise.stroke === null);
    //     Get all the exercises where the stroke is not null
        const strokeExercises = exs.filter(exercise => exercise.stroke !== null);

        return [...strokeExercises,...generalExercises]
    }

    function exerciseColor(exerciseId:string, questionId:number, answer:string){
        if(!answer.length) return "border-red-600 text-red-600";

        if(correction?.[exerciseId]){
            const isCorrect = correction[exerciseId][questionId].isCorrect;
            return isCorrect ? "border-green-600 text-green-600!" : "border-red-600 text-red-600";
        }

        return "border-blue-600 text-blue-600";
    }

    return(
            <div className="flex flex-row-reverse flex-wrap gap-8 gap-y-2 h-fit max-w-[480px]" style={{width:(screenWidth<768||exercises[0].multiple)?"100%":exercises.length/2 * 80 + "px"}}>
                {sortExercises(exercises).map((exercise,i) => {
                    const exerciseIndex = exercise.multiple ? i * 2 : i;
                    const exAnswers = answers[exercise._id] || exercises.map(() => "");

                    return (
                        <div className="flex flex-col items-center gap-1" key={i}>
                            <RenderKanji kanji={exercise.kanji} strokes={false} boldStroke={exercise.stroke}
                                         width={50} height={50}/>
                            <p className="text-xl font-bold -tracking-tight"
                               style={{writingMode: "vertical-rl"}}>・・・</p>
                            <div className={twMerge("w-[50px] h-[50px] border-2 rounded-full flex relative group",exerciseColor(exercise._id, 0, exAnswers[0]))}>
                                {correction?.[exercise._id] && (
                                <p className="absolute top-1/2 left-1/2 text-3xl rounded-full -translate-1/2 opacity-0 group-hover:opacity-100 text-green-600"> {correction[exercise._id][0].correctAnswer }</p>
                                )}
                                <input readOnly={!!correction[exercise._id]} type="text" className={twMerge("w-full h-full text-center rounded-full text-3xl",Object.keys(correction).length?"group-hover:opacity-0":"")} id={"stroke-order-input-" + i+"-"+"1"}
                                       value={exAnswers[0]}
                                       onChange={(e) => {
                                           // If it is not a number, do not change the value
                                           if (!/^[0-9]*$/.test(e.target.value)) {
                                               return;
                                           }

                                           answerQuestion(exercise._id, 0, e.target.value);
                                       }}
                                       onKeyUp={(e)=>{
                                             // If tab is pressed, move to next question
                                             if (e.key === "Enter") {
                                                  e.preventDefault();
                                                  e.stopPropagation();

                                                    // If shift is pressed, go to previous question
                                                    if (e.shiftKey) {
                                                        const previousQuestion = getPreviousQuestionIndex(i, exerciseIndex);
                                                        if (previousQuestion) {
                                                            const previousInput = document.getElementById(`stroke-order-input-${previousQuestion}`);
                                                            if (previousInput) {
                                                                previousInput.focus();
                                                            }
                                                        }
                                                        return;
                                                    }

                                                  const nextQuestion = getNextQuestionIndex(i, exerciseIndex);
                                                  if (nextQuestion) {
                                                    const nextInput = document.getElementById(`stroke-order-input-${nextQuestion}`);
                                                    if (nextInput) {
                                                         nextInput.focus();
                                                    }
                                                  }
                                             }
                                       }}
                                />
                            </div>
                            {exercise.multiple && (
                                <div className={twMerge("w-[50px] h-[50px] border-2 rounded-full flex relative group",exerciseColor(exercise._id, 1, exAnswers[1]))}>
                                    {correction?.[exercise._id] && (
                                        <p className="absolute top-1/2 left-1/2 text-3xl rounded-full -translate-1/2 opacity-0 group-hover:opacity-100 text-green-600"> {correction[exercise._id][1].correctAnswer }</p>
                                    )}
                                    <input type="text"
                                             id={"stroke-order-input-" + i+"-"+"2"}
                                           className={"w-full h-full text-center rounded-full text-3xl"}
                                           value={exAnswers[1] || ""}
                                           onChange={(e) => {
                                               // If it is not a number, do not change the value
                                               if (!/^[0-9]*$/.test(e.target.value)) {
                                                   return;
                                               }

                                               answerQuestion(exercise._id, 1, e.target.value);
                                           }}/>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
    )
}