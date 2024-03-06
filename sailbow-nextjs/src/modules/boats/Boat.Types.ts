import { z } from 'zod'
import { type User } from '@clerk/nextjs/server'
import {
    boats,
    boatBanners,
    crewMembers,
    modules,
    moduleSettings,
    moduleOptions,
    moduleComments,
    moduleOptionVotes
} from '@/server/db/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export type Boat = InferSelectModel<typeof boats> & {
    banner: BoatBanner,
    crew: CrewMember[],
    captain?: CrewMember,
    modules?: Module[]
}

const crewMemberSchema = createSelectSchema(crewMembers).extend({ email: z.string().email() })
export type BoatBanner = InferSelectModel<typeof boatBanners>
export type BannerType = BoatBanner["type"]
export type CrewMember = z.infer<typeof crewMemberSchema>
export type CrewMemberRole = CrewMember["role"]

const moduleSchema = createSelectSchema(modules)
    .extend({
        options: z.array(createSelectSchema(moduleOptions)).default([]),
        finalizedOption: createSelectSchema(moduleOptions).nullable(),
        comments: z.array(createSelectSchema(moduleComments)).default([]),
        settings: createSelectSchema(moduleSettings).nullable()
    })

export type Module = z.infer<typeof moduleSchema>
export type ModuleSettings = InferSelectModel<typeof moduleSettings>

const moduleOptionSchema = createSelectSchema(moduleOptions)
    .extend({
        votes: z.array(createSelectSchema(moduleOptionVotes)).default([]),
        data: z.custom<ModuleOptionData>().nullable()
    })

export type ModuleOption = z.infer<typeof moduleOptionSchema>
export type ModuleComment = InferSelectModel<typeof moduleComments>
export type ModuleOptionVote = InferSelectModel<typeof moduleOptionVotes>

export const CreateBoatSchema = createInsertSchema(boats)
	.omit({ id: true, createdOn: true })
    .extend({
        description: z.string().nullable(),
        banner: createInsertSchema(boatBanners)
            .omit({ boatId: true }),
        crew: z.array(createInsertSchema(crewMembers)
            .omit({ boatId: true, createdOn: true }))
    })

export const CreateCrewMemberSchema = createInsertSchema(crewMembers)
	.extend({ email: z.string().email() })
	.omit({ createdOn: true })

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

export enum ModuleMode {
    View,
    Settings,
    Edit,
}

export type CreateBoat = z.infer<typeof CreateBoatSchema>
export interface EditBoat extends Omit<Boat, 'modules'> {}

export const PhotoScema = z.object({
    src: z.string().url(),
    width: z.number().min(1),
    height: z.number().min(1)
})

export type Photo = z.infer<typeof PhotoScema>

// export interface CrewMember extends Pick<User, 'id' | 'email' | 'name'> {
//     role: Exclude<Role, 'Owner'>;
//     info?: string;
// }

// export interface ModuleSettings {
//     allowMultiple: boolean;
//     anonymousVoting: boolean;
//     deadline?: string;
//     [key: string]: any;
// }

export interface ModuleOptionExtended extends ModuleOption {
    isEditing?: boolean;
    author: User
    selected: boolean;
    errors?: {
        [key: string]: string;
    };
}

// export interface Module<T> {
//     id: string;
//     name: string;
//     type: ModuleType;
//     order: number;
//     description: string;
//     totalVotes: CrewMember[];
//     settings: ModuleSettings;
//     actionRequired?: boolean;
//     finalizedOptionId?: string;
//     data: ModuleData<T>[];
// }

export interface ModuleOptionExtended extends Module {
    dataLoaded?: boolean;
    error?: any;
    loading: boolean;
    mode: ModuleMode;
}

export interface BoatExtended extends Boat {
    modules: ModuleOptionExtended[];
}

export interface BoatState {
    boats?: BoatExtended[];
    activeBoat?: BoatExtended;
    error?: any;
    loading: {
        create: boolean;
        get: boolean;
        getAll: boolean;
    };
}
