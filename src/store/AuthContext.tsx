import React, { createContext, ReactElement, useReducer } from 'react'
import { IAuthState, Role } from '../types/auth'
import { IAction } from '../types/companies'

const initialState: IAuthState = {
  id: 0,
  fio: '',
  avatarUrl:
    'https://avatars.mds.yandex.net/get-ott/374297/2a000001616b87458162c9216ccd5144e94d/678x380',
  role: 'anonymous',
  learningPlans: [],

  login: () => {},
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
    avatarUrl: string,
    role: Role,
    learningPlans: string[]
  ) => {
    dispatch({
      type: 'LOGIN',
      payload: {
        id,
        fio,
        avatarUrl,
        role,
        learningPlans,
      },
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
