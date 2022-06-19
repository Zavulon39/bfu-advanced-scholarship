import React, { createContext, ReactElement, useReducer } from 'react'
import $api from '../http'
import { IAuthState, Role } from '../types/auth'
import { IAction } from '../types/companies'

const initialState: IAuthState = {
  id: 0,
  fio: '',
  email: '',
  avatarUrl:
    'https://avatars.mds.yandex.net/get-ott/374297/2a000001616b87458162c9216ccd5144e94d/678x380',
  role: 'anonymous',
  learningPlans: [],

  login: () => {},
  saveStudentEmail: () => {},
}

interface IProps {
  children?: ReactElement
}

const reducer = (state = initialState, action: IAction): IAuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        ...action.payload,
      }
    case 'SAVE_STUDENT_EMAIL':
      return {
        ...state,
        email: action.payload,
      }
    default:
      return state
  }
}

export const AuthContext = createContext(initialState)

export const AuthProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const login = (
    id: number,
    fio: string,
    email: string,
    avatarUrl: string,
    role: Role,
    learningPlans: string[]
  ) => {
    dispatch({
      type: 'LOGIN',
      payload: {
        id,
        fio,
        email,
        avatarUrl,
        role,
        learningPlans,
      },
    })
  }
  const saveStudentEmail = (email: string) => {
    $api.post('/api/auth/save-student-email/', {
      id: state.id,
      email,
    })

    dispatch({
      type: 'SAVE_STUDENT_EMAIL',
      payload: email,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        saveStudentEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
