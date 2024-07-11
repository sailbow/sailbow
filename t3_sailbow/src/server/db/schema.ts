import { pgTable, integer, varchar, text, timestamp, boolean, primaryKey, json, index, serial, type AnyPgColumn } from "drizzle-orm/pg-core";
import { type SQL, relations, sql } from "drizzle-orm";
import { z } from "zod";

type UserIdColumnOpts = {
	columnName?: string,
}
const userIdColumn = (opts?: UserIdColumnOpts | undefined) => {
	return varchar(opts?.columnName ?? "user_id", { length: 256 });
}

const sqlDefaultUtcNow = sql`(current_timestamp AT TIME ZONE 'UTC')`;

const createdOn = timestamp("created_on", { withTimezone: true}).notNull().default(sqlDefaultUtcNow);

export type BoatBanner = {
	thumbnail: string,
	small: string,
	regular: string,
	full: string,
	alt: string,
}

// Tables
export const boats = pgTable("boats", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 50 }).notNull(),
	slug: varchar("slug", { length: 50}),
	description: text("description"),
	captainUserId: userIdColumn({ columnName: "captain_user_id" }).notNull(),
	banner: json("banner").$type<BoatBanner | null>().default(null),
	createdOn: createdOn
}, (table) => ({
	boatNameIdx: index().on(table.name),
	boatSlugIdx: index().on(table.slug)
}))

export const crewMembers = pgTable("crew_members", {
	boatId: integer("boat_id").notNull().references(() => boats.id),
	userId: userIdColumn(),
	email: varchar("email", { length: 256 }).notNull(),
	role: varchar("role", { length: 25, enum: ["captain", "firstMate", "crewMember"] }).notNull(),
	createdOn
}, (table) => ({
	primaryKey: primaryKey({ columns: [table.boatId, table.email]}),
	boatIdIdx: index().on(table.boatId),
	userIdIdx: index().on(table.userId),
	emailIdx: index().on(table.email)
}))

export const modules = pgTable("modules", {
	id: serial("id").primaryKey(),
	boatId: integer("boat_id").notNull().references(() => boats.id),
	name: varchar("name", { length: 256 }).notNull(),
	description: varchar("description", { length: 256 }),
	order: integer("order").notNull(),
	createdOn,
	type: varchar("type", { length: 50 }).notNull(),
	finalizedOptionId: integer("finalized_option_id"),
	allowMultipleVotes: boolean("allow_multiple").default(false).notNull(),
	anonymousVoting: boolean("anonymous_voting").default(false).notNull(),
	votingDeadline: timestamp("deadline"),
	authorId: userIdColumn({ columnName: "author_id" }).notNull()
}, (table) => ({
	boatIdIdx: index().on(table.boatId)
}))

export const moduleComments = pgTable("module_comments", {
	id: serial("id").primaryKey(),
	moduleId: integer("module_id").notNull().references(() => modules.id),
	userId: userIdColumn().notNull(),
	comment: varchar("comment", { length: 256 }).notNull(),
}, (table) => ({
	moduleIdIdx: index().on(table.moduleId)
}))

export const moduleOptions = pgTable("module_options", {
	id: serial("id").primaryKey().notNull(),
	moduleId: integer("module_id").notNull().references(() => modules.id),
	data: json("data").notNull()
}, (table) => ({
	moduleIdIdx: index().on(table.moduleId)
}))

export const moduleOptionVotes = pgTable("module_option_votes", {
	userId: userIdColumn().notNull(),
	moduleOptionId: integer("module_option_id").notNull().references(() => moduleOptions.id),
}, (table) => ({
	pk: primaryKey({ columns: [table.userId, table.moduleOptionId]}),
	userIdIdx: index().on(table.userId),
	moduleOptionIdIdx: index().on(table.moduleOptionId)
}))


// Relations
export const boatsRelations = relations(boats, ({ many }) => ({
	crew: many(crewMembers),
	modules: many(modules)
}))

export const crewMembersRelations = relations(crewMembers, ({ one }) => ({
	boat: one(boats, {
		fields: [crewMembers.boatId],
		references: [boats.id],
	})
}))

export const modulesRelations = relations(modules, ({ one, many }) => ({
	boat: one(boats, {
		fields: [modules.boatId],
		references: [boats.id]
	}),
	finalizedOption: one(moduleOptions, {
		fields: [modules.finalizedOptionId],
		references: [moduleOptions.id]
	}),
	comments: many(moduleComments),
	options: many(moduleOptions)
}))

export const moduleCommentsRelations = relations(moduleComments, ({ one }) => ({
	module: one(modules, {
		fields: [moduleComments.moduleId],
		references: [modules.id]
	})
}))

export const moduleOptionsRelations = relations(moduleOptions, ({ one, many }) => ({
	module: one(modules, {
		fields: [moduleOptions.moduleId],
		references: [modules.id]
	}),
	votes: many(moduleOptionVotes)
}))

export const moduleOptionVotesRelations = relations(moduleOptionVotes, ({ one }) => ({
	option: one(moduleOptions, {
		fields: [moduleOptionVotes.moduleOptionId],
		references: [moduleOptions.id]
	})
}))


export function lower(column: AnyPgColumn): SQL {
  return sql`lower(${column})`;
}