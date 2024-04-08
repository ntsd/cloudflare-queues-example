import { task, TaskInput } from "./task";

type Environment = {
  readonly MY_QUEUE: Queue<TaskInput>;
  QUEUE_AUTH_SECRET: string;
};

export default {
  // Producer
  async fetch(req: Request, env: Environment): Promise<Response> {
    // Authenticate that the client has the correct auth key
    if (env.QUEUE_AUTH_SECRET == "") {
      return Response.json(
        { err: "application not configured" },
        { status: 500 }
      );
    }
    let authToken = req.headers.get("Authorization") || "";
    let encoder = new TextEncoder();
    // Securely compare our secret with the auth token provided by the client
    try {
      if (
        !crypto.subtle.timingSafeEqual(
          encoder.encode(env.QUEUE_AUTH_SECRET),
          encoder.encode(authToken)
        )
      ) {
        return Response.json(
          { err: "invalid auth token provided" },
          { status: 403 }
        );
      }
    } catch (e) {
      return Response.json(
        { err: "invalid auth token provided" },
        { status: 403 }
      );
    }

    // Parse the request body as JSON
    let messages: TaskInput;
    try {
      messages = await req.json<TaskInput>();
    } catch (e) {
      // Return a HTTP 400 (Bad Request) if the payload isn't JSON
      return Response.json({ err: "payload not valid JSON" }, { status: 500 });
    }

    // Publish to the Queue
    try {
      await env.MY_QUEUE.send(messages);
    } catch (e: any) {
      console.log(`failed to publish the queue: ${e}`);
      // Return a HTTP 500 (Internal Error) if our publish operation fails
      return Response.json({ error: e.message }, { status: 500 });
    }

    // Return a HTTP 200 if the send succeeded!
    return Response.json({ success: true });
  },
  // Consumer
  async queue(
    batch: MessageBatch<TaskInput>,
    env: Environment,
    ctx: ExecutionContext
  ): Promise<void> {
    for (const message of batch.messages) {
      ctx.waitUntil(task(message.body));
      message.ack();
    }
  },
};
