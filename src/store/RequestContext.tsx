import React, { createContext, ReactElement, useReducer } from 'react'
import { IAction } from '../types/companies'
import { IRequestState, IRequest, IComment } from '../types/request'

const initialState: IRequestState = {
  requests: [],
  nominations: [],
  statuses: [],
  companies: [],
  fetchRequests: () => {},
  setPoints: () => {},
  setExamPoints: () => {},
  addComment: () => {},
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
            r.tables[payload.tableIdx].body[payload.rowIdx].points =
              payload.points

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
            r.point = payload.points
          }
          return r
        }),
      }
    case 'ADD_COMMENT':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.comments.push({
              name: payload.name,
              imageUrl: payload.imageUrl,
              text: payload.text,
              sendedDate: new Date(),
            })
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
          companyId: 1,
          company: 'Весна 2019',
          nomination: 'Учебная',
          status: 'Черновик',
          createdDate: new Date(),

          fio: 'Бенько Игорь Анатольевич',
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
                'Награда',
                'Документ',
              ],
              body: [
                {
                  points: 10,
                  data: [
                    'test1',
                    'Другое',
                    'Другое',
                    '2000',
                    'Призёр',
                    'https://jsonplaceholder.typicode.com/todos/1',
                  ],
                },
                {
                  points: 0,
                  data: [
                    'test2',
                    'Другое',
                    'Другое',
                    '2000',
                    'Призёр',
                    'https://jsonplaceholder.typicode.com/todos/1',
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
                'Награда',
                'Документ',
              ],
              body: [
                {
                  points: 10,
                  data: [
                    'test1',
                    'Другое',
                    'Другое',
                    '2000',
                    'Призёр',
                    'https://jsonplaceholder.typicode.com/todos/1',
                  ],
                },
                {
                  points: 0,
                  data: [
                    'test2',
                    'Другое',
                    'Другое',
                    '2000',
                    'Призёр',
                    'https://jsonplaceholder.typicode.com/todos/1',
                  ],
                },
              ],
            },
          ],
          comments,
        },
        {
          id: 2,
          companyId: 1,
          company: 'Весна 2019',
          nomination: 'Учебная',
          status: 'Победитель',
          createdDate: new Date(),

          fio: 'Кукушкина Алиса Андреевна',
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
      ]
      const nominations = Array.from(new Set(['Учебная']))
      const statuses = Array.from(new Set(['Победитель', 'Черновик']))
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
    tableIdx: number,
    rowIdx: number,
    points: number
  ) =>
    dispatch({
      type: 'SET_POINTS',
      payload: {
        id,
        tableIdx,
        rowIdx,
        points,
      },
    })

  const setExamPoints = (id: number, points: number) => {
    dispatch({
      type: 'SET_EXAM_POINTS',
      payload: {
        id,
        points,
      },
    })
  }
  const addComment = (
    id: number,
    name: string,
    imageUrl: string,
    text: string
  ) => {
    // fetch
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        id,
        name,
        imageUrl,
        text,
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
      }}
    >
      {children}
    </RequestContext.Provider>
  )
}
