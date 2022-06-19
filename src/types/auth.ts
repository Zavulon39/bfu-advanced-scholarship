const login = (
  id: number,
  fio: string,
  email: string,
  avatarUlr: string,
  role: Role,
  learningPlans: string[]
) => {}
const saveStudentEmail = (email: string) => {}

export interface IAuthState {
  id: number
  fio: string
  email: string
  avatarUrl: string
  role: Role
  learningPlans: string[]
  login: typeof login
  saveStudentEmail: typeof saveStudentEmail
}

export type Role = 'admin' | 'student' | 'anonymous'
