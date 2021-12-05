const fetchCompanies = () => {}
const deleteCompany = (id: number) => {}
const createCompany = (name: string, startDate: Date, endDate: Date) => {}
const editCompany = (
  id: number,
  name: string,
  startDate: Date,
  endDate: Date
) => {}

export interface ICompany {
  id: number
  name: string
  startDate: Date
  endDate: Date
}

export interface ICompanyState {
  companies: ICompany[]
  fetchCompanies: typeof fetchCompanies
  deleteCompany: typeof deleteCompany
  createCompany: typeof createCompany
  editCompany: typeof editCompany
}

export interface IAction {
  type: string
  payload?: any
}
