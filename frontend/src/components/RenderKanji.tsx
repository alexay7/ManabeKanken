import {type ReactNode, useState} from "react";
import {convertKanjiToSvg} from "@/helpers/general.ts";

type RenderKanjiProps = {
    kanji:string;
    strokes:boolean;
    boldStroke?:number;
    circleCoords?:[number,number];
    width?:number;
    height?:number;
}

export default function RenderKanji({kanji,strokes,boldStroke,circleCoords,width,height}:RenderKanjiProps) {
    const [visualKanji,setVisualKanji]=useState<ReactNode|undefined>(undefined)

    async function renderKanjiAnswer() {
        const htmlParts: ReactNode[] = [];

        const svg = await convertKanjiToSvg(kanji);
        if (svg) {
            // Grab only the SVG part of the string
            const svgMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
            if (!svgMatch) {
                console.error(`No SVG found for kanji: ${kanji}`);
                return;
            }

            let svgContent = svgMatch[0];

            if(!strokes){
            //     Remove the stroke numbers from the SVG
                svgContent = svgContent.replace(/StrokeNumbers......./i, (match)=>{
                    return match + ` style="display:none;"`;
                });
            }

            // Replace width and height attributes if they exist
            svgContent = svgContent.replace(/width="[^"]*"/, `width="${width
                || "auto"}"`);
            svgContent = svgContent.replace(/height="[^"]*"/, `height="${height
                || "auto"}"`);

            if (boldStroke) {
                // Make the stroke with id kvg:*-s[boldStroke] bold, stroke is not defined so dont replace
                const regex = new RegExp(`("[^"]*-s${boldStroke}")`, 'i');
                svgContent = svgContent.replace(regex, (match) => {
                    return match + ` stroke-width="4" stroke="red"`;
                });
            }

            if(circleCoords){
                const [x, y] = circleCoords;

                const circle = `<circle cx="${x}" cy="${y}" r="15" fill="white" stroke="red" stroke-width="3" />`

                //     Add the circle to the end of the svg before the closing </svg> tag
                const closingTagIndex = svgContent.lastIndexOf("</svg>");
                if (closingTagIndex === -1) {
                    console.error(`No closing tag found for kanji: ${kanji}`);
                    return;
                }
                svgContent = svgContent.slice(0, closingTagIndex) + circle + svgContent.slice(closingTagIndex);
            }

            htmlParts.push(
                <div className="flex items-end" key={kanji}>
                    <div
                        style={{width: width || "auto", height: height || "auto"}}
                        className="flex" dangerouslySetInnerHTML={{__html: svgContent}}/>
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
        setVisualKanji(htmlParts);
    }


    if (!visualKanji) {
        void renderKanjiAnswer();
    }

    return visualKanji && (
                <div className="mt-4">
                    {visualKanji}
                </div>
    )
}