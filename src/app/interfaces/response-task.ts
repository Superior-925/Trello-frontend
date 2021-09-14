export interface responseTask {
  taskTitle: string,
  taskText: string,
  id: number,
  order: number
  list: {
    id: number,
    listName: string,
  }
}
