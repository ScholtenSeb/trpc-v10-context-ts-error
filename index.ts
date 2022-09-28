import * as trpc from "@trpc/server";
import { createTRPCClient } from "@trpc/client";
import { z } from "zod";

interface Context {
  userId: string;
}

const createRouterWithoutContext = () => trpc.router();
const createRouterWithContext = () => trpc.router<Context>();

const createRouter = createRouterWithContext; // this will cause a typescript error on line 32 & 34
// const createRouter = createRouterWithoutContext; // this will be fine

const greet = createRouter().mutation("greet", {
  input: z.object({
    name: z.string(),
  }),
  resolve: ({ input }) => `hello ${input}`,
});

const router = createRouter()
  .mutation("test", {
    input: z.string(),
    resolve: () => "this is a test",
  })
  .merge(greet)
  .interop();

const caller = router.createCaller({ userId: "user1" });

caller.mutation("test", "hello world");

caller.mutation("greet", { name: "John" });
// TS error: Argument of type '{ name: string; }' is not assignable to parameter of type 'null | undefined'.

const client = createTRPCClient<typeof router>({
  links: [],
});

client.mutation("greet", { name: "Amy" });
