import React, { createContext, ReactElement, useReducer } from 'react'
import $api from '../http'
import { Role } from '../types/auth'
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

      let resp = await $api.get('/api/requests/get/')
      const requests: IRequest[] = resp.data

      resp = await $api.get('/api/companies/get/')
      const companies = resp.data

      resp = await $api.get('/api/nominations/get/')
      const nominations = resp.data

      resp = await $api.get('/api/notifications/get/')
      const notifications = resp.data

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
              comments: sr.comments.map(c => ({
                ...c,
                sendedDate: new Date(c.sendedDate),
              })),
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
    dispatch({
      type: 'SET_STUDENT_EXAM_POINTS',
      payload: {
        id,
        points,
        subRId,
      },
    })
  }
  const addComment = async (
    id: number,
    subRId: number,
    name: string,
    imageUrl: string,
    text: string,
    role: Role,
    userId: number
  ) => {
    // fetch

    await $api.post('/api/comments/create/', {
      role,
      text,
      id: subRId,
      user_id: userId,
    })

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
  const addRequest = async (
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

    const resp = await $api.post('/api/requests/create/', {
      learningPlans,
      id: studentId,
      company_id: companyId,
      nomination,
    })

    const payload: IRequest = {
      id: resp.data.id,
      studentId,
      companyId,
      company,
      fio,
      subRequests: resp.data.requests,
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

    await $api.post('/api/notifications/detail/', {
      text,
    })

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

    await $api.delete('/api/notifications/detail/', {
      data: {
        id,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

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
