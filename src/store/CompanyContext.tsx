import React, { createContext, ReactElement, useReducer } from 'react'
import { ICompanyState, IAction, ICompany } from '../types/companies'
import $api from '../http'

const initialState: ICompanyState = {
  companies: [],
  fetchCompanies: () => {},
  deleteCompany: () => {},
  createCompany: () => {},
  editCompany: () => {},
  checkShowStudentPoints: () => {},
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
            id: action.payload.id,
            name: action.payload.name,
            startDate: action.payload.startDate,
            endDate: action.payload.endDate,
            showStudentPoints: true,
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
    case 'CHECK':
      return {
        ...state,
        companies: state.companies.map(c => {
          if (c.id === action.payload) {
            c.showStudentPoints = !c.showStudentPoints
          }

          return c
        }),
      }
    default:
      return state
  }
}

export const CompanyContext = createContext(initialState)

export const CompanyProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchCompanies = async () => {
    try {
      // fetch

      const resp = await $api.get('/api/companies/get/')

      const payload: any[] = resp.data

      dispatch({
        type: 'SET_COMPANIES',
        payload: payload.map(p => ({
          ...p,
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
          showStudentPoints: p.show_student_points,
        })),
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
  const deleteCompany = async (id: number) => {
    // fetch

    await $api.delete('/api/companies/detail/', {
      data: {
        id,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    dispatch({
      type: 'DELETE_COMPANY',
      payload: id,
    })
  }
  const checkShowStudentPoints = async (id: number) => {
    // fetch

    await $api.post('/api/companies/check-show-student-points/', { id })

    dispatch({
      type: 'CHECK',
      payload: id,
    })
  }
  const createCompany = async (
    name: string,
    startDate: Date,
    endDate: Date
  ) => {
    // fetch
    // get id from fetch

    const resp = await $api.post('/api/companies/create/', {
      name,
      date_start: startDate,
      date_end: endDate,
    })

    const data = resp.data

    dispatch({
      type: 'CREATE_COMPANY',
      payload: {
        id: data.id,
        name,
        startDate,
        endDate,
      },
    })
  }
  const editCompany = async (
    id: number,
    name: string,
    startDate: Date,
    endDate: Date
  ) => {
    // fetch

    await $api.post('/api/companies/detail/', {
      id,
      name,
      date_start: startDate,
      date_end: endDate,
    })

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
        checkShowStudentPoints,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}
