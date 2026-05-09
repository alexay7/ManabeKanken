import {Types} from "mongoose";

export type SongType = {
    _id: Types.ObjectId;
    title: string;
    artist: string;
    lyrics: string[];
    media: string;
};
