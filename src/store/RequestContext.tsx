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
            r.subRequests.find(sr => sr.id === payload.subRId)!.tables[
              payload.tableIdx
            ].body[payload.rowIdx].points = payload.points

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
            r.subRequests.find(sr => sr.id === payload.subRId)!.tables[
              payload.tableIdx
            ].body[payload.rowIdx].data[payload.dataIdx] = payload.value
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
              ...r.subRequests.find(sr => sr.id === payload.subRId)!.tables[
                payload.tableIdx
              ].header,
            ]

            r.subRequests
              .find(sr => sr.id === payload.subRId)!
              .tables[payload.tableIdx].body.push({
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

  const fetchRequests = () => {
    try {
      // fetch

      const comments: IComment[] = [
        {
          name: 'Mike',
          sendedDate: new Date(),
          imageUrl: 'https://place-hold.it/120x120/aaaaaa/f5f5f5',
          text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium illo commodi vel, aspernatur mollitia voluptatibus incidunt, dicta dignissimos tenetur ex quisquam sit! Iure cupiditate voluptatem minus iste repellat iusto ea.',
        },
        {
          name: 'John',
          sendedDate: new Date(),
          imageUrl: 'https://place-hold.it/120x120/444444/f5f5f5',
          text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium illo commodi vel, aspernatur mollitia voluptatibus incidunt, dicta dignissimos tenetur ex quisquam sit! Iure cupiditate voluptatem minus iste repellat iusto ea.',
        },
      ]
      const requests: IRequest[] = [
        {
          id: 1,
          studentId: 1,
          companyId: 1,
          company: 'Весна 2019',
          fio: 'Бенько Игорь Анатольевич',
          subRequests: [
            {
              id: 1,
              nomination: 'Учебная',
              status: 'Черновик',
              createdDate: new Date(),

              educationForm: 'очное обучение',
              phone: '8 800 555 3535',
              financingSource: 'Бюджет',
              institute: 'Институт высшего матана',
              level: 'Аспирант',
              direction: 'Высший матан',
              course: 3,

              percent: 'Отлично',
              examPoints: 12,
              point: 0,

              tables: [
                {
                  id: 1,
                  title: 'Олимпиады и конкурсы',
                  header: [
                    'Название',
                    'Тип',
                    'Статус',
                    'Год',
                    'Документ',
                    'Награда',
                  ],
                  body: [
                    {
                      points: 10,
                      data: [
                        'test1',
                        'Другое',
                        'Другое',
                        '2000',
                        'data:image/jpeg;base64,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',
                        'Призёр',
                      ],
                    },
                    {
                      points: 0,
                      data: [
                        'test2',
                        'Другое',
                        'Другое',
                        '2000',
                        'https://s3.ibta.ru/goods/128348/96d238058b43e4adb5eb87b72710b9b1_xl.jpg',
                        'Призёр',
                      ],
                    },
                  ],
                },
                {
                  id: 2,
                  title: 'Доп. достижения',
                  header: [
                    'Название',
                    'Тип',
                    'Статус',
                    'Год',
                    'Документ',
                    'Награда',
                  ],
                  body: [
                    {
                      points: 10,
                      data: [
                        'test1',
                        'Другое',
                        'Другое',
                        '2000',
                        'https://images.ru.prom.st/2600404_w500_h500_pohvalnaya-gramota.jpg',
                        'Призёр',
                      ],
                    },
                    {
                      points: 0,
                      data: [
                        'test2',
                        'Другое',
                        'Другое',
                        '2000',
                        'https://images.ru.prom.st/2600404_w500_h500_pohvalnaya-gramota.jpg',
                        'Призёр',
                      ],
                    },
                  ],
                },
              ],
              comments,
            },
          ],
        },
        {
          id: 2,
          studentId: 1,
          companyId: 1,
          company: 'Весна 2019',
          fio: 'Кукушкина Алиса Андреевна',
          subRequests: [
            {
              id: 2,
              nomination: 'Учебная',
              status: 'Победитель',
              createdDate: new Date(),

              educationForm: 'очное обучение',
              phone: '8 800 555 7878',
              financingSource: 'Бюджет',
              institute: 'Институт высшего матана',
              level: 'Бакалавр',
              direction: 'Высший матан',
              course: 2,

              percent: 'Отлично',
              examPoints: 12,
              point: 0,

              tables: [],
              comments: [],
            },
          ],
        },
      ]
      const nominations = Array.from(new Set(['Учебная', 'Спортивная']))
      const statuses = Array.from(new Set(['Победитель', 'Черновик']))
      const notifications = [
        {
          id: 1,
          text: 'Компания Весна 2021 начинает работу с апреля 2021 года!',
        },
        {
          id: 2,
          text: 'Компания Весна 2021 начинает работу с апреля 2021 года!',
        },
      ]
      const companies = Array.from(
        new Set([
          {
            name: 'Весна 2019',
            id: 1,
          },
          {
            name: 'Весна 2020',
            id: 2,
          },
        ])
      )

      dispatch({
        type: 'SET_REQUESTS',
        payload: {
          requests,
          nominations,
          statuses,
          companies,
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
    tableIdx: number,
    rowIdx: number,
    points: number
  ) =>
    // fetch
    dispatch({
      type: 'SET_POINTS',
      payload: {
        id,
        tableIdx,
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
    tableIdx: number,
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
        tableIdx,
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
  const addRow = (id: number, subRId: number, tableIdx: number) =>
    dispatch({
      type: 'ADD_ROW',
      payload: {
        id,
        subRId,
        tableIdx,
      },
    })
  const addNotification = (text: string) => {
    // fetch
    // get id from fetch

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        text,
      },
    })
  }
  const removeNotification = (id: number) => {
    // fetch
    // get id from fetch

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
