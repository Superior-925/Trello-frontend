export interface responseExecutors {
  body: [{
    id: number,
    listName: string,
    tasks: [{
      taskTitle: string,
      taskText: string,
      id: number,
      order: number
      users: [{
        email: string,
        id: number
      }]
    }]
  }]
}
