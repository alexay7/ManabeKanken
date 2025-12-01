import {twMerge} from "tailwind-merge";
import {type ReactNode} from "react";
import {convertFurigana, getJapaneseIndex, renderRadicals} from "@/helpers/general.ts";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import Bracket from "../assets/bracket.svg?react"
import {useExamStore} from "@/stores/exam-store.ts";

export default function ChooseKanjiExercise({answers,answerQuestion,exercises,fontSize}:ExerciseProps<Extract<ExerciseType, {type:"multiplechoose"|"components"|"multiplechoosetext"|"commonkanji"|"definitionschoose"}>>) {
    const {correction}=useExamStore()

    const allSameOptions = exercises.every((a,b)=> {
        if(b === 0) return true;
        return JSON.stringify(a.options) === JSON.stringify(exercises[0].options);
    });

    function exerciseColor(exerciseId:string, questionId:number, answer:string){
        if(!answer.length) return "border-red-600 text-red-600";

        if(correction?.[exerciseId]){
            const isCorrect = correction[exerciseId][questionId].isCorrect;
            return isCorrect ? "border-green-600 text-green-600" : "border-red-600 text-red-600";
        }

        return "border-blue-600 text-blue-600";
    }

    function createKanjiSelectExercise(exercise: Extract<ExerciseType, {type:"multiplechoose"|"definitionschoose"}>): ReactNode {
        const regex = /\[([^\]]+)\]/g;
        return exercise.questions.map((question,index) => {
            //     Replace the brackets with a select
            const parts = question.text.split(regex);
            const answer = answers[exercise._id]?.[index] || "";

            const q = parts.map((part, j) => {
                if (j % 2 === 0) {
                    // Even index, normal text
                    if(!part.length) return null;

                    return <span key={j} className="font-normal text-center vertical-text px-1">{part}</span>;
                } else {
                    const options = exercise.options.length >1 ? exercise.options[index] : exercise.options[0];
                    // Odd index, this is the part with brackets
                    return (
                        <div className="group relative inline">
                            {(exercise.type==="multiplechoose"&&exercise.level!=="7")&&(
                                <p className="inline pb-2">↓</p>
                            )}
                            {!!correction[exercise._id]&&(
                                <p className={twMerge("group-hover:flex hidden absolute text-green-600 justify-center items-center left-0",exercise.type==="multiplechoose"?"top-10":"top-1")}>
                                    {(()=>{
                                        const answerOptionIndex = options.indexOf(correction[exercise._id]?.[index]?.correctAnswer || "");
                                        if(answerOptionIndex===-1) return null;
                                        return getJapaneseIndex(answerOptionIndex);
                                    })()}
                                </p>
                            )}
                        <select disabled={!!correction[exercise._id]}
                            className={twMerge("text-center noarrow w-8 h-8 border-2", exerciseColor(exercise._id, index, answer), !correction[exercise._id]?"":"group-hover:text-white")}
                                key={j}
                                onChange={(e) => answerQuestion(exercise._id,index,e.target.value)}
                                value={answer}
                                style={{writingMode:"horizontal-tb"}}
                        >
                            <option value="" disabled></option>
                            {options.map((option, i) => (
                                <option value={option} key={i}
                                >{getJapaneseIndex(i)}</option>)
                            )};
                        </select>
                            {exercise.type==="definitionschoose"&&(
                                <p className="inline">↓</p>
                            )}
                        </div>
                    );
                }
            })
            return <div className="flex text-2xl vertical-text" key={index}
            >
                <p className="px-2">{exercise.text}</p>
                {q}
            </div>;
        })
    }

    function createComponentSelectExercise(exercise:Extract<ExerciseType, {type:"components"}>
    ): ReactNode {
    return (
        <div className="flex flex-row-reverse gap-4">
            {exercise.texts.map((text, index) => (
                <div key={index} className="flex flex-col gap-8">
                    <p className="font-bold vertical-text text-2xl">{convertFurigana(text.text)}</p>
                    <div className="flex flex-col gap-4">
                        {text.questions.map((_, qIndex) => {
                            const realIndex = index*2+qIndex

                            const answer = answers[exercise._id]?.[realIndex] || "";
                            const optionsIndex = qIndex=== 0 ? 0 : exercise.options[0].length;

                            return (
                                <div key={qIndex} className="flex items-center gap-4 relative">
                                    {index=== 0 && (qIndex === 0 ? (
                                        <p className=" absolute -right-4 font-semibold vertical-text text-xs text-nowrap">部首</p>
                                    ):(
                                        <p className=" absolute -right-4 font-semibold vertical-text text-xs text-nowrap">部首名</p>
                                    ))}
                                    <div className="group relative inline">
                                        {!!correction[exercise._id]&&(
                                            <p className="group-hover:inline hidden absolute text-green-600 justify-center items-center top-1 left-0 bg-white z-20 border-gray-200 border text-center w-full h-max">
                                                <span dangerouslySetInnerHTML={{__html:convertFurigana(correction[exercise._id]?.[realIndex]?.correctAnswer )}}></span>
                                            </p>
                                        )}
                                    <select disabled={!!correction[exercise._id]} className={twMerge("radicals text-center noarrow w-8 h-8 border-2",exerciseColor(exercise._id, realIndex, answer))}
                                            onChange={(e) => answerQuestion(exercise._id,realIndex,e.target.value)}
                                            value={answer}
                                    >
                                        <option value="" disabled></option>
                                        {exercise.options[qIndex].map((option, i) => (
                                            <option value={option} key={i}
                                            >{getJapaneseIndex(optionsIndex+i)}</option>)
                                        )}
                                    </select>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
    }

    function createMultipleTextExercise(exercise: Extract<ExerciseType, {type:"multiplechoosetext"}>): ReactNode {
        return (
            <div className="flex flex-col gap-2">
                <Bracket className="w-full h-[10px]"/>
                <div className="flex flex-row-reverse gap-4">
                    {exercise.questions.map((question,index) => {
                        const text = convertFurigana(question.text);
                        const regex = /\[([^\]]+)\]/g;
                        const parts = text.split(regex);

                        const htmlParts: ReactNode[] = [];
                        const answer = answers[exercise._id]?.[index] || "";

                        for (let i = 0; i < parts.length; i++) {
                            if (i % 2 === 0) {
                                // Normal text
                                htmlParts.push(<span className="font-normal" key={`text-${i}`}>{parts[i]}</span>);
                            } else {
                                htmlParts.push(
                                    <div className="group relative inline">
                                        {!!correction[exercise._id]&&(
                                        <p className="group-hover:flex hidden absolute text-green-600 justify-center items-center top-1 left-0 bg-white z-20 border-gray-200 border text-center w-full">
                                            <span dangerouslySetInnerHTML={{__html:convertFurigana(correction[exercise._id]?.[index]?.correctAnswer )}}></span>
                                        </p>
                                        )}
                                    <select disabled={!!correction[exercise._id]} className={twMerge("radicals text-center noarrow w-8 h-8 border-2",exerciseColor(exercise._id, index, answer))}
                                            onChange={(e) => answerQuestion(exercise._id,index,e.target.value)}
                                            value={answer}
                                    >
                                        <option value="" disabled></option>
                                        {exercise.options[0].map((option, i) => (
                                            <option value={option} key={i}
                                            >{getJapaneseIndex(i)}</option>)
                                        )}
                                    </select>
                                    </div>
                                );
                            }
                        }

                        return (
                            <div className="flex flex-col gap-2" key={question.text}>
                            <span style={{fontSize,lineHeight: fontSize/16+0.5 + "rem"}}
                                  className="inline-block gap-1 vertical-text text-start">
                                {htmlParts}
                            </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    function createCommonKanjiExercise(exercise: Extract<ExerciseType, {type:"commonkanji"}>): ReactNode {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex flex-row-reverse gap-4">
                    {exercise.questions.map((question,index) => {
                        const text = convertFurigana(question.text);
                        const regex = /\[([^\]]+)\]/g;
                        const parts = text.split(regex);

                        const htmlParts: ReactNode[] = [];
                        const answer = answers[exercise._id]?.[index] || "";

                        for (let i = 0; i < parts.length; i++) {
                            if (i % 2 === 0) {
                                // Normal text
                                htmlParts.push(<span className="font-normal" key={`text-${i}`}>{parts[i]}</span>);
                            } else {
                                htmlParts.push(
                                    <div className="group relative inline">
                                        {!!correction[exercise._id]&&(
                                        <p className="group-hover:flex hidden absolute text-green-600 justify-center items-center top-1 left-0 bg-white z-20 border-gray-200 border text-center w-full">
                                            <span dangerouslySetInnerHTML={{__html:convertFurigana(correction[exercise._id]?.[index]?.correctAnswer )}}></span>
                                        </p>
                                        )}
                                    <select disabled={!!correction[exercise._id]} className={twMerge("radicals text-center noarrow w-8 h-8 border-2 mx-1",exerciseColor(exercise._id, index, answer))}
                                            onChange={(e) => answerQuestion(exercise._id,index,e.target.value)}
                                            value={answer}
                                    >
                                        <option value="" disabled></option>
                                        {exercise.options[0].map((option, i) => (
                                            <option value={option} key={i}
                                            >{getJapaneseIndex(i)}</option>)
                                        )}
                                    </select>
                                    </div>
                                );
                            }
                        }

                        return (
                            <div className="flex flex-col gap-2" key={question.text}>
                            <span style={{fontSize,lineHeight: fontSize/16+0.5 + "rem"}}
                                  className="inline-block gap-1 vertical-text text-start">
                                {htmlParts}
                            </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    function renderExercise(exercise:typeof exercises[number]): ReactNode {
        switch(exercise.type){
            case "multiplechoose":
            case "definitionschoose":
                return createKanjiSelectExercise(exercise);
            case "components":
                return createComponentSelectExercise(exercise);
            case "multiplechoosetext":
                return createMultipleTextExercise(exercise);
            case "commonkanji":
                return createCommonKanjiExercise(exercise);
        }
    }

    return (
        <div className={"flex flex-row-reverse gap-8 flex-wrap pr-8"}>
            {allSameOptions && (
                <div className="flex flex-row-reverse gap-2 h-max">
                    {exercises[0].options.map((optiongroup,i) => (
                        <div className="flex flex-row-reverse gap-3 p-4 text-xl border border-black max-w-[270px] flex-wrap justify-center" key={i}>
                            {optiongroup.map((option, index) => (
                                <div className={twMerge("flex items-center gap-1 py-1 font-medium vertical-text")} key={index}>
                                    <p className="text-xs font-bold">{getJapaneseIndex(index+i*optiongroup.length)}</p>
                                    <p className={twMerge("radicals",answers[exercises[0]._id]?.some(x=>x===option) && optiongroup[0].length<8?"line-through":"")}>{renderRadicals(option)}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
            <ul className={twMerge("flex flex-row-reverse gap-8 flex-wrap pr-8",allSameOptions?"w-[350px]":"w-full")}>
            {exercises.map((exercise,i) => (
                <div className="flex flex-row-reverse items-center gap-8" key={i}>
                    <div className="flex flex-row-reverse gap-4">
                        {renderExercise(exercise)}
                    </div>
                    {!allSameOptions && (
                        <div className="flex flex-row-reverse gap-2">
                        {exercise.options.map((optiongroup,i) => (
                        <div className={twMerge("flex  gap-3 p-4 text-xl border border-black max-w-[250px] flex-wrap justify-center",["multiplechoosetext","commonkanji"].includes(exercises[0].type)?"flex-col h-[280px]":"flex-row-reverse")} key={i}>
                            {optiongroup.map((option, index) => (
                                <div className={twMerge("flex items-center gap-1 py-1 font-medium vertical-text")} key={index}>
                                    <p className="text-xs">{getJapaneseIndex(index+i*optiongroup.length)}</p>
                                    <p className={twMerge("radicals",answers[exercise._id]?.some(x=>x===option)?"line-through":"")}>{renderRadicals(option)}</p>
                                </div>
                            ))}
                        </div>
                        ))}
                        </div>
                    )}
                </div>
            ))}
            </ul>
        </div>
    )
}