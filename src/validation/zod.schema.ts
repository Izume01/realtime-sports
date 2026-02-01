import z from "zod";

export const matchStatus = {
    pending : "pending",
    inProgress : "in_progress",
    completed : "completed",
    cancelled : "cancelled",
} as const;

export const listMatchQuerySchema = z.object({
    limit : z.coerce.number().int().nonnegative().default(10),
})

export const matchIdParamSchema = z.object({
    matchId : z.coerce.number().int().positive(),
})

export type MatchStatus = (typeof matchStatus)[keyof typeof matchStatus];

const isoDateString = z.string().refine((val) => {
    return !isNaN(new Date(val).getTime())
}, {
    message : "Invalid ISO date string"
})

export const createMatchSchema = z.object({
    sport : z.string().min(1).max(255),
    homeTeam : z.string().min(1).max(255),
    awayTeam : z.string().min(1).max(255),
    startTime : isoDateString,
    endTime : isoDateString,
    homeTeamScore : z.number().min(0).default(0),
    awayTeamScore : z.number().min(0).default(0),
}).superRefine((data , ctx) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start >=end) 
        ctx.addIssue({
            code : "custom",
            message : "Start time must be before end time",
            path : ["endTime"],
        })
    }
);

export const updateMatchSchema = z.object({
    homeScore : z.coerce.number().int().nonnegative(),
    awayScore : z.coerce.number().int().nonnegative(),
})  