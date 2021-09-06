export interface responseUserData {
  status: number,
  body: {
    token: string,
    userId: string,
    refresh: {
      token: string
    }
  }
}
