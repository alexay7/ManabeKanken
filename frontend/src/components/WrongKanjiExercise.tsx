import {useState} from "react";
import {twMerge} from "tailwind-merge";
import KanjiAnswerDialog from "@/components/KanjiAnswerDialog.tsx";
import type {ExerciseProps, ExerciseType} from "@/types/exercises.type.ts";
import {useExamStore} from "@/stores/exam-store.ts";

export default function WrongKanjiExercise({answers,answerQuestion,exercises}:ExerciseProps<Extract<ExerciseType, {type:"wrongkanji"}>>){
    const {correction}=useExamStore()

    const [showAnswerDialog, setShowAnswerDialog] = useState<{
        exerciseId:string;
        questionIndex:number;
        question:{text:string,answer:{text:string,kanjis:string[]}}
    } | null>(null);

    function turnTextToHtml(exercise:typeof exercises[number],i:number){
    //     Turn every single kanji into a button that when clicked assigns it as the answer
        return exercise.text.split("").map((char, index) => {
            if (char.match(/[\u4E00-\u9FAF]/)) { // Check if the character is a kanji
                const answer = answers[exercise._id]?.[1] || "";
                return (
                    <button disabled={!!answers[exercise._id] && answers[exercise._id][1].length>0} key={index} className={twMerge("cursor-pointer",answers[exercise._id] && answers[exercise._id].length>=2 && answers[exercise._id][0]===char?!correction[exercise._id]?"text-blue-600! font-semibold":"text-red-600! font-semibold":"",
                        correction[exercise._id]&&char===exercise.answer.wrong ? correction[exercise._id][1].isCorrect ? "text-green-600!":"text-red-600 group":""
                        )} onClick={() => {
                        if(correction[exercise._id]) return;
                        if(char!== exercise.answer.wrong) {
                            answerQuestion(exercise._id, 0, char);
                            answerQuestion(exercise._id, 1, exercise.answer.wrong);
                            return
                        }
                        answerQuestion(exercise._id, 0,char);
                        setShowAnswerDialog({
                            exerciseId: exercise._id,
                            questionIndex: i,
                            question: {
                                text: exercise.text.replaceAll(char,`[${char}]`),
                                answer: {
                                    text: exercise.answer.kanjis.join(""),
                                    kanjis: exercise.answer.kanjis
                                }
                            }
                        });
                    }}>
                        <span className="group-hover:hidden">{answer && exercise.answer.wrong===char?answer:char}</span>
                        <span className="hidden group-hover:inline text-green-600">{correction[exercise._id]?.[1].correctAnswer}</span>
                    </button>
                );
            }
            return <span key={index}>{char}</span>; // Non-kanji characters are displayed normally
        });
    }

    return(
        <div className="w-full flex flex-row-reverse gap-8">
            {showAnswerDialog&&(
                <KanjiAnswerDialog closeDialog={()=>{
                    setShowAnswerDialog(null);
                }} questionIndex={1} questionDetails={showAnswerDialog.question} setAnswer={(v)=>{
                    answerQuestion(showAnswerDialog.exerciseId,1,v)
                }}/>
            )}
            {exercises.map((exercise, i) => (
                <div className="inline-flex vertical-text h-[500px]" key={i}>
                    <p className={answers[exercise._id]?.[0] ? "text-blue-600":"text-red-600"}>{i + 1}</p>
                    <p className="text-lg">{turnTextToHtml(exercise,i)}</p>
                </div>
            ))}
        </div>
    )
}