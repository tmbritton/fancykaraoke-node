import subscriptions from "./helpers/globalSubscriptions";
import { type MiddlewareHandler } from "astro";
export const onRequest: MiddlewareHandler = (context, next) => {
  // @ts-ignore
  context.locals.subscriptions = subscriptions
  next()
};