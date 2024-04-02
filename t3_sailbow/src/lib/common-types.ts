import { type InferSelectModel } from "drizzle-orm";
import { boats, type crewMembers, type modules, type moduleComments, type moduleOptions, type moduleOptionVotes } from "@/server/db/schema";


export type CrewMember = InferSelectModel<typeof crewMembers>
export type Module = InferSelectModel<typeof modules>
export type ModuleComment = InferSelectModel<typeof moduleComments>
export type ModuleOption = InferSelectModel<typeof moduleOptions>
export type ModuleOptionVote = InferSelectModel<typeof moduleOptionVotes>