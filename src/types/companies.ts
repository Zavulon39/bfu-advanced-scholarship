const fetchCompanies = () => {}
const deleteCompany = (id: number) => {}
const createCompany = (name: string, startDate: Date, endDate: Date) => {}
const editCompany = (
  id: number,
  name: string,
  startDate: Date,
  endDate: Date
) => {}
const checkShowStudentPoints = (id: number) => {}

export interface ICompany {
  id: number
  name: string
  startDate: Date
  endDate: Date
  showStudentPoints: boolean
}

export interface ICompanyState {
  companies: ICompany[]
  fetchCompanies: typeof fetchCompanies
  deleteCompany: typeof deleteCompany
  createCompany: typeof createCompany
  editCompany: typeof editCompany
  checkShowStudentPoints: typeof checkShowStudentPoints
}

export interface IAction {
  type: string
  payload?: any
}
