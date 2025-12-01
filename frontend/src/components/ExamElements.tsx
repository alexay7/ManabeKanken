import {Button} from "@/components/ui/button.tsx";
import {useExamStore} from "@/stores/exam-store.ts";
import {useNavigate, useSearch} from "@tanstack/react-router";
import {Eye, EyeOff} from "lucide-react";
import {Fragment, useEffect, useState} from "react";

type ExamElementsProps = {
    initialTime:number;
    gradeExam: () => void;
}

export default function ExamElements({gradeExam, initialTime}:ExamElementsProps){
    const navigate=useNavigate();

    const {strict}: {strict:boolean} = useSearch({strict:false});

    const {correction,resetExam}=useExamStore()

    const [time, setTime] = useState(initialTime);
    const [showTime, setShowTime] = useState(true);

    useEffect(() => {
        if(!strict) return;
        const intervalId = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalId);
                    gradeExam();
                    return 0;
                }

                localStorage.setItem("examTime",String(prevTime - 1));

                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [gradeExam, strict]);


    if(Object.keys(correction).length>0) {
        return <Button className="bg-blue-600 w-[400px] mx-auto text-xl font-bold transition-colors! duration-150!"
                       onClick={()=>{
                           resetExam();
                           void navigate({to:"/"});
                       }}
        >ホームに戻る</Button>
    }

    if(!correction) {
        return null;
    }

    return (
        <Fragment>
            {strict&&(
            <div className="flex items-center gap-4 fixed top-0 right-0 lg:right-20 bg-white px-4 border-x-4 border-gray-200 h-[34px]">
                {showTime ? (
                    <div className="text-2xl font-mono">
                        {String(Math.floor(time / 60)).padStart(2, '0')}:
                        {String(time % 60).padStart(2, '0')}
                    </div>
                ) : (
                    <div className="text-2xl font-mono">
                        **:**
                    </div>
                )}
                <button className="text-sm text-blue-600 underline" onClick={() => {
                    setShowTime(!showTime);
                }}>
                    {showTime ?
                        <EyeOff className="inline-block mb-1 mr-1" size={16}/> :
                        <Eye className="inline-block mb-1 mr-1" size={16}/>
                    }
                </button>
            </div>
            )}
            <div className="flex">
            {/*    give up*/}
            <Button
                className="bg-red-600 w-[300px] mx-auto text-xl font-bold transition-colors! duration-150!"
                variant="default"
                onClick={() => {
                    void navigate({to:"/"});
                }}
            >あきらめる</Button>
            <Button
                className="bg-green-600 w-[300px] mx-auto text-xl font-bold transition-colors! duration-150!"
                variant="default"
                onClick={() => {
                    scrollTo(0, 0);
                    gradeExam();
                }}
            >さいてん</Button>
            </div>
        </Fragment>
    )
}