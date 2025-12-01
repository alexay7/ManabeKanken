import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {type ReactNode, useRef, useState} from "react";
import {renderRadicals} from "@/helpers/general.ts";
import {ReactSketchCanvas, type ReactSketchCanvasRef} from "react-sketch-canvas";

type ShowAnswerDialogProps = {
    questionIndex:number;
    questionDetails:{
        answer:string;
    };
    closeDialog: () => void;
    setAnswer: (answer: string) => void;
}

export default function RomajiAnswerDialog({questionDetails,closeDialog,setAnswer}:ShowAnswerDialogProps) {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    const [drawnKanji, setDrawnKanji] = useState<string>("");
    const [showAnswer, setShowAnswer] = useState(false)
    const [loadedAnswer, setLoadedAnswer] = useState<ReactNode|null>(null);

    async function renderKanjiAnswer(){
        setLoadedAnswer(
            <div className="flex items-end">
                <p className="text-[100px] radicals">{renderRadicals(questionDetails.answer)}</p>
            </div>
        );

    }

    async function loadDrawnKanji() {
        // Save the drawn answer
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const drawnData = await canvas.exportImage("png");
            const time = await canvas.getSketchingTime()

            if(time>0) {
                setDrawnKanji(drawnData);
            }
        }
    }

    return (
        <Dialog open={true} onOpenChange={(open)=>{
            if(!open && !showAnswer){
                closeDialog();
            }
        }}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Hoja de respuesta</DialogTitle>
                    {!showAnswer?(
                        <DialogDescription>
                            Prepara un cuaderno o algo con lo que puedas escribir, y escribe la respuesta. Cuando termines, presiona el botón "Mostrar respuesta" y evalúa si lo escribiste correctamente según los criterios del kanken.
                        </DialogDescription>
                    ):(
                        <DialogDescription>
                            Si el kanji que escribiste coincide exactamente con el kanji de la izquierda, presiona el botón verde de la derecha. Si no es así, presiona el botón rojo de la izquierda.
                        </DialogDescription>
                    )}
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    {showAnswer ? (
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-2xl">こたえあわせ</p>
                            <div className="flex gap-4">
                                <div className="flex gap-4 border-2 border-gray-200 border-dashed w-full justify-center py-2 flex-col items-center">
                                    <p>ただしいこたえ</p>
                                    {loadedAnswer}
                                </div>
                                {drawnKanji&&(
                                    <div className="flex gap-4 border-2 border-gray-200 border-dashed w-full justify-center py-2 flex-col items-center">
                                        <p>あなたのかいとう</p>
                                        <img src={drawnKanji} alt="Drawn Kanji" className="w-64 h-32 object-contain" />
                                    </div>
                                )}
                            </div>
                            <div className="flex w-full gap-4">
                                <button className="bg-red-600 text-white font-semibold text-2xl flex-1 py-1" onClick={()=>{
                                    setAnswer("X");
                                    closeDialog();
                                }}>まちがってた</button>

                                <button className="bg-green-600 text-white font-semibold text-2xl flex-1 py-1" onClick={()=>{
                                    setAnswer(questionDetails.answer);
                                    closeDialog();
                                }}>あってた</button>
                            </div>
                        </div>
                    ):(
                        <div className="flex flex-col items-center gap-4">
                            <ReactSketchCanvas
                                ref={canvasRef}
                                className="w-[400px] h-[200px] border-2 border-gray-300 rounded-lg"
                                width="200"
                                height="200"
                                strokeWidth={4}
                                strokeColor="blue"
                                withTimestamp
                            />
                            <button className="bg-gray-200 px-4 py-2" onClick={async () => {
                                if (canvasRef.current) {
                                    canvasRef.current.clearCanvas();
                                }
                            }}>
                                けす
                            </button>
                            <hr className="w-full border-dashed"/>
                            <div className="flex gap-2">
                                <button className="ml-4 bg-red-200 px-4 py-2" onClick={()=>{
                                    closeDialog();
                                }}>
                                    キャンセル
                                </button>
                                <button className="bg-green-200 px-4 py-2" onClick={() => {
                                    setShowAnswer(true);

                                    void loadDrawnKanji()

                                    void renderKanjiAnswer();
                                }}>
                                    こたえをひょうじ
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}