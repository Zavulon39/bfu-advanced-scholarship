const login = (id: number, fio: string, avatarUlr: string, role: Role) => {}

export interface IAuthState {
  id: number
  fio: string
  avatarUrl: string
  role: Role
  login: typeof login
}

export type Role = 'admin' | 'student' | 'anonymous'
