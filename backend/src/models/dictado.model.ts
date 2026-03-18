import mongoose, {Schema} from "mongoose";
import {DictadoType} from "../types/dictado.type";

const dictadoSchema = new Schema<DictadoType>({
    id: {
        type: String,
        required: true
    },
    frase: {
        type: String,
        required: true
    },
    audio: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    nivel: {
        type: Number,
        required: true
    },
    hardest_kanji: {
        type: String,
        required: true
    }
});

dictadoSchema.index({nivel: 1});

export const Dictado = mongoose.model('Dictado', dictadoSchema);