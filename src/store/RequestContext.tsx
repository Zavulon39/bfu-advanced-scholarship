import React, { createContext, ReactElement, useReducer } from 'react'
import $api from '../http'
import { Role } from '../types/auth'
import { IAction } from '../types/companies'
import { IRequestState, IRequest, ISubRequest } from '../types/request'

const initialState: IRequestState = {
  requests: [],
  nominations: [],
  statuses: [],
  companies: [],
  notifications: [],
  tables: [],

  fetchRequests: () => {},
  setPoints: () => {},
  setExamPoints: () => {},
  addComment: () => {},
  addRequest: () => {},
  setStudentData: () => {},
  setStatus: () => {},
  addRow: () => {},
  addNotification: () => {},
  removeNotification: () => {},
  setLinkToGradebook: () => {},
  setPercent: () => {},
  extendSubRequests: () => {},
  removeRow: () => {},
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
    case 'SET_PERCENT':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.subRequests.find(sr => sr.id === payload.subRId)!.percent =
              payload.percent
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
        requests: state.requests.map(req => {
          if (req.id === payload.id) {
            req.subRequests
              .find(sr => sr.id === payload.subRId)!
              .tables.body.push({
                data: payload.data,
                points: 0,
                id: payload.dataId,
              })
          }

          return req
        }),
      }
    case 'REMOVE_ROW':
      return {
        ...state,
        requests: state.requests.map(req => {
          if (req.id === payload.id) {
            req.subRequests.find(sr => sr.id === payload.subRId)!.tables.body =
              req.subRequests
                .find(sr => sr.id === payload.subRId)!
                .tables.body.filter(b => b.id !== payload.bId)
          }

          return req
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
    case 'SET_LINK':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.subRequests.find(
              sr => sr.id === payload.subRId
            )!.linkToGradebook = payload.link
          }

          return r
        }),
      }
    case 'EXTEND_SUB_REQUESTS':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.subRequests = [...r.subRequests, ...payload.subRequests]
          }

          return r
        }),
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

      resp = await $api.get('/api/table/get/')
      const tables = resp.data

      const statuses = [
        'Победитель',
        'Черновик',
        'Принято',
        'Удалено',
        'Отправлено на доработку',
        'На рассмотрении',
      ]

      dispatch({
        type: 'SET_REQUESTS',
        payload: {
          requests: requests.map(r => ({
            ...r,
            subRequests: r.subRequests.map(sr => ({
              ...sr,
              createdDate: new Date(sr.createdDate),
              changedDate: new Date(sr.changedDate),
              comments: sr.comments.map(c => ({
                ...c,
                sendedDate: new Date(c.sendedDate),
              })),
              tables: {
                ...sr.tables,
                body: sr.tables.body.map(t => ({
                  ...t,
                  isNew: false,
                })),
              },
            })),
          })),
          nominations,
          statuses,
          companies: companies.map((c: any) => ({
            id: c.id,
            name: c.name,
          })),
          notifications,
          tables,
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
  const setPercent = (id: number, subRId: number, percent: number) =>
    dispatch({
      type: 'SET_PERCENT',
      payload: {
        id,
        percent,
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
      subRequests: resp.data.requests.map((sr: ISubRequest) => ({
        ...sr,
        createdDate: new Date(sr.createdDate),
      })),
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
  const setStatus = async (id: number, subRId: number, status: string) => {
    // fetch

    await $api.put('/api/requests/get/', {
      id: subRId,
      status: status,
    })

    dispatch({
      type: 'SET_STATUS',
      payload: {
        id,
        subRId,
        status,
      },
    })
  }
  const addRow = async (id: number, subRId: number) => {
    const req = state.requests.find(r => r.id === id)!
    const sr = req.subRequests.find(sr => sr.id === subRId)
    const data = [...sr!.tables.header]
    const dict = state.tables.find(t => t.name === sr?.nomination)!

    data[0] = ''
    data[5] = _(new Date())
    data[6] = ''
    data[1] = dict.progress[0].name
    data[2] = dict.progress[0].viewprogress[0].name
    data[3] = dict.progress[0].viewprogress[0].statusprogress[0].name
    data[4] =
      dict.progress[0].viewprogress[0].statusprogress[0].levelprogress[0]

    const resp = await $api.post('/api/requests/add-row/', {
      id: id,
      data,
    })

    dispatch({
      type: 'ADD_ROW',
      payload: {
        id,
        subRId,
        data,
        dataId: resp.data.id,
      },
    })
  }
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
  const setLinkToGradebook = (id: number, subRId: number, link: string) => {
    dispatch({
      type: 'SET_LINK',
      payload: {
        id,
        subRId,
        link,
      },
    })
  }
  const extendSubRequests = (id: number, subRequests: ISubRequest[]) => {
    dispatch({
      type: 'EXTEND_SUB_REQUESTS',
      payload: {
        id,
        subRequests,
      },
    })
  }
  const removeRow = async (id: number, subRId: number, bId: number) => {
    await $api.post('/api/requests/remove-data/', {
      id,
      bodyId: bId,
    })

    dispatch({
      type: 'REMOVE_ROW',
      payload: {
        id,
        subRId,
        bId,
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
        addComment,
        addRequest,
        setStudentData,
        setStatus,
        addRow,
        addNotification,
        removeNotification,
        setLinkToGradebook,
        setPercent,
        extendSubRequests,
        removeRow,
      }}
    >
      {children}
    </RequestContext.Provider>
  )
}

function _(date?: Date) {
  if (date === undefined) return ''

  const m = date.getMonth() + 1
  const d = date.getDate()

  return `${date.getFullYear()}-${m >= 10 ? m : '0' + m}-${
    d >= 10 ? d : '0' + d
  }`
}
