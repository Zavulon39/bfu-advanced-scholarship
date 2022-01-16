import React, { createContext, ReactElement, useReducer } from 'react'
import { IAction } from '../types/companies'
import { IRequestState, IRequest, IComment } from '../types/request'

const initialState: IRequestState = {
  requests: [],
  nominations: [],
  statuses: [],
  companies: [],
  notifications: [],
  fetchRequests: () => {},
  setPoints: () => {},
  setExamPoints: () => {},
  addComment: () => {},
  addRequest: () => {},
  setStudentExamPoints: () => {},
  setStudentData: () => {},
  setStatus: () => {},
  addRow: () => {},
  addNotification: () => {},
  removeNotification: () => {},
}

interface IProps {
  children?: ReactElement
}

const reducer = (
  state = initialState,
  { payload, type }: IAction
): IRequestState => {
  switch (type) {
    case 'SET_REQUESTS':
      return {
        ...state,
        ...payload,
      }
    case 'SET_POINTS':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.subRequests.find(sr => sr.id === payload.subRId)!.tables.body[
              payload.rowIdx
            ].points = payload.points

            return r
          }

          return r
        }),
      }
    case 'SET_EXAM_POINTS':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.subRequests.find(sr => sr.id === payload.subRId)!.point =
              payload.points
          }
          return r
        }),
      }
    case 'SET_STUDENT_EXAM_POINTS':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.subRequests.find(sr => sr.id === payload.subRId)!.examPoints =
              payload.points
          }
          return r
        }),
      }
    case 'ADD_COMMENT':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.subRequests
              .find(sr => sr.id === payload.subRId)!
              .comments.push({
                name: payload.name,
                imageUrl: payload.imageUrl,
                text: payload.text,
                sendedDate: new Date(),
              })
          }
          return r
        }),
      }
    case 'ADD_REQUEST':
      return {
        ...state,
        requests: [
          ...state.requests,
          {
            id: Date.now(),
            ...payload,
          },
        ],
      }
    case 'SET_STUDENT_DATA':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.subRequests.find(sr => sr.id === payload.subRId)!.tables.body[
              payload.rowIdx
            ].data[payload.dataIdx] = payload.value
          }

          return r
        }),
      }
    case 'SET_STATUS':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.subRequests.find(sr => sr.id === payload.subRId)!.status =
              payload.status
          }

          return r
        }),
      }
    case 'ADD_ROW':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            const data = [
              ...r.subRequests.find(sr => sr.id === payload.subRId)!.tables
                .header,
            ]

            r.subRequests
              .find(sr => sr.id === payload.subRId)!
              .tables.body.push({
                data,
                points: 0,
              })
          }

          return r
        }),
      }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, payload],
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== payload.id),
      }
    default:
      return state
  }
}

export const RequestContext = createContext(initialState)

export const RequestProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchRequests = async () => {
    try {
      // fetch

      let resp = await fetch('/api/requests/get/')
      if (!resp.ok) throw Error()

      const requests: IRequest[] = await resp.json()

      resp = await fetch('/api/companies/get/')
      if (!resp.ok) throw Error()

      const companies = await resp.json()

      resp = await fetch('/api/nominations/get/')
      if (!resp.ok) throw Error()

      const nominations = await resp.json()

      resp = await fetch('/api/notifications/get/')
      if (!resp.ok) throw Error()

      const notifications = await resp.json()

      const statuses = [
        'Победитель',
        'Черновик',
        'Принято',
        'Удалено',
        'Отправленно на доработку',
      ]

      dispatch({
        type: 'SET_REQUESTS',
        payload: {
          requests: requests.map(r => ({
            ...r,
            subRequests: r.subRequests.map(sr => ({
              ...sr,
              createdDate: new Date(sr.createdDate),
            })),
          })),
          nominations,
          statuses,
          companies: companies.map((c: any) => ({
            id: c.id,
            name: c.name,
          })),
          notifications,
        },
      })
    } catch (e) {
      dispatch({
        type: 'SET_REQUESTS',
        payload: {
          requests: {
            id: 0,
            companyId: 0,
            company: `null`,
            nomination: 'null',
            status: 'null',
            createdDate: new Date(),

            fio: `Ошибка при получении данных: ${e}`,
            educationForm: 'null',
            phone: 'null',
            financingSource: 'null',
            institute: 'null',
            level: 'null',
            direction: 'null',
            course: 0,

            tables: [],
          },
        },
      })
    }
  }
  const setPoints = (
    id: number,
    subRId: number,
    rowIdx: number,
    points: number
  ) =>
    // fetch
    dispatch({
      type: 'SET_POINTS',
      payload: {
        id,
        rowIdx,
        points,
        subRId,
      },
    })

  const setExamPoints = (id: number, subRId: number, points: number) => {
    // fetch
    dispatch({
      type: 'SET_EXAM_POINTS',
      payload: {
        id,
        points,
        subRId,
      },
    })
  }
  const setStudentExamPoints = (id: number, subRId: number, points: number) => {
    // fetch
    dispatch({
      type: 'SET_STUDENT_EXAM_POINTS',
      payload: {
        id,
        points,
        subRId,
      },
    })
  }
  const addComment = (
    id: number,
    subRId: number,
    name: string,
    imageUrl: string,
    text: string
  ) => {
    // fetch
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        id,
        subRId,
        name,
        imageUrl,
        text,
      },
    })
  }
  const addRequest = (
    companyId: number,
    studentId: number,
    company: string,
    nomination: string,
    createdDate: Date,
    fio: string,
    learningPlans: string
  ) => {
    // fetch
    // get id and subRequests from fetch

    const payload: IRequest = {
      id: Date.now(),
      studentId,
      companyId,
      company,
      fio,
      subRequests: [],
    }

    dispatch({
      type: 'ADD_REQUEST',
      payload,
    })
  }
  const setStudentData = (
    id: number,
    subRId: number,
    rowIdx: number,
    dataIdx: number,
    value: string
  ) => {
    // fetch
    dispatch({
      type: 'SET_STUDENT_DATA',
      payload: {
        id,
        subRId,
        rowIdx,
        dataIdx,
        value,
      },
    })
  }
  const setStatus = (id: number, subRId: number, status: string) => {
    // fetch
    dispatch({
      type: 'SET_STATUS',
      payload: {
        id,
        subRId,
        status,
      },
    })
  }
  const addRow = (id: number, subRId: number) =>
    dispatch({
      type: 'ADD_ROW',
      payload: {
        id,
        subRId,
      },
    })
  const addNotification = async (text: string) => {
    // fetch
    // get id from fetch

    const resp = await fetch('/api/notifications/detail/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    })

    if (!resp.ok) throw Error()

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        text,
      },
    })
  }
  const removeNotification = async (id: number) => {
    // fetch
    // get id from fetch

    const resp = await fetch('/api/notifications/detail/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    })

    if (!resp.ok) throw Error()

    dispatch({
      type: 'REMOVE_NOTIFICATION',
      payload: {
        id,
      },
    })
  }

  return (
    <RequestContext.Provider
      value={{
        ...state,
        fetchRequests,
        setPoints,
        setExamPoints,
        setStudentExamPoints,
        addComment,
        addRequest,
        setStudentData,
        setStatus,
        addRow,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </RequestContext.Provider>
  )
}
