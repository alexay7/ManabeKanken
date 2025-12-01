import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {ExamAPI} from "@/api/exam.ts";
import {useEffect, useState} from "react";
import exerciseInfo from "@/assets/exerciseInfo.json";
import ReadingExercise from "@/components/ReadingExercise.tsx";
import StrokeOrderExercise from "@/components/StrokeOrderExercise.tsx";
import WriteKanjiExercise from "@/components/WriteKanjiExercise.tsx";
import GroupWritingExercise from "@/components/GroupWritingExercise.tsx";
import GroupReadingExercise from "@/components/GroupReadingExercise.tsx";
import {useExamStore} from "@/stores/exam-store.ts";
import ExamElements from "@/components/ExamElements.tsx";
import ExamResults from "@/components/ExamResults.tsx";

export const Route = createFileRoute('/8')({
  component: Kanken8,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            result: typeof search.result === 'number' ? search.result : undefined,
            strict: typeof search.strict === 'boolean' ? search.strict : false,
        }
    }
})

function Kanken8() {
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
            initialAnswers[exercise._id] = "questions" in exercise ? Array(exercise.questions.length).fill("") : [""];
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

          <h1 className="text-center">漢検８級試験</h1>
          {/*    EJERCICIO 1*/}
          <ul className="flex flex-wrap flex-row-reverse gap-x-8 gap-y-12">
              {exam.filter(e=>e.type==="reading").length>0 && (
                  <li className="flex flex-row-reverse gap-5 items-start">
                      <div className="vertical-text h-[380px] flex flex-row leading-5 items-start text-sm">
                          <span className="border border-black w-max font-semibold mb-1">1</span>
                          <p>{exerciseInfo["8"][0].statement}</p>
                          <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                              <p className="text-[8px]">({exerciseInfo["8"][0].total})</p>
                              <p className="text-[12px]">{exerciseInfo["8"][0].perQuestion}x{exerciseInfo["8"][0].questions}</p>
                          </div>
                      </div>
                      <div className="mt-2">
                          <ReadingExercise exercises={exam.filter(e=>e.type==="reading")} answers={answers} answerQuestion={answerQuestion} fontSize={exerciseInfo["9"][0].fontSize}/>
                      </div>
                  </li>
              )}

              {exam.filter(e=>e.type==="strokeorder").length>0 && (
                  <li className="flex flex-row-reverse gap-5 items-start">
                      <div className="vertical-text flex h-[380px] flex-row leading-5 items-start text-sm">
                          <span className="border border-black w-max font-semibold mb-1">2</span>
                          <p>{exerciseInfo["8"][1].statement}</p>
                          <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                              <p className="text-[8px]">({exerciseInfo["8"][1].total})</p>
                              <p className="text-[12px]">{exerciseInfo["8"][1].perQuestion}x{exerciseInfo["8"][1].questions}</p>
                          </div>
                      </div>
                      <div className="mt-2">
                          <StrokeOrderExercise exercises={exam.filter(e=>e.type==="strokeorder")} answers={answers} answerQuestion={answerQuestion} fontSize={exerciseInfo["9"][1].fontSize}/>
                      </div>
                  </li>
              )}

              {exam.filter(e=>e.type==="kanjirelated").length>0 && (
                  <li className="flex flex-row-reverse gap-5 items-start">
                      <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                          <span className="border border-black w-max font-semibold mb-1">3</span>
                          <p>{exerciseInfo["8"][2].statement}</p>
                          <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                              <p className="text-[8px]">({exerciseInfo["8"][2].total})</p>
                              <p className="text-[12px]">{exerciseInfo["8"][2].perQuestion}x{exerciseInfo["8"][2].questions}</p>
                          </div>
                      </div>
                      <div className="mt-2">
                          <WriteKanjiExercise exercises={exam.filter(e=>e.type==="kanjirelated")} answers={answers
                          } answerQuestion={answerQuestion} fontSize={exerciseInfo["8"][2].fontSize}/>
                      </div>
                  </li>
              )}

              {exam.filter(e=>e.type==="kanjicomponents").length>0 && (
                  <li className="flex flex-row-reverse gap-5 items-start">
                      <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                          <span className="border border-black w-max font-semibold mb-1">4</span>
                          <p>{exerciseInfo["8"][3].statement}</p>
                          <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                              <p className="text-[8px]">({exerciseInfo["8"][3].total})</p>
                              <p className="text-[12px]">{exerciseInfo["8"][3].perQuestion}x{exerciseInfo["8"][3].questions}</p>
                          </div>
                      </div>
                      <div className="mt-2">
                          <WriteKanjiExercise exercises={exam.filter(e=>e.type==="kanjicomponents")} answers={answers
                          } answerQuestion={answerQuestion} fontSize={exerciseInfo["8"][3].fontSize}/>
                      </div>
                  </li>
              )}

              {exam.filter(e=>e.type==="groupwriting").length>0 && (
                    <li className="flex flex-row-reverse gap-5 items-start">
                        <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                            <span className="border border-black w-max font-semibold mb-1">5</span>
                            <p>{exerciseInfo["8"][4].statement}</p>
                            <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                                <p className="text-[8px]">({exerciseInfo["8"][4].total})</p>
                                <p className="text-[12px]">{exerciseInfo["8"][4].perQuestion}x{exerciseInfo["8"][4].questions}</p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <GroupWritingExercise exercises={exam.filter(e=>e.type==="groupwriting")} answers={answers
                            } answerQuestion={answerQuestion} fontSize={exerciseInfo["8"][4].fontSize}/>
                        </div>
                    </li>
              )}

              {exam.filter(e=>e.type==="okurigana").length>0 && (
                    <li className="flex flex-row-reverse gap-5 items-start">
                        <div className="vertical-text flex h-[450px] flex-row leading-5 items-start text-sm">
                            <span className="border border-black w-max font-semibold mb-1">6</span>
                            <p>{exerciseInfo["8"][5].statement}</p>
                            <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                                <p className="text-[8px]">({exerciseInfo["8"][5].total})</p>
                                <p className="text-[12px]">{exerciseInfo["8"][5].perQuestion}x{exerciseInfo["8"][5].questions}</p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <WriteKanjiExercise exercises={exam.filter(e=>e.type==="okurigana")} answers={answers
                            } answerQuestion={answerQuestion} fontSize={exerciseInfo["8"][5].fontSize}/>
                        </div>
                    </li>
                )}

              {exam.filter(e=>e.type==="groupreading").length>0 && (
                  <li className="flex flex-row-reverse gap-5 items-start">
                      <div className="vertical-text h-[380px] flex flex-row leading-5 items-start text-sm">
                          <span className="border border-black w-max font-semibold mb-1">7</span>
                          <p>{exerciseInfo["8"][6].statement}</p>
                          <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                              <p className="text-[8px]">({exerciseInfo["8"][6].total})</p>
                              <p className="text-[12px]">{exerciseInfo["8"][6].perQuestion}x{exerciseInfo["8"][6].questions}</p>
                          </div>
                      </div>
                      <div className="mt-2">
                          <GroupReadingExercise exercises={exam.filter(e=>e.type==="groupreading")} answers={answers} answerQuestion={answerQuestion} fontSize={exerciseInfo["9"][4].fontSize}/>
                      </div>
                  </li>
              )}

              {exam.filter(e=>e.type==="textsquares").length>0 && (
                  <li className="flex flex-row-reverse gap-5 items-start">
                      <div className="vertical-text flex h-[380px] flex-row leading-5 items-start text-sm">
                          <span className="border border-black w-max font-semibold mb-1">8</span>
                          <p>{exerciseInfo["8"][7].statement}</p>
                          <div className="flex flex-col text-center font-semibold" style={{writingMode:"horizontal-tb"}}>
                              <p className="text-[8px]">({exerciseInfo["8"][7].total})</p>
                              <p className="text-[12px]">{exerciseInfo["8"][7].perQuestion}x{exerciseInfo["8"][7].questions}</p>
                          </div>
                      </div>
                      <div className="mt-2">
                          <WriteKanjiExercise exercises={exam.filter(e=>e.type==="textsquares")} answers={answers
                          } answerQuestion={answerQuestion} fontSize={exerciseInfo["8"][7].fontSize}/>
                      </div>
                  </li>
              )}
          </ul>

          <ExamElements gradeExam={gradeExam} initialTime={localStorage.getItem("examTime") ? Number(localStorage.getItem("examTime")) : 40*60}/>
      </div>
  )
}
