CREATE OR REPLACE FUNCTION public.create_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin

  insert into public.profiles(user_id)
  values (new.id);

  return new;

end;$function$
;

CREATE TRIGGER create_profile_on_user_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_profile();


create table "public"."boats" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "captain_user_id" uuid,
    "name" text not null,
    "description" text,
    "banner_url" text,
    "banner_color" text
);


alter table "public"."boats" enable row level security;

create table "public"."crew_members" (
    "user_id" uuid not null,
    "boat_id" uuid not null,
    "role" text not null,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text)
);


alter table "public"."crew_members" enable row level security;

create table "public"."module_options" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "created_by" uuid,
    "module_id" uuid,
    "data" json not null
);


alter table "public"."module_options" enable row level security;

create table "public"."modules" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "created_by" uuid,
    "type" text not null,
    "allow_multi_vote" boolean not null default false,
    "anonymous_voting" boolean default true,
    "voting_deadline" time with time zone,
    "boat_id" uuid
);


alter table "public"."modules" enable row level security;

create table "public"."profiles" (
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "first_name" text,
    "last_name" text,
    "user_id" uuid not null
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX boats_pkey ON public.boats USING btree (id);

CREATE UNIQUE INDEX crew_members_pkey ON public.crew_members USING btree (user_id, boat_id);

CREATE UNIQUE INDEX module_options_pkey ON public.module_options USING btree (id);

CREATE UNIQUE INDEX modules_pkey ON public.modules USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (user_id);

alter table "public"."boats" add constraint "boats_pkey" PRIMARY KEY using index "boats_pkey";

alter table "public"."crew_members" add constraint "crew_members_pkey" PRIMARY KEY using index "crew_members_pkey";

alter table "public"."module_options" add constraint "module_options_pkey" PRIMARY KEY using index "module_options_pkey";

alter table "public"."modules" add constraint "modules_pkey" PRIMARY KEY using index "modules_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."boats" add constraint "boats_captain_user_id_fkey" FOREIGN KEY (captain_user_id) REFERENCES profiles(user_id) ON DELETE CASCADE not valid;

alter table "public"."boats" validate constraint "boats_captain_user_id_fkey";

alter table "public"."crew_members" add constraint "crew_members_boat_id_fkey" FOREIGN KEY (boat_id) REFERENCES boats(id) ON DELETE CASCADE not valid;

alter table "public"."crew_members" validate constraint "crew_members_boat_id_fkey";

alter table "public"."crew_members" add constraint "crew_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE not valid;

alter table "public"."crew_members" validate constraint "crew_members_user_id_fkey";

alter table "public"."module_options" add constraint "module_options_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(user_id) ON DELETE CASCADE not valid;

alter table "public"."module_options" validate constraint "module_options_created_by_fkey";

alter table "public"."module_options" add constraint "module_options_module_id_fkey" FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE not valid;

alter table "public"."module_options" validate constraint "module_options_module_id_fkey";

alter table "public"."modules" add constraint "modules_boat_id_fkey" FOREIGN KEY (boat_id) REFERENCES boats(id) ON DELETE CASCADE not valid;

alter table "public"."modules" validate constraint "modules_boat_id_fkey";

alter table "public"."modules" add constraint "modules_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(user_id) ON DELETE CASCADE not valid;

alter table "public"."modules" validate constraint "modules_created_by_fkey";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

set check_function_bodies = off;


