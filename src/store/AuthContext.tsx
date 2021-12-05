import React, { createContext, ReactElement, useReducer } from 'react'
import { IAuthState, Role } from '../types/auth'
import { IAction } from '../types/companies'

const initialState: IAuthState = {
  fio: 'Иванов Иван Иванович',
  avatarUrl: 'https://place-hold.it/120x120/ff9d00/f5f5f5',
  role: 'admin',
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

  const login = (fio: string, avatarUrl: string, role: Role) => {
    dispatch({
      type: 'LOGIN',
      payload: {
        fio,
        avatarUrl,
        role,
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
