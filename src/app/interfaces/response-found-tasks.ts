export interface responseFoundTasks {
  body: [{
    id: number,
    listName: string,
    tasks: [{
      taskTitle: string,
      taskText: string,
      id: number,
      order: number
    }]
  }]
}

