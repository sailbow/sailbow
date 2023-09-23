CREATE TABLE IF NOT EXISTS "boat_banners" (
	"boat_id" integer PRIMARY KEY NOT NULL,
	"show" boolean DEFAULT true NOT NULL,
	"type" text NOT NULL,
	"value" text NOT NULL,
	"position" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boats" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(256),
	"captain_user_id" integer NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crew_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"boat_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" text NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "module_option_votes" (
	"crew_member_id" integer NOT NULL,
	"module_option_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "module_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"data" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "module_settings" (
	"module_id" integer PRIMARY KEY NOT NULL,
	"allow_multiple" boolean DEFAULT false NOT NULL,
	"anonymous_voting" boolean DEFAULT false NOT NULL,
	"deadline" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"boat_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(250),
	"order" integer NOT NULL,
	"finalized_option_id" integer,
	"created_on" timestamp with time zone NOT NULL,
	"type" text NOT NULL,
	"author_user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" varchar(256) NOT NULL,
	"phone" text,
	"hash" varchar(256),
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boat_banners" ADD CONSTRAINT "boat_banners_boat_id_boats_id_fk" FOREIGN KEY ("boat_id") REFERENCES "boats"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boats" ADD CONSTRAINT "boats_captain_user_id_users_id_fk" FOREIGN KEY ("captain_user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_boat_id_boats_id_fk" FOREIGN KEY ("boat_id") REFERENCES "boats"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "module_option_votes" ADD CONSTRAINT "module_option_votes_crew_member_id_crew_members_id_fk" FOREIGN KEY ("crew_member_id") REFERENCES "crew_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "module_option_votes" ADD CONSTRAINT "module_option_votes_module_option_id_module_options_id_fk" FOREIGN KEY ("module_option_id") REFERENCES "module_options"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "module_options" ADD CONSTRAINT "module_options_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "module_settings" ADD CONSTRAINT "module_settings_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "modules" ADD CONSTRAINT "modules_boat_id_boats_id_fk" FOREIGN KEY ("boat_id") REFERENCES "boats"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "modules" ADD CONSTRAINT "modules_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
