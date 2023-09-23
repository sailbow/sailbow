import { pgTable, varchar, text, timestamp, boolean, integer, json, serial } from "drizzle-orm/pg-core";

// TODOS:
// 1) Indexes
// 2) Polymorphic typing on module_options.data json column
export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	email: varchar("email", { length: 256 }).notNull().unique(),
	phone: text("phone").unique(),
	hash: varchar("hash", { length: 256 }),
	createdOn: timestamp("created_on", { withTimezone: true }).notNull().defaultNow(),
});

export const boats = pgTable("boats", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	description: varchar("description", { length: 256 }),
	captainUserId: integer("captain_user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	createdOn: timestamp("created_on", { withTimezone: true }).notNull().defaultNow(),
});

export const boatBanners = pgTable("boat_banners", {
	boatId: integer("boat_id").primaryKey().notNull().references(() => boats.id, { onDelete: "cascade" } ),
	show: boolean("show").notNull().default(true),
	type: text("type", { enum: [ "color", "url" ] }).notNull(),
	value: text("value").notNull(),
	position: integer("position"),
});

export const crewMembers = pgTable("crew_members", {
	id: serial("id").primaryKey().notNull(),
	boatId: integer("boat_id").notNull().references(() => boats.id, { onDelete: "cascade" } ),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	role: text("role", { enum: [ "captain", "firstMate", "crewMember" ]}).notNull(),
	createdOn: timestamp("created_on", { withTimezone: true }).notNull().defaultNow(),
});

export const modules = pgTable("modules", {
	id: serial("id").primaryKey().notNull(),
	boatId: integer("boat_id").notNull().references(() => boats.id, { onDelete: "cascade" } ),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 250 }),
	order: integer("order").notNull(),
	finalizedOptionId: integer("finalized_option_id"),
	createdOn: timestamp("created_on", { withTimezone: true }).notNull(),
	type: text("type", { enum: [ "date", "location" ]}).notNull(),
	authorUserId: integer("author_user_id").notNull().references(() => users.id)
})

export const moduleSettings = pgTable("module_settings", {
	moduleId: integer("module_id").primaryKey().notNull().references(() => modules.id, { onDelete: "cascade" } ),
	allowMultiple: boolean("allow_multiple").default(false).notNull(),
	anonymousVoting: boolean("anonymous_voting").default(false).notNull(),
	deadline: timestamp("deadline", { withTimezone: true }),
});

export const moduleOptions = pgTable("module_options", {
	id: serial("id").primaryKey().notNull(),
	moduleId: integer("module_id").notNull().references(() => modules.id, { onDelete: "cascade" } ),
	data: json("data").notNull()
})

export const moduleOptionVotes = pgTable("module_option_votes", {
	crewMemberId: integer("crew_member_id").notNull().references(() => crewMembers.id, { onDelete: "cascade" } ),
	moduleOptionId: integer("module_option_id").notNull().references(() => moduleOptions.id, { onDelete: "cascade" } ),
})