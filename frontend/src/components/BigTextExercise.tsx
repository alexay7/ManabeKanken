import {type ReactNode, useState} from "react";
import {twMerge} from "tailwind-merge";
import RomajiInput from "@/components/RomajiInput.tsx";
import KanjiAnswerDialog from "@/components/KanjiAnswerDialog.tsx";
import {getJapaneseIndex} from "@/helpers/general.ts";

export default function BigTextExercise() {
    const [hiraganaAnswers, setHiraganaAnswers] = useState<string[]>([]);
    const [kanjiAnswers, setKanjiAnswers] = useState<string[]>([]);
    const [showAnswerDialog, setShowAnswerDialog] = useState<{answer:{text:string,kanjis:string[]},index:number} | null>(null);

        const exercise = {
            texts: ["仰いで着湾を観れば、無数の[セイシュク;0]紛糾して我が頭にあり。鮮美透涼なる彼に対して、携み易く折れ易き我如何に{赧然;0}たるべきぞ。聖にして熱ある悲慨、我が心頭に入れり。罵者の声耳辺にあるが如し、我が為すなきと、我が言うなきと、我が行くなきとを責む。われ起って茅舎を出で、且つ仰ぎ且つ俯して罵者に答うるところあらんと欲す。胸中の苦悶未だ全く解けず、行く行く秋草の深き所に到れば、忽ち聴く虫声の如く耳来を穿つを。之を聴いて我が心は一転せり、耳びさを悪いて関心更に明らかなり。{裏;1}に苦闘と思いしは苦間にあらざりけり。春よ、[ジョクショク;1]として秋を悪しむが如きもの、彼に於いて何の悲しみかあらん。彼を悲しむと看取せんか、我も悲しめるなり。彼を吟映すと思わんか、我もホ吟映してあるなり。心境一すれば彼も無く、我も無し、選影たる大空の百子の提灯を掲げ出せるあるのみ。手を[コマネ;2]きて音湾を察すれば、我「我」を{通;2}れて、潤然として、鑑の如き「時」を脱するに似たり"],
            questions: [
                {
                    text:"セイシュク",
                    answer:{
                        text:"星宿",
                        kanjis:["星","宿"]
                    }
                },
                {
                    text:"ジョクショク",
                    answer:{
                        text:"喞喞",
                        kanjis:["喞","喞"]
                    }
                },
                {
                    text:"コマネ",
                    answer:{
                        text:"拱",
                        kanjis:["拱"]
                    }
                }
            ],
            hiraganaAnswers:["たんぜん","さき","わす"]
        }

        function answerHiraganaQuestion(questionNum: number, value: string) {
            const newAnswers = [...hiraganaAnswers];
            newAnswers[questionNum] = value;
            setHiraganaAnswers(newAnswers);
        }

        function convertTextToHtml(question:{text:string}): ReactNode{
        //         Transform text inside curly brackets into a button and text inside square brackets into a highlighted text
            const regex = /{([^}]+)}|\[([^\]]+)\]/g
            const parts = question.text.split(regex);

            return parts.map((part, index) => {
                if (index % 3 === 0) {
                    // Normal text
                    return <span key={index} className="font-normal">{part}</span>;
                } else if (index % 3 === 1) {
                    if(!part) return null;
                    const [text,index] = part.split(";");
                    const hiraganaIndex = parseInt(index);

                    const answer = hiraganaAnswers[hiraganaIndex] || "";

                    // KANJI A HIRAGANA
                    return (
                        <div className={twMerge("relative inline-flex mx-1 w-4 items-center")} key={`hirapart-${hiraganaIndex}`}>
                            {/*Number of question*/}
                            <p className={twMerge("absolute -top-2 -left-5 text-[11px] pointer-events-none",!answer.length ? "text-red-600":" text-blue-600")}>{getJapaneseIndex(hiraganaIndex)}</p>
                            <p className={twMerge("font-semibold",!answer.length ? "text-red-600":" text-blue-600")}>{text}</p>
                            <div className={twMerge("vertical-text min-h-8 border-2 relative inline-flex mx-1",!answer.length ? "border-red-600":"border-blue-600")}
                                 style={{height:(answer.length+2)+"em"}} key={`part-${hiraganaIndex}`}>
                            <RomajiInput type="text" className="w-full h-full text-center px-2 text-blue-600"
                                         value={answer}
                                         setValue={(value) => {
                                             answerHiraganaQuestion(hiraganaIndex, value);
                                         }}
                            />
                            </div>
                        </div>
                    )
                } else {
                    if(!part) return null;
                    const [text, index] = part.split(";");
                    const kanjiIndex = parseInt(index);
                    const exerciseAnswer = exercise.questions[kanjiIndex].answer;

                    const answer = kanjiAnswers[kanjiIndex] || "";

                    // HIRAGANA A KANJI
                    return (
                        <button disabled={!!answer.length} className={twMerge("text-center !p-0 bg-transparent font-semibold relative",!answer.length?"text-red-600":"text-blue-600")} key={`part-${kanjiIndex}`}
                                onClick={() => {
                                    setShowAnswerDialog({answer:exerciseAnswer,index:kanjiIndex});

                                    //     Hacer captura de pantalla de los alrededores del botón

                                }}
                        >
                            <p className={twMerge("absolute -top-1 -left-3 text-[12px] pointer-events-none font-normal",!answer.length ? "text-red-600":" text-blue-600")}>{kanjiIndex+1}</p>
                            {answer || text}</button>
                    );
                }
            })
        }

        function answerKanjiQuestion(questionNum: number, answer: string) {
            const newAnswers = [...kanjiAnswers];
            newAnswers[questionNum] = answer;
            setKanjiAnswers(newAnswers);
        }

    return(
        <div>
            {showAnswerDialog && (
                <KanjiAnswerDialog questionIndex={1} questionDetails={{
                    text:"",
                    answer:showAnswerDialog.answer || {text:"", kanjis:[]}
                }} closeDialog={() => setShowAnswerDialog(null)}
                                   setAnswer={(answer) => {
                                       answerKanjiQuestion(showAnswerDialog.index, answer);
                                       setShowAnswerDialog(null);
                                   }}/>
            )}
            <h1>Texto grande del kanken 1</h1>
            <ul className="justify-self-start w-full">
                <li>
                    Kanken pre1: 10
                    Kanken 1: 9
                </li>
            </ul>
            <div className="inline-block vertical-text justify-self-end w-full leading-8 text-sm h-[600px]">
                {exercise.texts.map((text, i) =>(
                    <div className="border-2 border-dashed p-2" key={i}>
                        <p className="font-semibold border-2 border-black h-8 flex justify-center">{i+1}</p>
                        {convertTextToHtml({text})}
                    </div>
                ))}
            </div>
        </div>
    )
}