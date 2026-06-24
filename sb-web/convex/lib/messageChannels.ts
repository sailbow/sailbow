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

export const getChannelMessages = ({
  q,
  channelId,
  paginationOpts,
}: {
  q: FluentQuery;
  channelId: Id<"messageChannels">;
  paginationOpts: PaginationOptions;
}) => {
  return q.messageChannelMessages
    .byMessageChannelId(channelId)
    .order("desc")
    .paginate(paginationOpts);
};
