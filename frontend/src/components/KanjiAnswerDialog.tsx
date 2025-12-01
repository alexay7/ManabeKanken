import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {type ReactNode, useEffect, useRef, useState} from "react";
import {convertKanjiToSvg} from "@/helpers/general.ts";
import KanjivgAnimate from "kanjivganimate";
import {ReactSketchCanvas, type ReactSketchCanvasRef} from "react-sketch-canvas";
import {Button} from "@/components/ui/button.tsx";

type ShowAnswerDialogProps = {
    questionIndex:number;
    questionDetails:{
        text:string;
        answer:{text:string,kanjis:string[]}
    };
    closeDialog: () => void;
    setAnswer: (answer: string) => void;
}

export default function KanjiAnswerDialog({questionDetails,closeDialog,setAnswer,questionIndex}:ShowAnswerDialogProps) {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    const [drawnKanji, setDrawnKanji] = useState<string>("");
    const [showAnswer, setShowAnswer] = useState(false)
    const [loadedAnswer, setLoadedAnswer] = useState<ReactNode[]>([]);

    async function renderKanjiAnswer(kanjis:string[]){
        const {answer}=questionDetails;

        const htmlParts: ReactNode[] = [];

        for (const kanji of kanjis) {
            const svg = await convertKanjiToSvg(kanji);
            if (svg) {
                // Grab only the SVG part of the string
                const svgMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
                if (!svgMatch) {
                    console.error(`No SVG found for kanji: ${kanji}`);
                    continue;
                }

                // Add the class "kanjiVG" to the SVG element
                const svgContent = svgMatch[0].replace('<svg', '<svg class="kanjiVG"');

                htmlParts.push(
                    <div className="flex items-end">
                        <div className="w-24 h-24" dangerouslySetInnerHTML={{__html: svgContent}} />
                        <p className="text-5xl">{answer.text.replace(kanji,"")}</p>
                    </div>
                );
            } else {
                htmlParts.push(
                    <div className="flex flex-col items-center">
                        <p className="text-2xl">{kanji}</p>
                        <p className="text-red-600">No se pudo cargar el kanji</p>
                    </div>
                );
            }
        }

        setLoadedAnswer(htmlParts);
    }

    useEffect(() => {
        if (loadedAnswer.length>0){
            new KanjivgAnimate('.kanjiVG');
        }
    }, [loadedAnswer]);

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

    function formatTextBold(text: string): ReactNode {
    //     bold the questionIndex's occurence of text between brackets
        const regex = new RegExp(`\\[([^\\]]+)\\]`, 'g');
        const parts = text.split(regex);
        const htmlParts: ReactNode[] = [];
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Normal text
                htmlParts.push(<span key={i}>{parts[i]}</span>);
            } else {
                const index = Math.floor(i / 2);
                if ((text.match(/\[/g)?.length||0)<=1? 1 : index === questionIndex) {
                    // Bold text
                    htmlParts.push(<strong key={i} className="text-blue-600 underline">{parts[i].trim()||Array.from({length:questionDetails.answer.kanjis.length}).fill("囗").join("")
                    }</strong>);
                }else{
                    // Normal text
                    htmlParts.push(<span key={i}>{parts[i]}</span>);
                }
            }
        }

        return <p>{htmlParts}</p>
    }

    return (
        <Dialog open={true} onOpenChange={(open)=>{
            if(!open && !showAnswer){
                closeDialog();
            }
        }}>
            <DialogContent showCloseButton={false} className="max-w-[700px]!">
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
                                    <small className="px-2">
                                        <span className="text-gray-500 text-xs"><sup>*</sup>
                                            Si haces click en el kanji, se reproducirá la animación de sus trazos.</span>
                                    </small>
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
                                    setAnswer("×");
                                    closeDialog();
                                }}>まちがってた</button>

                                <button className="bg-green-600 text-white font-semibold text-2xl flex-1 py-1" onClick={()=>{
                                    setAnswer(questionDetails.answer.text || questionDetails.answer.kanjis.join(""));
                                    closeDialog();
                                }}>あってた</button>
                            </div>
                        </div>
                    ):(
                        <div className="flex flex-col items-center gap-4">
                            {formatTextBold(questionDetails.text)}
                            <div className="h-[200px] relative" style={{width: questionDetails.answer.kanjis.length*200+"px"}}>
                                <ReactSketchCanvas
                                    ref={canvasRef}
                                    className="h-[200px] border-2 border-gray-300 rounded-lg"
                                    style={{width: questionDetails.answer.kanjis.length*200+"px"}}
                                    width="200"
                                    height="200"
                                    strokeWidth={4}
                                    strokeColor="blue"
                                    withTimestamp
                                />
                                <div className="absolute top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none select-none w-[600px] h-[200px] flex">
                                    {questionDetails.answer.kanjis.map((_,index)=>(
                                        <div key={index} className="w-1/3 h-full border-gray-200 border-2 flex justify-center items-center relative">
                                        {/*    Write a dashed + */}
                                            <div className="w-12 h-12 border-gray-300 flex flex-col">
                                                <div className="border-l-2 border-dashed border-gray-300 flex-1 absolute top-0 bottom-0 right-1/2 translate-x-1/2"></div>
                                                <div className="border-t-2 border-dashed border-gray-300 w-full absolute left-0 right-0 top-1/2 -translate-y-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button variant="secondary" className="px-4 py-2" onClick={async () => {
                                if (canvasRef.current) {
                                    canvasRef.current.clearCanvas();
                                }
                            }}>
                                けす
                            </Button>
                            <hr className="w-full border-dashed"/>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="ml-4 px-4 py-2" onClick={()=>{
                                    closeDialog();
                                }}>
                                    キャンセル
                                </Button>
                                <Button onClick={() => {
                                    setShowAnswer(true);

                                    void loadDrawnKanji()

                                    void renderKanjiAnswer(questionDetails.answer.kanjis);
                                }}>
                                    こたえをみる
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}