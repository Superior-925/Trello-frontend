export interface responseTasks {
  id: number,
  listName: string,
  tasks: [{
    taskTitle: string,
    taskText: string,
    id: number,
    order: number
  }]
}

