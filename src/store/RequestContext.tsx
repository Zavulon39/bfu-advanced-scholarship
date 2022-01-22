import React, { createContext, ReactElement, useReducer } from 'react'
import $api from '../http'
import { Role } from '../types/auth'
import { IAction } from '../types/companies'
import {
  IRequestState,
  IRequest,
  IComment,
  ISubRequest,
} from '../types/request'

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
  setStudentData: () => {},
  setStatus: () => {},
  addRow: () => {},
  addNotification: () => {},
  removeNotification: () => {},
  setLinkToGradebook: () => {},
  setPercent: () => {},
  extendSubRequests: () => {},
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
            const sr = req.subRequests.find(sr => sr.id === payload.subRId)
            const data = [...sr!.tables.header]

            data[0] = sr?.nomination!
            data[5] = _(new Date())

            $api
              .post('/api/progress/get/', {
                nomination: sr?.nomination,
              })
              .then(r => {
                data[1] = r.data[0]

                $api
                  .post('/api/view-progress/get/', {
                    nomination: sr?.nomination,
                    progress: data[1],
                  })
                  .then(r => {
                    data[2] = r.data[0]

                    $api
                      .post('/api/status-progress/get/', {
                        nomination: sr?.nomination,
                        progress: data[1],
                        viewprogress: data[2],
                      })
                      .then(r => {
                        data[3] = r.data[0]

                        $api
                          .post('/api/level-progress/get/', {
                            nomination: sr?.nomination,
                            progress: data[1],
                            viewprogress: data[2],
                            statusprogress: data[3],
                          })
                          .then(r => {
                            data[4] = r.data[0]

                            req.subRequests
                              .find(sr => sr.id === payload.subRId)!
                              .tables.body.push({
                                data,
                                points: 0,
                                isNew: true,
                              })
                          })
                      })
                  })
              })
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
