import Elysia from "elysia";
import z from "zod";
import {Song} from "../models/song.model";
import type {SongType} from "../types/song.type";

export const songRouter = new Elysia({prefix: "/songs"})
    .get("/song/:id", async ({params}) => {
        const {id} = params;
        const song = await Song.findById(id).lean() as SongType | null;
        if (!song) {
            return {error: "Song not found"};
        }
        return song;
    }, {
        params: z.object({
            id: z.string(),
        }),
    })
    .get("/search", async ({query}) => {
        const {q = "", page = "1", limit = "20"} = query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const filter: Record<string, unknown> = {};

        if (q.trim()) {
            // Search in title, artist or media with regex
            const regex = new RegExp(q.trim(), "i");
            filter.$or = [
                {title: regex},
                {artist: regex},
                {media: regex},
            ];
        }

        let results: SongType[];
        let total: number;

        if (q.trim()) {
            [results, total] = await Promise.all([
                (Song.find(filter, {lyrics: 0})
                    .skip(skip)
                    .limit(limitNum)
                    .lean() as Promise<SongType[]>),
                Song.countDocuments(filter),
            ]);
        } else {
            // Random results: sample larger set, then apply skip/limit in memory
            const sampleSize = Math.min(1000, limitNum * 10);
            const sample = await Song.aggregate([{
                $match: filter
            }, {
                $sample: {size: sampleSize}
            }, {
                $project: {lyrics: 0}
            }]) as SongType[];
            total = sample.length;
            results = sample.slice(skip, skip + limitNum);
        }

        return {
            songs: results as SongType[],
            total,
            page: pageNum,
            limit: limitNum,
        };
    }, {
        query: z.object({
            q: z.string().optional(),
            page: z.string().default("1"),
            limit: z.string().default("20"),
        }),
    });
