//     A normal input that accepts romaji and converts it to kana while you type.
import {type InputHTMLAttributes, type ChangeEvent} from "react";

type RomajiInputProps = InputHTMLAttributes<HTMLInputElement> & {
    setValue: (value: string) => void;
}

const romajiMap:Record<string, string> = {
    // Vowels
    a: "あ", i: "い", u: "う", e: "え", o: "お",
    // K group
    ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
    // S group
    sa: "さ", shi: "し",si:"し", su: "す", se: "せ", so: "そ",
    // T group
    ta: "た", chi: "ち",ti:"ち", tsu: "つ",tu:"つ", te: "て", to: "と",
    // N group
    na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
    // H group
    ha: "は", hi: "ひ", fu: "ふ", he: "へ", ho: "ほ",
    // M group
    ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
    // Y group
    ya: "や", yu: "ゆ", yo: "よ",
    // R group
    ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
    // W group
    wa: "わ", wo: "を", nn: "ん",
    // G group
    ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
    // Z group
    za: "ざ", ji: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
    // D group
    da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
    // B group
    ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
    // P group
    pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
    // Combinations
    kya: "きゃ", kyu: "きゅ", kyo: "きょ",
    sha: "しゃ", shu: "しゅ", sho: "しょ",
    cha: "ちゃ", chu: "ちゅ", cho: "ちょ",
    nya: "にゃ", nyu: "にゅ", nyo: "にょ",
    hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ",
    mya: "みゃ", myu: "みゅ", myo: "みょ",
    rya: "りゃ", ryu: "りゅ", ryo: "りょ",
    gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
    ja: "じゃ", ju: "じゅ", jo: "じょ",
    bya: "びゃ", byu: "びゅ", byo: "びょ",
    pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
//     Double consonants
    kka: "っか", kki: "っき", kku: "っく", kke: "っけ", kko: "っこ",
    ssa: "っさ", sshi: "っし", ssi:"っし", ssu: "っす", sse: "っせ", sso: "っそ",
    tta: "った", cchi: "っち", ttu: "っつ", tte: "って", tto: "っと",
    ppa: "っぱ", ppi: "っぴ", ppu: "っぷ", ppe: "っぺ", ppo: "っぽ",
    kkya: "っきゃ", kkyu: "っきゅ", kkyo: "っきょ",
    ssya: "っしゃ", ssyu: "っしゅ", ssyo: "っしょ",
    ppya: "っぴゃ", ppyu: "っぴゅ", ppyo: "っぴょ",
    ccha: "っちゃ", cchu: "っちゅ", ccho: "っちょ",
//     Little vowels
    xa: "ぁ", xi: "ぃ", xu: "ぅ", xe: "ぇ", xo: "ぉ",
    la: "ぁ", li: "ぃ", lu: "ぅ", le: "ぇ", lo: "ぉ",
    xya: "ゃ", xyu: "ゅ", xyo: "ょ",
    lya: "ゃ", lyu: "ゅ", lyo: "ょ",
    // Small tsu
    xtu: "っ",
    xtsu: "っ",
    ltu: "っ",
    ltsu: "っ",
    // Special cases
    "n'": "ん", // Handle n' as ん
    "fi": "ふぃ", // Fi
    "fe": "ふぇ", // Fe
};

export default function RomajiInput({setValue,...props}: RomajiInputProps) {
    function romajiToHiragana(input:string) {
        let text = input.toLowerCase();
        let result = "";

        while (text.length > 0) {
            // Match longest possible romaji first
            const match = Object.keys(romajiMap)
                .sort((a, b) => b.length - a.length)
                .find(k => text.startsWith(k));

            // If there is an n and it is not the last character, convert it to ん
            if(text.includes("n") && text.length > 1 && !text.endsWith("n")){
                const nIndex = text.indexOf("n");
            // Check the next letter is not a vowel or y
                if(nIndex !== -1 && (nIndex === text.length - 1 || !/^[aiueoy']$/.test(text[nIndex + 1]))) {
                    text = text.replace("n", "ん")
                    continue;
                }
            }

            if (match) {
                result += romajiMap[match];
                text = text.slice(match.length);
            } else {
                // No match, add as is
                result += text[0];
                text = text.slice(1);
            }
        }
        return result;
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const input = event.target.value;

        const kana = romajiToHiragana(input);

        setValue(kana);
    }

    return (
        <input
            type="text"
            className="border border-gray-300 rounded-md p-2 text-center"
            style={{writingMode:"horizontal-tb"}}
            onChange={handleInputChange}
            onBlur={() => {
            //     Si el valor acaba en n, convertirlo a ん
                if (props.value && typeof props.value === "string" && props.value.endsWith("n")) {
                    setValue(props.value.replace("n", "ん"));
                }
            }}

            {...props}
        />
    )
}