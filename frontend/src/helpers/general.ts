export function convertTextToHtml(text: string): string {
    //     Las cosas en corchetes debe ser subrayar la palabra y poner el número en superíndice
    return text.replace(/\[([^\]]+)\]/g, (_, word, number) => {
        const rightSide = `<span class="absolute top-0 -right-4 text-[10px] " style="writing-mode: initial">${number}</span>`

        return `<div class="relative inline font-normal" style="writing-mode: vertical-rl"><span class="border-r-2">${word}</span>${rightSide}</div>`;
    });
}

export async function convertKanjiToSvg(kanji:string):Promise<string>{
//     Los kanjis están en public/kanji cada uno con nombre "[codigohexadecimal].svg", descargar los svg y devolverlos. Estamos en browser
    const kanjiCode = kanji.codePointAt(0)?.toString(16);
    if (!kanjiCode) return Promise.reject("Invalid kanji character");

    return fetch(`/kanji/0${kanjiCode}.svg`)
        .then(response => response.text())
        .catch(() => {
            console.error(`Error fetching SVG for kanji: ${kanji}`);
            return "";
        });
}

export function convertFurigana(text?:string){
    if(!text) return "";
    return text.replace(/{([^;]+);([^}]+)}/g, (_, word, hiragana) => {
        return `<ruby><rb>${word}</rb><rp>(</rp><rt>${hiragana}</rt><rp>)</rp></ruby>`;
    }).replace(/x([0-9A-Fa-f]{4})/g,(_,hex)=>{
        const char = String.fromCodePoint(parseInt(hex, 16));
        return `<span class="radicals">${char}</span>`;
    });
}

export function renderRadicals(text:string){
    return text.replace(/x([0-9A-Fa-f]{4})/g, (_, hex) => {
        return String.fromCodePoint(parseInt(hex, 16));
    });
}

export function getJapaneseIndex(n:number){
    const kanaOrder = ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ",
        "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト",
        "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ",
        "マ", "ミ", "ム", "メ", "モ"]

    if (n < 0 || n >= kanaOrder.length) {
        throw new Error("Index out of bounds for Japanese kana order");
    }
    return kanaOrder[n];
}