export interface TaskInput {
  data: string;
}

export async function task(input: TaskInput) {
  console.log("task is running");

  console.log("task input data", input.data);

  console.log("task is finished");
}
