# Cloudflare Worker Queues Example

This is a basic example of how to use Cloudflare Worker with Queue to handle async tasks.
The example is pushing messages to a queue and the worker is consuming the messages and executing the task.

1. The producer will receive HTTP request to push the message to the queue

2. The consumer will consume the message and run the async task

Cloudflare Queue (Producer) -> Cloudflare Worker (Consumer) -> Async task

## Requirements

- Node

## Instructions

Follow the steps below to deploy the Cloudflare Worker Queue.

### 1. Install packages

`npm install`

### 2. Add Secret

To add or update your Queue Auth Secret to can run the command below, or you can use the Cloudflare Web UI

`npx wrangler secret put QUEUE_AUTH_SECRET`

### 3. Deploy worker

to deploy the worker, run the command below.

`npm run deploy`

If you found the queue not found error you need to create a queue name `my-queue` on your Cloudflare.

## Log worker

to log the worker, run the command below.

`npm run log`

## Send test message

```sh
POST / HTTP/1.1
Host: your-worker-name.your-username.workers.dev
Authorization: your_queue_auth_key
Content-Type: application/json

{
  "data": "foo",
}
```
