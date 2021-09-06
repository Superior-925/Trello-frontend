export interface responseRestoreSingleTask {
  body: {
    listName: string,
    taskTitle: string,
    taskText: string,
    id: number,
    order: number,
  }
  status: number
}
