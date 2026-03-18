import Elysia from "elysia";
import z from "zod";
import {Dictado} from "../models/dictado.model";

export const dictadoRouter = new Elysia({prefix: "/dictado"})
    .get(":level", ({params}) => {
        const level = parseInt(params.level);

        return Dictado.aggregate([
            {$match: {nivel: level}},
            {$sample: {size: 1}}
        ]);
    }, {
        params: z.object({
            level: z.enum(["10","9","8","7","6","5","4","3","2.5","2","1.5","1"])
        })
    });