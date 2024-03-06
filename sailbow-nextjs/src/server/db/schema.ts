import { mysqlTable, int, varchar, text, timestamp, boolean, primaryKey, json, index, bigint } from "drizzle-orm/mysql-core";
import { InferInsertModel, InferSelectModel, relations, sql } from "drizzle-orm";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

type UserIdColumnOpts = {
	columnName?: string,
	nullable?: boolean
}
const userIdColumn = (opts?: UserIdColumnOpts | undefined) => {
	const col = varchar(opts?.columnName ?? "user_id", { length: 256 })
	return opts?.nullable ? col : col.notNull()
}

const createdOnColumn = () => timestamp("created_on")
	.notNull()
	.default(sql`CURRENT_TIMESTAMP`)

// Tables
export const boats = mysqlTable("boats", {
	id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
	name: varchar("name", { length: 50 }).notNull(),
	description: varchar("description", { length: 256 }),
	captainUserId: userIdColumn({ columnName: "captain_user_id" }),
	createdOn: createdOnColumn()
})

export const boatBanners = mysqlTable("boat_banners", {
	boatId: bigint("boat_id", { mode: "number" }).primaryKey(),
	show: boolean("show").notNull().default(true),
	type: varchar("type", { length: 256, enum: ["color", "url"] }).notNull(),
	value: text("value").notNull(),
	position: int("position").notNull().default(0),
})

export const crewMembers = mysqlTable("crew_members", {
	boatId: bigint("boat_id", { mode: "number" }).notNull(),
	userId: userIdColumn({ nullable: true }),
	email: varchar("email", { length: 256 }),
	role: varchar("role", { length: 25, enum: ["captain", "firstMate", "crewMember"] }).notNull(),
	createdOn: createdOnColumn()
}, (table) => ({
	boatIdIdx: index("boat_id_idx").on(table.boatId),
	userIdIdx: index("user_id_idx").on(table.userId),
	emailIdx: index("email_idx").on(table.email)
}))

export const modules = mysqlTable("modules", {
	id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
	boatId: bigint("boat_id", { mode: "number" }).notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	description: varchar("description", { length: 256 }),
	order: int("order").notNull(),
	createdOn: createdOnColumn(),
	type: varchar("type", { length: 50 }).$type<ModuleType>().notNull(),
	finalizedOptionId: bigint("finalized_option_id", { mode: "number" }),
	authorId: userIdColumn({ columnName: "author_id" })
}, (table) => ({
	boatIdIdx: index("boat_id_idx").on(table.boatId)
}))

export const moduleSettings = mysqlTable("module_settings", {
	moduleId: bigint("module_id", { mode: "number" }).primaryKey(),
	allowMultiple: boolean("allow_multiple").default(false).notNull(),
	anonymousVoting: boolean("anonymous_voting").default(false).notNull(),
	deadline: timestamp("deadline")
})

export const moduleComments = mysqlTable("module_comments", {
	id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
	moduleId: bigint("module_id", { mode: "number" }).notNull(),
	userId: userIdColumn(),
	comment: varchar("comment", { length: 256 }).notNull(),
}, (table) => ({
	moduleIdIdx: index("module_id_idx").on(table.moduleId)
}))

export const moduleOptions = mysqlTable("module_options", {
	id: bigint("id", { mode: "number" }).primaryKey().notNull().autoincrement(),
	moduleId: bigint("module_id", { mode: "number" }).notNull(),
	data: json("data").$type<ModuleOptionData>().notNull()
}, (table) => ({
	moduleIdIdx: index("module_id_idx").on(table.moduleId)
}))

export const moduleOptionVotes = mysqlTable("module_option_votes", {
	userId: userIdColumn(),
	moduleOptionId: bigint("module_option_id", { mode: "number" }).notNull(),
}, (table) => ({
	pk: primaryKey(table.userId, table.moduleOptionId),
	userIdIdx: index("user_id_idx").on(table.userId),
	moduleOptionIdIdx: index("module_option_id_idx").on(table.moduleOptionId)
}))


// Relations
export const boatsRelations = relations(boats, ({ one, many }) => ({
	banner: one(boatBanners, {
		fields: [boats.id],
		references: [boatBanners.boatId]
	}),
	crew: many(crewMembers),
	modules: many(modules)
}))

export const boatBannersRelations = relations(boatBanners, ({ one }) => ({
	boat: one(boats, {
		fields: [boatBanners.boatId],
		references: [boats.id]
	})
}))

export const crewMembersRelations = relations(crewMembers, ({ one }) => ({
	boat: one(boats, {
		fields: [crewMembers.boatId],
		references: [boats.id]
	})
}))

export const modulesRelations = relations(modules, ({ one, many }) => ({
	settings: one(moduleSettings, {
		fields: [modules.id],
		references: [moduleSettings.moduleId]
	}),
	finalizedOption: one(moduleOptions, {
		fields: [modules.finalizedOptionId],
		references: [moduleOptions.id]
	}),
	comments: many(moduleComments),
	options: many(moduleOptions)
}))

export const moduleSettingsRelations = relations(moduleSettings, ({ one }) => ({
	module: one(modules, {
		fields: [moduleSettings.moduleId],
		references: [modules.id]
	})
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

// Core schemas
export const BoatSchema = createSelectSchema(boats)
export const CreateBoatSchema = createInsertSchema(boats)
	.omit({ id: true, createdOn: true })
export const BoatBannerSchema = createInsertSchema(boatBanners)

export const CrewMemberSchema = createSelectSchema(crewMembers)
export const CreateCrewMemberSchema = createInsertSchema(crewMembers)
	.extend({ email: z.string().email() })

// Core types
export type Boat = InferSelectModel<typeof boats>
export type BoatBanner = InferSelectModel<typeof boatBanners>
export type BoatAndBanner = Boat & { banner: BoatBanner }
export type CrewMember = InferSelectModel<typeof crewMembers>
export type CrewMemberRole = CrewMember["role"]
export type InsertCrewMember = z.infer<typeof CreateCrewMemberSchema>
export type Module = InferSelectModel<typeof modules>
export type ModuleSettings = InferSelectModel<typeof moduleSettings>
export type ModuleOption = InferSelectModel<typeof moduleOptions>
export type ModuleComment = InferSelectModel<typeof moduleComments>
export type ModuleOptionVote = InferSelectModel<typeof moduleOptionVotes>

// Module data options
const dateModuleOptionSchema = z.object({
	type: z.literal("date"),
	start: z.date(),
	end: z.date().nullish()
})
const locationModuleOptionSchema = z.object({
	type: z.literal("location"),
	address: z.string()
})

export const moduleDataSchemas = z.discriminatedUnion("type", [
	dateModuleOptionSchema,
	locationModuleOptionSchema
])

export type DateModuleOptionData = z.infer<typeof dateModuleOptionSchema>
export type LocationModuleOptionData = z.infer<typeof locationModuleOptionSchema>
export type ModuleOptionData = z.infer<typeof moduleDataSchemas>
export type ModuleType = z.infer<typeof moduleDataSchemas>[typeof moduleDataSchemas.discriminator]