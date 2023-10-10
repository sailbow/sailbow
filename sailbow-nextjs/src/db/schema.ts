import { pgTable, varchar, text, timestamp, boolean, integer, json, serial, primaryKey } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
// TODOS:
// 1) Indexes
// 2) Polymorphic typing on module_options.data json column

export const boats = pgTable("boats", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	description: varchar("description", { length: 256 }),
	captainUserId: text("captain_user_id").notNull(),
	createdOn: timestamp("created_on", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const boatsRelations = relations(boats, ({ one, many }) => ({
	banner: one(boatBanners, {
		fields: [boats.id],
		references: [boatBanners.boatId]
	}),
	crew: many(crewMembers)
}))


export const boatBanners = pgTable("boat_banners", {
	boatId: integer("boat_id").primaryKey().notNull().references(() => boats.id, { onDelete: "cascade" }),
	show: boolean("show").notNull().default(true),
	type: text("type", { enum: ["color", "url"] }).notNull(),
	value: text("value").notNull(),
	position: integer("position"),
})

export const boatBannersRelations = relations(boatBanners, ({ one }) => ({
	boat: one(boats, {
		fields: [boatBanners.boatId],
		references: [boats.id]
	})
}))

export const crewMembers = pgTable("crew_members", {
	boatId: integer("boat_id").notNull().references(() => boats.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull(),
	role: text("role", { enum: ["captain", "firstMate", "crewMember"] }).notNull(),
	createdOn: timestamp("created_on", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
}, (cm) => ({
	pk: primaryKey(cm.boatId, cm.userId),
}))

export const crewMembersRelations = relations(crewMembers, ({ one }) => ({
	boat: one(boats, {
		fields: [crewMembers.boatId],
		references: [boats.id]
	})
}))

export const modules = pgTable("modules", {
	id: serial("id").primaryKey().notNull(),
	boatId: integer("boat_id").notNull().references(() => boats.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 250 }),
	order: integer("order").notNull(),
	createdOn: timestamp("created_on", { withTimezone: true, mode: "string" }).notNull(),
	type: text("type", { enum: ["date", "location"] }).notNull(),
	finalizedOptionId: integer("finalized_option_id"),
	authorId: text("author_id").notNull(),
})

export const modulesRelations = relations(modules, ({ one, many }) => ({
	settings: one(moduleSettings, {
		fields: [modules.id],
		references: [moduleSettings.moduleId]
	}),
	finalizedOption: one(moduleOptions, {
		fields: [modules.finalizedOptionId],
		references: [moduleOptions.id]
	}),
	options: many(moduleOptions)
}))

export const moduleSettings = pgTable("module_settings", {
	moduleId: integer("module_id").primaryKey().notNull().references(() => modules.id, { onDelete: "cascade" }),
	allowMultiple: boolean("allow_multiple").default(false).notNull(),
	anonymousVoting: boolean("anonymous_voting").default(false).notNull(),
	deadline: timestamp("deadline", { withTimezone: true, mode: "string" }),
})

export const moduleSettingsRelations = relations(moduleSettings, ({ one }) => ({
	module: one(modules, {
		fields: [moduleSettings.moduleId],
		references: [modules.id]
	})
}))

export const moduleOptions = pgTable("module_options", {
	id: serial("id").primaryKey().notNull(),
	moduleId: integer("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
	data: json("data").$type<{ type: typeof modules.type.enumValues }>().notNull()
})

export const moduleOptionsRelations = relations(moduleOptions, ({ one, many }) => ({
	module: one(modules, {
		fields: [moduleOptions.moduleId],
		references: [modules.id]
	}),
	votes: many(moduleOptionVotes)
}))

export const moduleOptionVotes = pgTable("module_option_votes", {
	userId: text("user_id").notNull(),
	moduleOptionId: integer("module_option_id").notNull().references(() => moduleOptions.id, { onDelete: "cascade" }),
}, (v) => ({
	pk: primaryKey(v.moduleOptionId, v.userId)
}))

export const moduleOptionVotesRelations = relations(moduleOptionVotes, ({ one }) => ({
	option: one(moduleOptions, {
		fields: [moduleOptionVotes.moduleOptionId],
		references: [moduleOptions.id]
	})
}))

export type Boat = InferSelectModel<typeof boats> & { banner: BoatBanner }
export type BoatBanner = InferSelectModel<typeof boatBanners>