/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import {
  actionGeneric,
  httpActionGeneric,
  queryGeneric,
  mutationGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
  componentsGeneric,
} from "convex/server";
import type {
  ActionBuilder,
  HttpActionBuilder,
  QueryBuilder,
  MutationBuilder,
  InternalActionBuilder,
  InternalMutationBuilder,
  InternalQueryBuilder,
  ComponentsObject,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

/**
 * Define a query in this Convex app's public API.
 *
 * This function is used to define query functions. Example:
 *
 * ```js
 * export default query({
 *   args: { taskId: v.id("tasks") },
 *   handler: async (ctx, args) => {
 *     return await ctx.db.get(args.taskId);
 *   },
 * });
 * ```
 */
export declare const query: QueryBuilder<DataModel, "public">;

/**
 * Define a mutation in this Convex app's public API.
 *
 * This function is used to define mutation functions. Example:
 *
 * ```js
 * export default mutation({
 *   args: { taskId: v.id("tasks") },
 *   handler: async (ctx, args) => {
 *     return await ctx.db.delete(args.taskId);
 *   },
 * });
 * ```
 */
export declare const mutation: MutationBuilder<DataModel, "public">;

/**
 * Define an action in this Convex app's public API.
 *
 * This function is used to define action functions. Example:
 *
 * ```js
 * export default action({
 *   args: { taskId: v.id("tasks") },
 *   handler: async (ctx, args) => {
 *     return await ctx.runQuery(api.messages.getByTaskId, {taskId: args.taskId});
 *   },
 * });
 * ```
 */
export declare const action: ActionBuilder<DataModel, "public">;

/**
 * Define an HTTP action.
 *
 * This function is used to define HTTP action functions. Example:
 *
 * ```js
 * export default httpAction(async (ctx, request) => {
 *   const { searchParams } = new URL(request.url);
 *   const taskId = searchParams.get("taskId");
 *   return new Response(taskId);
 * });
 * ```
 */
export declare const httpAction: HttpActionBuilder;

/**
 * Define a query that is only accessible from other Convex functions (not from the client).
 *
 * This function is used to define internal query functions. Example:
 *
 * ```js
 * export default internalQuery({
 *   args: { taskId: v.id("tasks") },
 *   handler: async (ctx, args) => {
 *     return await ctx.db.get(args.taskId);
 *   },
 * });
 * ```
 */
export declare const internalQuery: InternalQueryBuilder<DataModel>;

/**
 * Define a mutation that is only accessible from other Convex functions (not from the client).
 *
 * This function is used to define internal mutation functions. Example:
 *
 * ```js
 * export default internalMutation({
 *   args: { taskId: v.id("tasks") },
 *   handler: async (ctx, args) => {
 *     return await ctx.db.delete(args.taskId);
 *   },
 * });
 * ```
 */
export declare const internalMutation: InternalMutationBuilder<DataModel>;

/**
 * Define an action that is only accessible from other Convex functions (not from the client).
 *
 * This function is used to define internal action functions. Example:
 *
 * ```js
 * export default internalAction({
 *   args: { taskId: v.id("tasks") },
 *   handler: async (ctx, args) => {
 *     return await ctx.runQuery(internal.messages.getByTaskId, {taskId: args.taskId});
 *   },
 * });
 * ```
 */
export declare const internalAction: InternalActionBuilder<DataModel>;

/**
 * Reference to the components defined in `convex.config.ts`.
 */
declare const components: ComponentsObject;
export { components };
