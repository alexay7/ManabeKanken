import {Fragment, type ReactNode, useState} from "react";
import {twMerge} from "tailwind-merge";
import KanjiAnswerDialog from "@/components/KanjiAnswerDialog.tsx";
import {convertFurigana} from "@/helpers/general.ts";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import {useExamStore} from "@/stores/exam-store.ts";

export default function WriteKanjiExercise({answers,answerQuestion,exercises}:ExerciseProps<Extract<ExerciseType, {type:"kanjirelated"|"textsquares"|"kanjicomponents"|"okurigana"|"kanjirelatedgroup"|"completekanji"|"synonyms"}>>) {
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

    function createKanjiTextExercise(exercise:Extract<ExerciseType, { type: "textsquares" }>
    ): ReactNode {
        const regex = /\[([^\]]+)\]/g;
        const parts = exercise.text.split(regex);
        const htmlParts: ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Normal text
                htmlParts.push(<span className="font-normal" key={`text-${i}`}
                >{parts[i]}</span>);
            } else {
                const questionNum = Math.floor(i / 2);

                const answer = answers[exercise._id]?.[questionNum] || "";

                // Input box with text at the right
                htmlParts.push(
                    <div className={twMerge("w-8 min-h-8 border-2 relative inline-flex mx-1 group",exerciseColor(exercise._id, questionNum, answer))}
                         style={{height:answer.length*1.5+"em"}} key={`part-${i}`}>
                        <p className={twMerge("absolute top-0 -right-9 text-[12px] pointer-events-none font-semibold text-nowrap")}>{parts[i]}</p>
                        <button disabled={!!answer.length} className={twMerge("w-full h-full text-center text-2xl !p-0 bg-transparent",!answer.length?"border-red-600":"border-blue-600")}
                               onClick={() => {
                                    if(correction?.[exercise._id]) return;
                                      setShowAnswerDialog({
                                        exerciseId: exercise._id,
                                        questionIndex: questionNum,
                                        question: {
                                            text: exercise.text,
                                            answer:{
                                                text: "",
                                                kanjis: exercise.questions[questionNum].answer.kanjis
                                            }
                                        }
                                      });

                               }}
                        >
                            <span className={twMerge(!correction[exercise._id]?"":"group-hover:hidden")}>{answer}</span>
                            <span className="opacity-0 group-hover:opacity-100 text-green-600 flex bg-white border border-gray-200 h-max">{correction[exercise._id]?.[questionNum].correctAnswer }</span>
                        </button>
                    </div>
                );
            }
        }

        return <div className="inline-block text-2xl leading-13">{htmlParts}</div>;
    }

    function createKanjiExercise(exerciseId:string, exerciseText:string, question:Extract<ExerciseType, { type:"kanjirelated"|"completekanji" }>["questions"][number],index:number): ReactNode {
        if(!question.text){
            return <p className="text-red-600">No hay texto para esta pregunta</p>;
        }

        const regex = /\[([^\]]+)\]/g;
        const parts = question.text.split(regex);
        const htmlParts: ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {

            if (i % 2 === 0) {
                // Normal text
                htmlParts.push(<span key={i}>{parts[i]}</span>);
            } else {
                const answer = answers[exerciseId]?.[index] || "";
                // Input box with text at the right
                htmlParts.push(
                    <div className={twMerge("w-8 min-h-8 border-2 relative inline-flex mx-1 group",exerciseColor(exerciseId, index, answer))}
                         style={{height:answer.length*1.5+"em"}} key={`part-${i}`}>
                        <p className={twMerge("absolute -top-1 -right-9 text-[12px] pointer-events-none font-semibold text-nowrap")}>{parts[i]}</p>
                        <button disabled={!!answer.length} className={twMerge("w-full h-full text-center text-2xl !p-0 bg-transparent",!answer.length?"border-red-600":"border-blue-600")}
                                onClick={() => {
                                    if(correction?.[exerciseId]) return;
                                    setShowAnswerDialog({
                                        exerciseId,
                                        questionIndex: index,
                                        question:{
                                            text: exerciseText+question.text,
                                            answer:{
                                                text: "",
                                                kanjis: question.answer.kanjis
                                            }
                                        }
                                    });
                                }}
                        >
                            <span className={twMerge(!correction[exerciseId]?"":"group-hover:hidden")}>{answer}</span>
                            <span className="opacity-0 group-hover:opacity-100 text-green-600 bg-white border border-gray-200 h-max flex">{correction[exerciseId]?.[index].correctAnswer }</span>
                        </button>
                    </div>
                );
            }
        }

        return <div className="inline-block text-2xl leading-12">{htmlParts}</div>;
    }

    function createOkuriganaExercise(exercise:Extract<ExerciseType, { type:"okurigana" }>): ReactNode {
    //     Poner las partes entre corchetes en negrita y subrayadas
        const regex = /\[([^\]]+)\]/g;
        const parts = exercise.text.split(regex);
        const htmlParts: ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
            //     Poner las cosas entre asteriscos en negrita
                htmlParts.push(<span key={i}>{parts[i]}</span>);
            } else {
                const questionNum = Math.floor(i / 2);

                const answer = answers[exercise._id]?.[questionNum] || "";


                // Input box with text at the right
                htmlParts.push(
                        <button disabled={!!answer.length} className={twMerge("text-center text-2xl !p-0 bg-transparent font-semibold underline -underline-offset-[1ch] group", exerciseColor(exercise._id, questionNum, answer))} key={`part-${i}`}
                                onClick={() => {
                                    if(correction?.[exercise._id]) return;
                                    setShowAnswerDialog({
                                        exerciseId: exercise._id,
                                        questionIndex: questionNum,
                                        question: {
                                            text: exercise.text,
                                            ...exercise.questions[questionNum]
                                        }
                                    });
                                }}
                        >
                            <p className="vertical-text">
                                <span className={twMerge(!correction[exercise._id]?"":"group-hover:hidden")}>{answer||parts[i]}</span>
                                <span className="hidden group-hover:inline text-green-600">{correction[exercise._id]?.[questionNum].correctAnswer }</span></p>
                        </button>
                );
            }
        }

        return <div className="text-2xl leading-12">{htmlParts}</div>;
    }

    function createSynonymsExercise(exercise:Extract<ExerciseType, { type:"synonyms" }>,question:Extract<ExerciseType, { type:"synonyms" }>["questions"][number],index:number): ReactNode {
        const regex = /\[([^\]]+)\]/g;
        const parts = question.text.split(regex);
        const htmlParts: ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Normal text
                htmlParts.push(<span key={i}>{parts[i]}</span>);
            } else {
                const answer = answers[exercise._id]?.[index] || "";
                // Input box with text at the right
                htmlParts.push(
                    <div className={twMerge("w-8 min-h-8 border-2 relative inline-flex mx-1 group",exerciseColor(exercise._id, index, answer))}
                         style={{height:answer.length*1.5+"em"}} key={`part-${i}`}>
                        <p className={twMerge("absolute -top-1 -right-9 text-[12px] pointer-events-none font-semibold text-nowrap")}>{parts[i]}</p>
                        <button disabled={!!answer.length} className={twMerge("w-full h-full text-center text-2xl !p-0 bg-transparent",!answer.length?"border-red-600":"border-blue-600")}
                                onClick={() => {
                                    setShowAnswerDialog({
                                        exerciseId: exercise._id,
                                        questionIndex: index,
                                        question:{
                                            text: question.text,
                                            answer:{
                                                text: "",
                                                kanjis: question.answer.kanjis
                                            }
                                        }
                                    });
                                }}
                        >
                            <span className={twMerge(!correction[exercise._id]?"":"group-hover:hidden")}>{answer}</span>
                            <span className="hidden group-hover:flex text-green-600 h-max bg-white border border-gray-200">{correction[exercise._id]?.[index].correctAnswer }</span>
                    </button>
                    </div>
                );
            }
        }

        return <div className="inline-block text-2xl leading-12">{htmlParts}</div>;
    }

    function renderExercise(exercise: typeof exercises[number]) {
         if (exercise.type === "textsquares") {
            return (
                <div className="flex flex-row-reverse flex-wrap items-center gap-2">
                    <div className="h-[350px] vertical-text">
                        {createKanjiTextExercise(exercise)}
                    </div>
                </div>
            );
        } else if (exercise.type === "kanjirelated" || exercise.type === "kanjicomponents" || exercise.type === "completekanji") {
            return (
                <div className="flex flex-row-reverse flex-wrap gap-4">
                    <div className={twMerge("flex items-center",exercise.text ? "flex-col":"flex-row-reverse flex-wrap gap-4 gap-y-8 justify-start")}>
                        {exercise.text&&(
                        <p className={twMerge("vertical-text text-2xl",exercise.type==="kanjicomponents"?"radicals":"")} dangerouslySetInnerHTML={{__html:convertFurigana(exercise.text.replace("－",""))}}></p>
                        )}

                        {/*Put points between every question*/}
                        {exercise.questions.map((question, index) => (
                            <Fragment key={index}>
                                {exercise.text?.length?(
                                    <p className="text-lg" style={{writingMode:"vertical-rl"}}>{exercise.divider?"・・・":""}</p>
                                ):null}
                                <div className="vertical-text">
                                    {createKanjiExercise(exercise._id, exercise.text||"", question, index)}
                                </div>
                            </Fragment>
                        ))}
                    </div>
                    {exercise.hint && (
                        <div className="inline items-center gap-2 vertical-text border border-black px-2 h-[400px]">
                            {exercise.hint.split(" ").map((line,idx)=> (
                                <p className="text-lg inline select-none px-3 cursor-pointer first:px-0" key={idx} id={`synonym-hint-line-${idx}`}
                                   onClick={()=> {
                                       // Strike through the line when clicked
                                       const element = document.getElementById(`synonym-hint-line-${idx}`);
                                       if (element) {
                                           if (element.style.textDecoration === "line-through") {
                                               element.style.textDecoration = "none";
                                           } else {
                                               element.style.textDecoration = "line-through";
                                           }
                                       }
                                   }
                                   }>{line}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        else if (exercise.type === "okurigana") {
            return (
                <div className="flex flex-row-reverse flex-wrap gap-4">
                    <div className="vertical-text inline-flex items-center">
                        {createOkuriganaExercise(exercise)}
                    </div>
                </div>
            );
        }else if (exercise.type === "kanjirelatedgroup") {
            return (
                <div className="flex flex-row-reverse flex-wrap gap-4 items-center">
                    <div className="flex flex-row-reverse items-center gap-1">
                        {exercise.questions.map((question, index) => (
                            <Fragment key={index}>
                                <div className="vertical-text">
                                    {createKanjiExercise(exercise._id, "", question, index)}
                                </div>
                            </Fragment>
                        ))}
                    </div>

                    <div className="inline text-center items-center gap-2 vertical-text border border-black px-2 h-[400px]">
                    {exercise.hint.split(" ").map((line,idx)=> (
                        <p className="text-lg inline select-none px-3 cursor-pointer first:px-0" key={idx} id={`synonym-hint-line-${idx}`}
                           onClick={()=> {
                               // Strike through the line when clicked
                               const element = document.getElementById(`synonym-hint-line-${idx}`);
                               if (element) {
                                   if (element.style.textDecoration === "line-through") {
                                       element.style.textDecoration = "none";
                                   } else {
                                       element.style.textDecoration = "line-through";
                                   }
                               }
                           }
                           }>{line}</p>
                    ))}
                    </div>
                </div>
            )
             }
        else if (exercise.type === "synonyms") {
            const allSynonymsExercises = exercises.filter(e=>e.type==="synonyms");

            const allSameHints = allSynonymsExercises.every(e=>e.hint===allSynonymsExercises[0].hint);

             return (
                 <div className="flex flex-row-reverse gap-4 items-center w-min">
                     <div className="flex flex-row-reverse flex-wrap gap-4 items-center gap-y-12">
                         {exercise.group==="類"&&(
                         <div className="flex flex-row-reverse items-center gap-2">
                             {/*Put points between every question*/}
                             <p className="vertical-text border-2 px-2 py-1 border-black font-semibold mr-4">類義語</p>
                             {exercise.questions.map((question, index) => (
                                 <div className="vertical-text" key={index}>
                                     {createSynonymsExercise(exercise,question,index)}
                                 </div>
                             ))}
                         </div>
                         )}

                         {exercise.group==="対"&&(
                             <div className="flex flex-row-reverse items-center gap-2">
                                 {/*Put points between every question*/}
                                 <p className="vertical-text border-2 px-2 py-1 border-black font-semibold mr-4">対義語</p>
                                 {exercise.questions.map((question, index) => (
                                     <div className="vertical-text" key={index}>
                                         {createSynonymsExercise(exercise,question,index)}
                                     </div>
                                 ))}
                             </div>
                         )}
                     </div>
                     {(!allSameHints&&exercise.hint) && (
                         <div className="inline text-center items-center gap-2 vertical-text border border-black px-2 h-[400px]">
                             {exercise.hint.split(" ").map((line,idx)=> (
                                 <p className="text-lg inline select-none px-3 cursor-pointer first:px-0" key={idx} id={`synonym-${exercise.group}-hint-line-${idx}`}
                                    onClick={()=> {
                                        // Strike through the line when clicked
                                        const element = document.getElementById(`synonym-${exercise.group}-hint-line-${idx}`);
                                        if (element) {
                                            if (element.style.textDecoration === "line-through") {
                                                element.style.textDecoration = "none";
                                            } else {
                                                element.style.textDecoration = "line-through";
                                            }
                                        }
                                    }
                                    }>{line}</p>
                             ))}
                         </div>
                     )}
                     {allSameHints && exercise.group==="対"&&(
                            <div className="flex flex-col items-center gap-2 vertical-text border border-black px-2 h-[400px]">
                                <div className="inline items-center gap-2 vertical-text border border-black px-2 h-[400px]">
                                   {exercise.hint.split(" ").map((line,idx)=> (
                                       <p className="text-lg inline select-none px-3 cursor-pointer first:px-0" key={idx} id={`synonym-hint-line-${idx}`}
                                            onClick={()=> {
                                                // Strike through the line when clicked
                                                const element = document.getElementById(`synonym-hint-line-${idx}`);
                                                if (element) {
                                                    if (element.style.textDecoration === "line-through") {
                                                        element.style.textDecoration = "none";
                                                    } else {
                                                        element.style.textDecoration = "line-through";
                                                    }
                                                }
                                            }
                                            }>{line}</p>
                                       ))}
                                </div>
                            </div>
                     )}
                 </div>
             );
         }
        }

    return (
        <div className="flex flex-col gap-4">
            {showAnswerDialog&&(
            <KanjiAnswerDialog closeDialog={()=>{
                setShowAnswerDialog(null);
            }} questionIndex={showAnswerDialog.questionIndex} questionDetails={showAnswerDialog.question} setAnswer={(v)=>{
                answerQuestion(showAnswerDialog.exerciseId,showAnswerDialog.questionIndex,v)
            }}/>
                )}
            {exercises.length>0&&(
            <div className="flex flex-row-reverse gap-y-8 gap-4 flex-wrap">
                {exercises.map((exercise) => (
                    <div className="flex flex-row-reverse gap-4 justify-center" key={exercise._id}>
                        {renderExercise(exercise)}
                    </div>
                ))}
            </div>
            )}
        </div>
    );
}