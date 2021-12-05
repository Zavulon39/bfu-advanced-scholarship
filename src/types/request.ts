const setPoints = (
  id: number,
  tableIdx: number,
  rowIdx: number,
  points: number
) => {}
const fetchRequests = () => {}
const setExamPoints = (id: number, points: number) => {}
const addComment = (
  id: number,
  name: string,
  imageUrl: string,
  text: string
) => {}

interface ICompany {
  id: number
  name: string
}

interface ITableBodyRow {
  data: string[]
  points: number
}

interface ITable {
  id: number
  title: string
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
  company: string
  nomination: string
  status: string
  createdDate: Date

  fio: string
  educationForm: string
  phone: string
  financingSource: string
  institute: string
  level: string
  direction: string
  course: number

  percent: string
  examPoints: number
  point: number

  tables: ITable[]
  comments: IComment[]
}

export interface IRequestState {
  requests: IRequest[]
  nominations: []
  statuses: []
  companies: ICompany[]
  fetchRequests: typeof fetchRequests
  setPoints: typeof setPoints
  setExamPoints: typeof setExamPoints
  addComment: typeof addComment
}
