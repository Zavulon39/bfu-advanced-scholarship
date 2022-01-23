import { Role } from './auth'

const setPoints = (
  id: number,
  subRId: number,
  rowIdx: number,
  points: number
) => {}
const setStatus = (id: number, subRId: number, status: string) => {}
const fetchRequests = () => {}
const setExamPoints = (id: number, subRId: number, points: number) => {}
const setPercent = (id: number, subRId: number, percent: number) => {}
const addComment = (
  id: number,
  subRId: number,
  name: string,
  imageUrl: string,
  text: string,
  role: Role,
  userId: number
) => {}
const addRequest = (
  companyId: number,
  studentId: number,
  company: string,
  nomination: string,
  createdDate: Date,
  fio: string,
  learningPlan: string
) => {}
const setStudentData = (
  id: number,
  subRId: number,
  rowIdx: number,
  dataIdx: number,
  value: string
) => {}
const addRow = (id: number, subRId: number) => {}
const addNotification = (text: string) => {}
const removeNotification = (id: number) => {}
const setLinkToGradebook = (id: number, subRId: number, link: string) => {}
const extendSubRequests = (id: number, subRequests: ISubRequest[]) => {}

interface ICompany {
  id: number
  name: string
}

interface ITableBodyRow {
  data: string[]
  points: number
  isNew: boolean
}

export interface ISubRequest {
  id: number

  nomination: string
  learningPlan: string
  status: string
  createdDate: Date

  educationForm: string
  phone: string
  financingSource: string
  institute: string
  level: string
  direction: string
  course: number

  percent: number
  point: number // from admin
  linkToGradebook: string

  tables: ITable
  comments: IComment[]
}

interface INotification {
  id: number
  text: string
}

export interface ITable {
  header: string[]
  body: ITableBodyRow[]
}

export interface IComment {
  name: string
  sendedDate: Date
  imageUrl: string
  text: string
}

export interface IRequest {
  id: number
  companyId: number
  studentId: number
  fio: string
  company: string
  subRequests: ISubRequest[]
}

export interface IRequestState {
  requests: IRequest[]
  nominations: []
  statuses: string[]
  companies: ICompany[]
  notifications: INotification[]
  tables: Array<{
    name: string
    progress: Array<{
      name: string
      viewprogress: Array<{
        name: string
        statusprogress: Array<{
          name: string
          levelprogress: string[]
        }>
      }>
    }>
  }>

  fetchRequests: typeof fetchRequests
  setPoints: typeof setPoints
  setExamPoints: typeof setExamPoints
  addComment: typeof addComment
  addRequest: typeof addRequest
  setStudentData: typeof setStudentData
  setStatus: typeof setStatus
  addRow: typeof addRow
  addNotification: typeof addNotification
  removeNotification: typeof removeNotification
  setLinkToGradebook: typeof setLinkToGradebook
  setPercent: typeof setPercent
  extendSubRequests: typeof extendSubRequests
}
