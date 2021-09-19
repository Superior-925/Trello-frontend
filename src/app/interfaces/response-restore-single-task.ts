export interface responseRestoreSingleTask {
  body: {
    listId: number,
    taskTitle: string,
    taskText: string,
    id: number,
    order: number,
  }
  status: number
}
