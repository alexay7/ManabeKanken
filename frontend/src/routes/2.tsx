import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useEffect, useState} from "react";
import {ExamAPI} from "@/api/exam.ts";
import exerciseInfo from "@/assets/exerciseInfo.json";
import ReadingExercise from "@/components/ReadingExercise.tsx";
import WriteRadicalExercise from "@/components/WriteRadicalExercise.tsx";
import ChooseKanjiExercise from "@/components/ChooseKanjiExercise.tsx";
import WriteKanjiExercise from "@/components/WriteKanjiExercise.tsx";
import GroupWritingExercise from "@/components/GroupWritingExercise.tsx";
import WrongKanjiExercise from "@/components/WrongKanjiExercise.tsx";
import {useExamStore} from "@/stores/exam-store.ts";
import ExamElements from "@/components/ExamElements.tsx";
import ExamResults from "@/components/ExamResults.tsx";

export const Route = createFileRoute('/2')({
  component: Kanken2,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            result: typeof search.result === 'number' ? search.result : undefined,
            strict: typeof search.strict === 'boolean' ? search.strict : false,
        }
    }
})

function Kanken2() {
    const navigate=useNavigate({from:Route.fullPath});

    const {result} = Route.useSearch();

  const [answers, setAnswers] = useState<Record<string, string[]>>({});

    const {exam,setExam,setCorrection,pastResults}=useExamStore();

    useEffect(() => {
        if(result){
            const past = pastResults.find(r=>r.timestamp===result);
            if(past){
                setCorrection(past.correction);
                setAnswers(past.answers);
                setExam(past.exam);
                return;
            }
        }

        setCorrection({});

        if(!exam){
            void navigate({to:"/"});
            return;
        }

        const initialAnswers: Record<string, string[]> = {};
        exam.forEach((exercise) => {
            initialAnswers[exercise._id] = "questions" in exercise ? Array(exercise.questions.length).fill("") : exercise.type==="wrongkanji" ?["",""] : [""];
        });

        setAnswers(localStorage.getItem("currentAnswers") ? JSON.parse(localStorage.getItem("currentAnswers")!) : initialAnswers);
    }, [exam,navigate,pastResults,result,setCorrection,setExam]);

  function answerQuestion(questionId: string, questionIndex:number, answer: string) {
    setAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers };
      if (!newAnswers[questionId]) {
        newAnswers[questionId] = [];
      }
      newAnswers[questionId][questionIndex] = answer;

        localStorage.setItem("currentAnswers",JSON.stringify(newAnswers));

      return newAnswers;
    });
  }

    async function gradeExam(){
        const res = await ExamAPI.gradeExam(answers);

        setCorrection(res);
    }

    if(!exam || !answers || Object.keys(answers).length===0){
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-lg font-semibold">Cargando ejercicios...</p>
            </div>
        );
    }

  return (
      <div className="flex flex-col gap-8 w-full md:px-[100px]">
          <ExamResults answers={answers}/>

        <h1 className="text-center">漢検２級試験</h1>
        {/*    EJERCICIO 1*/}
        <ul className="flex flex-wrap flex-row-reverse gap-x-8 gap-y-12">
            {exam.filter(e=>e.type==="reading").length>0 && (
                <li className="flex flex-row-reverse gap-5 items-start">
                    <div className="vertical-text h-[380px] flex flex-row leading-5 items-start text-sm">
                        <span className="border border-black w-max font-semibold mb-1">1</span>
                        <p>{exerciseInfo["2"][0].statement}</p>
                        <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                            <p className="text-[8px]">({exerciseInfo["2"][0].total})</p>
                            <p className="text-[12px]">{exerciseInfo["2"][0].perQuestion}x{exerciseInfo["2"][0].questions}</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <ReadingExercise exercises={exam.filter(e=>e.type==="reading")} answers={answers} answerQuestion={answerQuestion} fontSize={exerciseInfo["2"][0].fontSize}/>
                    </div>
                </li>
            )}

            {exam.filter(e=>e.type==="writeradical").length>0 && (
                <li className="flex flex-row-reverse gap-5 items-start">
                    <div className="vertical-text h-[380px] flex flex-row leading-5 items-start text-sm">
                        <span className="border border-black w-max font-semibold mb-1">2</span>
                        <p>{exerciseInfo["2"][1].statement}</p>
                        <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                            <p className="text-[8px]">({exerciseInfo["2"][1].total})</p>
                            <p className="text-[12px]">{exerciseInfo["2"][1].perQuestion}x{exerciseInfo["2"][1].questions}</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <WriteRadicalExercise exercises={exam.filter(e=>e.type==="writeradical")} answers={answers} answerQuestion={answerQuestion} fontSize={exerciseInfo["2"][1].fontSize}/>
                    </div>
                </li>
            )}

            {exam.filter(e=>e.type==="multiplechoose").length>0 && (
                <li className="flex flex-row-reverse gap-5 items-start">
                    <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                        <span className="border border-black w-max font-semibold mb-1">3</span>
                        <p>{exerciseInfo["2"][2].statement}</p>
                        <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                            <p className="text-[8px]">({exerciseInfo["2"][2].total})</p>
                            <p className="text-[12px]">{exerciseInfo["2"][2].perQuestion}x{exerciseInfo["2"][2].questions}</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <ChooseKanjiExercise exercises={exam.filter(e=>e.type==="multiplechoose")} answers={answers
                        } answerQuestion={answerQuestion} fontSize={exerciseInfo["2"][2].fontSize}/>
                    </div>
                </li>
            )}

            {exam.filter(e=>e.type==="kanjirelated").length>0 && (
                <li className="flex flex-row-reverse gap-5 items-start">
                    <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                        <span className="border border-black w-max font-semibold mb-1">4</span>
                        <p>{exerciseInfo["2"][3].statement}</p>
                        <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                            <p className="text-[8px]">({exerciseInfo["2"][3].total})</p>
                            <p className="text-[12px]">{exerciseInfo["2"][3].perQuestion}x{exerciseInfo["2"][3].questions}</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <WriteKanjiExercise exercises={exam.filter(e=>e.type==="kanjirelated")} answers={answers
                        } answerQuestion={answerQuestion} fontSize={exerciseInfo["2"][3].fontSize}/>
                    </div>
                </li>
            )}

            {exam.filter(e=>e.type==="definitionschoose").length>0 && (
                <li className="flex flex-row-reverse gap-5 items-start">
                    <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                        <span className="border border-black w-max font-semibold mb-1">5</span>
                        <p>{exerciseInfo["2"][4].statement}</p>
                        <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                            <p className="text-[8px]">({exerciseInfo["2"][4].total})</p>
                            <p className="text-[12px]">{exerciseInfo["2"][4].perQuestion}x{exerciseInfo["2"][4].questions}</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <ChooseKanjiExercise exercises={exam.filter(e=>e.type==="definitionschoose")} answers={answers
                        } answerQuestion={answerQuestion} fontSize={exerciseInfo["2"][4].fontSize}/>
                    </div>
                </li>
            )}

            {exam.filter(e=>e.type==="synonyms").length>0 && (
                <li className="flex flex-row-reverse gap-5 items-start">
                    <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                        <span className="border border-black w-max font-semibold mb-1">6</span>
                        <p>{exerciseInfo["2"][5].statement}</p>
                        <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                            <p className="text-[8px]">({exerciseInfo["2"][5].total})</p>
                            <p className="text-[12px]">{exerciseInfo["2"][5].perQuestion}x{exerciseInfo["2"][5].questions}</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <WriteKanjiExercise exercises={exam.filter(e=>e.type==="synonyms")} answers={answers
                        } answerQuestion={answerQuestion} fontSize={exerciseInfo["2"][5].fontSize}/>
                    </div>
                </li>
            )}

            {exam.filter(e=>e.type==="groupwriting").length>0 && (
                <li className="flex flex-row-reverse gap-5 items-start">
                    <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                        <span className="border border-black w-max font-semibold mb-1">7</span>
                        <p>{exerciseInfo["2"][6].statement}</p>
                        <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                            <p className="text-[8px]">({exerciseInfo["2"][6].total})</p>
                            <p className="text-[12px]">{exerciseInfo["2"][6].perQuestion}x{exerciseInfo["2"][6].questions}</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <GroupWritingExercise exercises={exam.filter(e=>e.type==="groupwriting")} answers={answers
                        } answerQuestion={answerQuestion} fontSize={exerciseInfo["2"][6].fontSize}/>
                    </div>
                </li>
            )}

            {exam.filter(e=>e.type==="wrongkanji").length>0 && (
                <li className="flex flex-row-reverse gap-5 items-start">
                    <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                        <span className="border border-black w-max font-semibold mb-1">8</span>
                        <p>{exerciseInfo["2"][7].statement}</p>
                        <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                            <p className="text-[8px]">({exerciseInfo["2"][7].total})</p>
                            <p className="text-[12px]">{exerciseInfo["2"][7].perQuestion}x{exerciseInfo["2"][7].questions}</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <WrongKanjiExercise exercises={exam.filter(e=>e.type==="wrongkanji")} answers={answers
                        } answerQuestion={answerQuestion} fontSize={exerciseInfo["2"][7].fontSize}/>
                    </div>
                </li>
            )}

            {exam.filter(e=>e.type==="okurigana").length>0 && (
                <li className="flex flex-row-reverse gap-5 items-start">
                    <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                        <span className="border border-black w-max font-semibold mb-1">9</span>
                        <p>{exerciseInfo["2"][8].statement}</p>
                        <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                            <p className="text-[8px]">({exerciseInfo["2"][8].total})</p>
                            <p className="text-[12px]">{exerciseInfo["2"][8].perQuestion}x{exerciseInfo["2"][8].questions}</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <WriteKanjiExercise exercises={exam.filter(e=>e.type==="okurigana")} answers={answers
                        } answerQuestion={answerQuestion} fontSize={exerciseInfo["2"][8].fontSize}/>
                    </div>
                </li>
            )}

            {exam.filter(e=>e.type==="textsquares").length>0 && (
                <li className="flex flex-row-reverse gap-5 items-start">
                    <div className="vertical-text flex h-[380px] flex-row leading-5 items-start text-sm">
                        <span className="border border-black w-max font-semibold mb-1">10</span>
                        <p>{exerciseInfo["2"][9].statement}</p>
                        <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                            <p className="text-[8px]">({exerciseInfo["2"][9].total})</p>
                            <p className="text-[12px]">{exerciseInfo["2"][9].perQuestion}x{exerciseInfo["2"][9].questions}</p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <WriteKanjiExercise exercises={exam.filter(e=>e.type==="textsquares")} answers={answers
                        } answerQuestion={answerQuestion} fontSize={exerciseInfo["2"][9].fontSize}/>
                    </div>
                </li>
            )}
        </ul>

          <ExamElements gradeExam={gradeExam} initialTime={localStorage.getItem("examTime") ? Number(localStorage.getItem("examTime")) : 60*60}/>
      </div>
  )
}
