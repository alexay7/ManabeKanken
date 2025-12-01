import {useExamStore} from "@/stores/exam-store.ts";
import exerciseInfo from "@/assets/exerciseInfo.json";
import {twMerge} from "tailwind-merge";
import {Button} from "@/components/ui/button.tsx";
import RadarChart from "@/components/RadarChart.tsx";
import {Link} from "@tanstack/react-router";

type ExamResultsProps = {
    answers: Record<string, string[]>;
}

export default function ExamResults({answers}: ExamResultsProps){
    const {correction,exam,addPastResult}=useExamStore()

    const username = localStorage.getItem("username");
    const level = location.pathname.split("/").pop();

    if(Object.keys(correction).length===0||!level) return null;

    const totalScore = exam!.reduce((acc,e)=>{
        const answers = correction[e._id] || [];
        const correctCount = answers.filter(a=>a.isCorrect).length;
        return acc + correctCount * exerciseInfo[level! as keyof typeof exerciseInfo][e.exerciseIndex-1].perQuestion;
    },0);

    const totalPossibleScore = exam!.reduce((acc,e)=>{
        const answers = correction[e._id] || [];
        return acc + answers.length * exerciseInfo[level! as keyof typeof exerciseInfo][e.exerciseIndex-1].perQuestion;
    },0);

    const multiplier = (["10","9","8","2","pre1","1"].includes(level)) ? 0.8 : 0.7;

    function resultText(score:number){
        const passScore = Math.floor(totalPossibleScore*multiplier);
        if(score>=passScore){
            return "合格おめでとうございます。";
        } else{
            return `合格まであと${Math.max(0,Math.floor(totalPossibleScore*multiplier)-totalScore)}点です。`
        }
    }

    return(
        <div className="border-b-3 border-dashed pb-4">
            <h2 className="text-center text-4xl font-bold">結果発表</h2>
            <div className="flex gap-4">
                <div className="flex flex-col flex-1">
                    <table className="[&>*>*>*]:border-[#75926b]! border-[#569247] border-3">
                        <thead>
                        <tr className="[&>th]:p-0! [&>th]:bg-[#95b954bf]">
                            <th className="border px-4 py-2 text-center! w-[100px]">受験級</th>
                            <th className="border px-4 py-2 text-center! w-[300px]">受験番号</th>
                            <th className="border px-4 py-2 text-center!">氏名</th>
                        </tr>
                        </thead>
                        <tbody className="text-[20px]">
                        <tr>
                            <td className="border px-4 py-2 text-center!">{level}</td>
                            <td className="border px-4 py-2 text-center!">0{Math.floor(Math.random()*90000+10000)}</td>
                            <td className="border px-4 py-2 text-center capitalize">{username}</td>
                        </tr>
                        </tbody>
                    </table>

                    <table className="[&>*>*>*]:border-[#75926b]! border-[#569247] border-3">
                        <tbody className="text-[20px]">
                        <tr className="[&>td]:py-0! text-[14px]">
                            <td className="border px-4 py-2 text-center! w-[150px] bg-[#95b954bf] font-semibold">あなたの得点</td>
                            <td className={twMerge("border px-4 py-2 text-center! capitalize text-3xl", totalScore >= Math.floor(totalPossibleScore*multiplier) ? "text-blue-600 font-bold" : "text-red-600 font-bold"
                            )}>{totalScore}点</td>
                            <td className="text-2xl font-semibold" rowSpan={2}>{resultText(totalScore)}</td>
                        </tr>
                        <tr className="[&>td]:py-1! text-[14px]">
                            <td className="text-center! font-semibold">今回の合格点</td>
                            <td className="border px-4 py-2 text-center! text-2xl">{Math.floor(totalPossibleScore*multiplier)}点<span className="text-[18px] align-top mr-2">/満点</span>{totalPossibleScore}点</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="w-[200px]">
                    <table className="[&>*>*>*]:border-[#75926b]! border-[#569247] border-3 table-fixed">
                        <thead>
                            <tr className="[&>th]:p-0! [&>th]:bg-[#95b954bf]">
                                <th className="text-center!">設問項目別正解率</th>
                            </tr>
                        </thead>
                        <tbody>
                            <RadarChart
                                exerciseTypes={exerciseInfo[level! as keyof typeof exerciseInfo].map(i=>i.name)}
                                scores={exerciseInfo[level! as keyof typeof exerciseInfo].map((_item,i)=>{
                                    // Return correct percentage
                                    const exercises = exam!.filter(e=>e.exerciseIndex===i+1);
                                    const correctedExercises = exercises.map(e=>({
                                        ...e,
                                        answers: correction[e._id] || [],
                                    }));

                                    const correctCount = correctedExercises.reduce((acc,e)=>{
                                        return acc + e.answers.filter(a=>a.isCorrect).length;
                                    },0);

                                    const totalCount = correctedExercises.reduce((acc,e)=>{
                                        return acc + e.answers.length;
                                    },0);

                                    return totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
                                })}
                            />
                        </tbody>
                    </table>
                </div>
            </div>

            <table className="[&>*>*>*]:border-[#75926b]! border-[#569247] border-3">
                <thead>
                    <tr className="[&>th]:p-0! [&>th]:bg-[#95b954bf]">
                        <th colSpan={2} className="border px-4 py-2 text-center!">設問事項</th>
                        <th className="border px-4 py-2 text-center!">結果詳細</th>
                        <th className="border px-4 py-2 text-center!">得点/満点</th>
                    </tr>
                </thead>
                <tbody className="text-[18px] [&>tr>td]:py-1!">
                {exerciseInfo[level! as keyof typeof exerciseInfo].map((item,i)=>{
                    const exercises = exam!.filter(e=>e.exerciseIndex===i+1);
                    const correctedExercises = exercises.map(e=>({
                        ...e,
                        answers: correction[e._id] || [],
                    }));

                    const correctString = correctedExercises.map(e=>{
                        return e.answers.map(a=>a.isCorrect?"〇":"×").join("");
                    }).join("");

                    // Divide the string in groups of 5
                    const groups = [];
                    for(let j=0;j<correctString.length;j+=5){
                        groups.push(correctString.slice(j,j+5));
                    }
                    const spacedCorrectString = groups.join(" | ");

                    const correctCount = correctedExercises.reduce((acc,e)=>{
                        return acc + e.answers.filter(a=>a.isCorrect).length*item.perQuestion;
                    },0);

                    const totalCount = correctedExercises.reduce((acc,e)=>{
                        return acc + e.answers.length;
                    },0);

                    return (
                        <tr>
                            <td className="border px-4 py-2 text-center! w-[50px]">{i+1}</td>
                            <td className="border px-4 py-2 text-center w-[300px]">{item.name}</td>
                            <td className="border px-4 py-2">{spacedCorrectString}</td>
                            <td className="border px-4 py-2 text-center! bg-[#95b954bf] w-[150px]">{correctCount}点/{totalCount*item.perQuestion}点</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>

            { totalScore >= Math.floor(totalPossibleScore*multiplier) && (
                <Link to="." href="https://www.kanken.or.jp/kanken/individual/kanken-online/" referrerPolicy="no-referrer" target="_blank" rel="noopener noreferrer" className="mt-4 mx-auto block text-center text-blue-600 underline! hover:no-underline!">公式オンライン試験の申し込みはこちら -{">"}</Link>
            ) }

            {/*Save and go home*/}
            <Button className="mt-4 mx-auto block" onClick={()=>{
                void addPastResult(
                    exam!,
                    answers,
                    correction,
                    totalScore,
                    level,
                    totalScore >= Math.floor(totalPossibleScore*multiplier)
                );
                location.href="/";
            }}>結果を保存してホームに戻る</Button>

            <p className="text-center py-8 text-2xl">↓↓↓ 答え合わせはこちら ↓↓↓</p>
        </div>
    )
}