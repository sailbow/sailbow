create type "public"."boat_role" as enum ('Captain', 'FirstMate', 'Sailor');

alter table "public"."boats" alter column "created_at" set not null;

alter table "public"."crew_members" alter column "created_at" set not null;

alter table "public"."crew_members" alter column "role" set data type boat_role using "role"::boat_role;


