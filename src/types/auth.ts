const login = (
  id: number,
  fio: string,
  avatarUlr: string,
  role: Role,
  learningPlans: string[]
) => {}

export interface IAuthState {
  id: number
  fio: string
  avatarUrl: string
  role: Role
  learningPlans: string[]
  login: typeof login
}

export type Role = 'admin' | 'student' | 'anonymous'
