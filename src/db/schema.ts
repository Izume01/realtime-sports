import { pgTable, serial, text, timestamp , pgEnum, integer, jsonb } from 'drizzle-orm/pg-core';

export const MatchStatusEnum = pgEnum("match_status", ["pending", "in_progress", "completed", "cancelled"]);

export const matches = pgTable('matches' , {
    id: serial('id').primaryKey(),
    sport : text('sport').notNull(),
    homeTeam : text('home_team').notNull(),
    awayTeam : text('away_team').notNull(),
    homeTeamScore : integer('home_team_score').notNull().default(0),
    awayTeamScore : integer('away_team_score').notNull().default(0),
    status : MatchStatusEnum('status').notNull().default('pending'),
    startTime : timestamp('start_time').notNull(),
    endTime : timestamp('end_time').notNull(),
    createdAt : timestamp('created_at').notNull().defaultNow(),
    updatedAt : timestamp('updated_at').notNull().defaultNow(),
})

export const commentary = pgTable("commeentary" , {
    id : serial('id').primaryKey(), 
    matchId : integer('match_id').references(() => matches.id), 
    minute : integer('minute').notNull(),
    sequence : integer('sequence').notNull(),
    period : integer('period').notNull(),
    eventType : text('event_type').notNull(),
    actor : text('actor').notNull(),
    team : text('team').notNull(),
    message : text('message').notNull(),
    metadata : jsonb('metadata').notNull().default({}),
    tags : text('tags').array().notNull().default([]),
    createdAt : timestamp('created_at').notNull().defaultNow(),
    updatedAt : timestamp('updated_at').notNull().defaultNow(),
})