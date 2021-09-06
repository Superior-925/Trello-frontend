export interface responseExecutor {
  body: {
    user: {
      id: number,
      email:string
    },
    task: {
      id: number
    }
  }
}

