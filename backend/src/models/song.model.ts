import mongoose, {Schema} from "mongoose";
import {SongType} from "../types/song.type";

const songSchema = new Schema<SongType>({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    lyrics: {
        type: [String],
        required: true
    },
    media: {
        type: String,
        required: true
    }
});

export const Song = mongoose.model('Song', songSchema);
