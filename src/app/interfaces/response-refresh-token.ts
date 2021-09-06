export interface responseRefreshToken {
  body: {
    token: string,
    refresh: {
      token: string
    }
  }
}
