import { Router } from "express";
import { createMatchSchema } from "../validation/zod.schema.ts";
import db from "../db/db.ts";
import { getMatchStatus } from "../util/matchStatus.ts";
import {listMatchQuerySchema} from "../validation/zod.schema.ts";
import { matches } from "../db/schema.ts";
import { desc } from "drizzle-orm";

const router = Router()

router.get('/' , async(req,res) => {
    
    const parsedQuery = listMatchQuerySchema.safeParse(req.query) 

    if(!parsedQuery.success) {
        return res.status(400).json({
            "error" : "Invalid request query",
            "details" : parsedQuery.error.format(),
        })
    }

    const {limit} = parsedQuery.data ?? {};

    try {
        const listMatch = await db.select().from(matches).limit(limit).orderBy(desc(matches.createdAt)).execute();

        return res.status(200).json({
            "message" : "Matches fetched successfully",
            "data" : listMatch,
        });
    } catch (error) {
        console.error('Error fetching matches:', error);
        return res.status(500).json({
            "error" : "Failed to fetch matches",
            "details" : error.message,
        })
    }
})

router.post('/' , async(req , res) => {
    const parsedBody = createMatchSchema.safeParse(req.body)


    if(!parsedBody.success) {
        return res.status(400).json({
            "error" : "Invalid request body",
            "details" : parsedBody.error.format(),
        })
    }

    const {startTime, endTime, homeTeamScore, awayTeamScore } = parsedBody.data ?? {};

    try {

        const [match] = await db.insert(matches).values({
            ...parsedBody.data,
            startTime : new Date(parsedBody.data.startTime),
            endTime : new Date(parsedBody.data.endTime),
            homeTeamScore : homeTeamScore ?? 0,
            awayTeamScore : awayTeamScore ?? 0,
            status :  getMatchStatus(startTime, endTime),
        }).returning();

        if(!match) {
            return res.status(500).json({
                error : "Failed to create match"
            })
        }

        return res.status(201).json(match);
    } catch (error) {
        console.error('Error creating match:', error);
        return res.status(500).json({
            error : "Failed to create match"
        })
    }
});

export default router;