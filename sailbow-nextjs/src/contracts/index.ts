import { z, type ZodType } from "zod";

export type RequestContract = { requestSchema: ZodType }
export type ResponseContract = { responseSchema: ZodType }
export type RequestResponseContract = RequestContract & ResponseContract
export type InferRequestType<T extends RequestContract> = z.infer<T["requestSchema"]>
export type InferResponseType<T extends ResponseContract> = z.infer<T["responseSchema"]>