CREATE TABLE IF NOT EXISTS "boats" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50),
	"description" text,
	"captain_user_id" varchar(256) NOT NULL,
	"banner" json DEFAULT 'null'::json,
	"created_on" timestamp with time zone DEFAULT (current_timestamp AT TIME ZONE 'UTC') NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crew_members" (
	"boat_id" integer NOT NULL,
	"user_id" varchar(256),
	"email" varchar(256) NOT NULL,
	"role" varchar(25) NOT NULL,
	"created_on" timestamp with time zone DEFAULT (current_timestamp AT TIME ZONE 'UTC') NOT NULL,
	CONSTRAINT "crew_members_boat_id_email_pk" PRIMARY KEY("boat_id","email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "module_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"comment" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "module_option_votes" (
	"user_id" varchar(256) NOT NULL,
	"module_option_id" integer NOT NULL,
	CONSTRAINT "module_option_votes_user_id_module_option_id_pk" PRIMARY KEY("user_id","module_option_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "module_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"data" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"boat_id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256),
	"order" integer NOT NULL,
	"created_on" timestamp with time zone DEFAULT (current_timestamp AT TIME ZONE 'UTC') NOT NULL,
	"type" varchar(50) NOT NULL,
	"finalized_option_id" integer,
	"allow_multiple" boolean DEFAULT false NOT NULL,
	"anonymous_voting" boolean DEFAULT false NOT NULL,
	"deadline" timestamp,
	"author_id" varchar(256) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_boat_id_boats_id_fk" FOREIGN KEY ("boat_id") REFERENCES "public"."boats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "module_comments" ADD CONSTRAINT "module_comments_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "module_option_votes" ADD CONSTRAINT "module_option_votes_module_option_id_module_options_id_fk" FOREIGN KEY ("module_option_id") REFERENCES "public"."module_options"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "module_options" ADD CONSTRAINT "module_options_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "modules" ADD CONSTRAINT "modules_boat_id_boats_id_fk" FOREIGN KEY ("boat_id") REFERENCES "public"."boats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "boats_name_index" ON "boats" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "boats_slug_index" ON "boats" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crew_members_boat_id_index" ON "crew_members" USING btree ("boat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crew_members_user_id_index" ON "crew_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crew_members_email_index" ON "crew_members" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "module_comments_module_id_index" ON "module_comments" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "module_option_votes_user_id_index" ON "module_option_votes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "module_option_votes_module_option_id_index" ON "module_option_votes" USING btree ("module_option_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "module_options_module_id_index" ON "module_options" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "modules_boat_id_index" ON "modules" USING btree ("boat_id");