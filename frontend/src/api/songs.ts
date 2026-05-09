import {api} from "@/api/request.ts";

export type SongSearchResult = {
    songs: SongType[];
    total: number;
    page: number;
    limit: number;
};

export type SongType = {
    _id: string;
    title: string;
    artist: string;
    lyrics: string[];
    media: string;
    level: number;
};

export const SongsAPI = {
    search: async (q: string, page: number, limit: number): Promise<SongSearchResult> => {
        const params = new URLSearchParams({
            q,
            page: String(page),
            limit: String(limit),
        });
        return api.get<SongSearchResult>(`songs/search?${params.toString()}`);
    },
    getSongInfo: async (id: string): Promise<SongType> => {
        return api.get<SongType>(`songs/song/${id}`);
    }
};
