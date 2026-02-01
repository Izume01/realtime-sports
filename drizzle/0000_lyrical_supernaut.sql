CREATE TYPE "public"."match_status" AS ENUM('pending', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "commeentary" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer,
	"minute" integer NOT NULL,
	"sequence" integer NOT NULL,
	"period" integer NOT NULL,
	"event_type" text NOT NULL,
	"actor" text NOT NULL,
	"team" text NOT NULL,
	"message" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"sport" text NOT NULL,
	"home_team" text NOT NULL,
	"away_team" text NOT NULL,
	"home_team_score" integer DEFAULT 0 NOT NULL,
	"away_team_score" integer DEFAULT 0 NOT NULL,
	"status" "match_status" DEFAULT 'pending' NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "commeentary" ADD CONSTRAINT "commeentary_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;