import React, { createContext, ReactElement, useReducer } from 'react'
import { ICompanyState, IAction, ICompany } from '../types/companies'

const initialState: ICompanyState = {
  companies: [],
  fetchCompanies: () => {},
  deleteCompany: () => {},
  createCompany: () => {},
  editCompany: () => {},
}

interface IProps {
  children?: ReactElement
}

const reducer = (state = initialState, action: IAction): ICompanyState => {
  switch (action.type) {
    case 'SET_COMPANIES':
      return { ...state, companies: action.payload }
    case 'CREATE_COMPANY':
      return {
        ...state,
        companies: [
          ...state.companies,
          {
            id: Date.now(),
            name: action.payload.name,
            startDate: action.payload.startDate,
            endDate: action.payload.endDate,
          },
        ],
      }
    case 'EDIT_COMPANY':
      return {
        ...state,
        companies: state.companies.map(c => {
          if (c.id == action.payload.id) {
            c.name = action.payload.name
            c.startDate = action.payload.startDate
            c.endDate = action.payload.endDate
          }
          return c
        }),
      }
    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(c => c.id !== action.payload),
      }
    default:
      return state
  }
}

export const CompanyContext = createContext(initialState)

export const CompanyProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchCompanies = () => {
    try {
      // fetch

      const payload: ICompany[] = [
        {
          id: 1,
          name: 'Весна 2019',
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          id: 2,
          name: 'Весна 2020',
          startDate: new Date(),
          endDate: new Date(),
        },
      ]

      dispatch({
        type: 'SET_COMPANIES',
        payload,
      })
    } catch (e) {
      dispatch({
        type: 'SET_COMPANIES',
        payload: [
          {
            id: 1,
            name: `Ошибка при получении данных: ${e}`,
            startDate: new Date(),
            endDate: new Date(),
          },
        ],
      })
    }
  }
  const deleteCompany = (id: number) => {
    // fetch
    dispatch({
      type: 'DELETE_COMPANY',
      payload: id,
    })
  }
  const createCompany = (name: string, startDate: Date, endDate: Date) => {
    // fetch
    dispatch({
      type: 'CREATE_COMPANY',
      payload: {
        name,
        startDate,
        endDate,
      },
    })
  }
  const editCompany = (
    id: number,
    name: string,
    startDate: Date,
    endDate: Date
  ) => {
    // fetch
    dispatch({
      type: 'EDIT_COMPANY',
      payload: {
        id,
        name,
        startDate,
        endDate,
      },
    })
  }

  return (
    <CompanyContext.Provider
      value={{
        ...state,
        fetchCompanies,
        createCompany,
        deleteCompany,
        editCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}
