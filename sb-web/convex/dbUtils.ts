import { GenericDatabaseReader, GenericDatabaseWriter } from "convex/server";
import { DataModel } from "./_generated/dataModel";

export type DbReader = GenericDatabaseReader<DataModel>;
export type DbWriter = GenericDatabaseWriter<DataModel>;
