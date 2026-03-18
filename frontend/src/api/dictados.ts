import {api} from "@/api/request.ts";

type DictadoType = {
    id:string,
    frase:string,
    audio:string,
    imagen:string,
    nivel:number,
    hardest_kanji:string
}

export const DictadoAPI = {
    getRandomDictado: async (level: string) => {
        const [dictado] = await api.get<DictadoType[]>(`dictado/${level}`);

        return dictado
    }
}