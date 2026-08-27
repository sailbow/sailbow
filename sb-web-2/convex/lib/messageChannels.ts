import {
  GenericDatabaseReader,
  GenericDatabaseWriter,
  GenericMutationCtx,
  PaginationOptions,
} from "convex/server";
import { DataModel, Id } from "../_generated/dataModel";
import { DbReader, DbWriter } from "../dbUtils";
import { FluentQuery } from "./queryUtils";

export const getOrCreateMessageChannel = async (
  db: DbWriter,
  channelId?: Id<"messageChannels">,
) => {
  const messageChannelId =
    channelId ?? (await db.insert("messageChannels", {}));

  const result = await db
    .query("messageChannels")
    .withIndex("by_id", (q) => q.eq("_id", messageChannelId))
    .unique();
  if (!result) throw new Error("Failed to get or create a new message channel");
  return {
    messageChannel: result,
    created: !channelId,
  };
};

export const getChannelMessages = async ({
  q,
  channelId,
  paginationOpts,
  currentUserId,
}: {
  q: FluentQuery;
  currentUserId: Id<"users">;
  channelId: Id<"messageChannels">;
  paginationOpts: PaginationOptions;
}) => {
  const result = await q.messageChannelMessages
    .byMessageChannelId(channelId)
    .with(({ userId }) => ({
      user: q.users.find(userId),
    }))
    .paginate(paginationOpts);
  return {
    ...result,
    page: result.page.map((m) => ({
      ...m,
      user: {
        _id: m.user._id,
        firstName: m.user.firstName,
        lastName: m.user.lastName,
        imageUrl: m.user.imageUrl,
        isMe: m.user._id === currentUserId,
      },
    })),
  };
};
