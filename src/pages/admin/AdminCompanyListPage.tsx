import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { AdminHeader } from '../../components/Header'
import { CompanyContext } from '../../store/CompanyContext'
import M from 'materialize-css'
import { RequestContext } from '../../store/RequestContext'

export const AdminCompanyListPage: FC = () => {
  const {
    companies,
    fetchCompanies,
    deleteCompany,
    createCompany,
    editCompany,
  } = useContext(CompanyContext)
  const [createData, setCreateData] = useState<{
    name: null | string
    startDate: null | Date
    endDate: null | Date
  }>({
    name: null,
    startDate: null,
    endDate: null,
  })
  const [editData, setEditData] = useState<{
    id: undefined | number
    name: undefined | string
    startDate: undefined | Date
    endDate: undefined | Date
  }>({
    id: undefined,
    name: undefined,
    startDate: undefined,
    endDate: undefined,
  })
  const { nominations, fetchRequests } = useContext(RequestContext)
  const createModalRef = useRef(null)
  const editModalRef = useRef(null)
  const startCreateDatePickerRef = useRef(null)
  const endCreateDatePickerRef = useRef(null)
  const startEditDatePickerRef = useRef(null)
  const endEditDatePickerRef = useRef(null)

  const createClickHandler = () => {
    const i = M.Modal.getInstance(createModalRef.current!)
    i.open()
  }
  const editClickHandler = (id: number) => {
    const company = companies.find(c => c.id === id)
    setEditData({
      id,
      name: company?.name,
      startDate: company?.startDate,
      endDate: company?.endDate,
    })

    const i = M.Modal.getInstance(editModalRef.current!)
    i.open()
  }

  const deleteClickHandler = (id: number, name: string) => {
    try {
      deleteCompany(id)
      M.toast({
        html: `<span>Компания <b>${name}</b> была успешна удалена!</span>`,
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      M.toast({
        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
        classes: 'red darken-4',
      })
    }
  }
  const modalCreateClickHandler = () => {
    if (createData.name && createData.endDate && createData.startDate) {
      try {
        createCompany(createData.name, createData.startDate, createData.endDate)

        return M.toast({
          html: `<span>Компания <b>${createData.name}</b> была успешна добавлена!</span>`,
          classes: 'light-blue darken-1',
        })
      } catch (e) {
        return M.toast({
          html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
          classes: 'red darken-4',
        })
      }
    }
    M.toast({
      html: 'Зполните все поля формы!',
      classes: 'red darken-4',
    })
  }
  const modalEditClickHandler = () => {
    if (editData.name && editData.endDate && editData.startDate) {
      try {
        editCompany(
          editData.id!,
          editData.name,
          editData.startDate,
          editData.endDate
        )
        const i = M.Modal.getInstance(editModalRef.current!)
        i.close()

        return M.toast({
          html: `<span>Компания <b>${editData.name}</b> была успешна изменена!</span>`,
          classes: 'light-blue darken-1',
        })
      } catch (e) {
        return M.toast({
          html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
          classes: 'red darken-4',
        })
      }
    }
    M.toast({
      html: 'Зполните все поля формы!',
      classes: 'red darken-4',
    })
  }

  useEffect(() => {
    if (!companies.length) fetchCompanies()
    if (!nominations.length) fetchRequests()
  }, [])

  useEffect(() => {
    M.Modal.init(createModalRef.current!)
    M.Modal.init(editModalRef.current!)

    M.Datepicker.init(startCreateDatePickerRef.current!, {
      container: document.querySelector('body'),
      format: 'dd.mm.yyyy',
      onSelect: (selectedDate: Date) =>
        setCreateData(prev => ({
          ...prev,
          startDate: selectedDate,
        })),
    })
    M.Datepicker.init(endCreateDatePickerRef.current!, {
      container: document.querySelector('body'),
      format: 'dd.mm.yyyy',
      onSelect: (selectedDate: Date) =>
        setCreateData(prev => ({
          ...prev,
          endDate: selectedDate,
        })),
    })

    M.Datepicker.init(startEditDatePickerRef.current!, {
      container: document.querySelector('body'),
      format: 'dd.mm.yyyy',
      onSelect: (selectedDate: Date) =>
        setEditData(prev => ({
          ...prev,
          startDate: selectedDate,
        })),
    })
    M.Datepicker.init(endEditDatePickerRef.current!, {
      container: document.querySelector('body'),
      format: 'dd.mm.yyyy',
      onSelect: (selectedDate: Date) =>
        setEditData(prev => ({
          ...prev,
          endDate: selectedDate,
        })),
    })
  }, [companies.length])

  return (
    <>
      <AdminHeader />
      <div className='container'>
        <h1>Компании</h1>
        <button
          className='btn light-blue darken-2 waves-effect waves-light'
          onClick={createClickHandler}
        >
          <i className='material-icons left'>add</i>
          Добавить компанию
        </button>
        <table className='mt-4 striped'>
          <thead>
            <tr>
              <th>Название</th>
              <th>Дата начала</th>
              <th>Дата окончания</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(c => {
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.startDate.toLocaleDateString()}</td>
                  <td>{c.endDate.toLocaleDateString()}</td>
                  <td>
                    <button
                      className='btn-floating waves-effect waves-light light-blue darken-1'
                      onClick={() => editClickHandler(c.id)}
                    >
                      <i className='material-icons'>edit</i>
                    </button>
                    <button
                      className='btn-floating waves-effect waves-light light-blue darken-1'
                      style={{ marginLeft: 12 }}
                      onClick={() => deleteClickHandler(c.id, c.name)}
                    >
                      <i className='material-icons'>delete</i>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* create modal */}
      <div ref={createModalRef} className='modal'>
        <div className='modal-content'>
          <h4>Добавить компанию</h4>
          <div className='input-field' style={{ marginTop: 16 }}>
            <input
              id='name'
              type='text'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setCreateData(prev => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
            <label htmlFor='name'>Название</label>
          </div>
          <div className='input-field'>
            <input type='text' id='date' ref={startCreateDatePickerRef} />
            <label htmlFor='date'>Дата начала</label>
          </div>
          <div className='input-field'>
            <input type='text' id='date' ref={endCreateDatePickerRef} />
            <label htmlFor='date'>Дата окончания</label>
          </div>
        </div>
        <div className='modal-footer'>
          <button
            className='btn light-blue darken-2 waves-effect waves-light'
            onClick={modalCreateClickHandler}
          >
            <i className='material-icons left'>save</i>
            Добавить компанию
          </button>
        </div>
      </div>

      {/* edit modal */}
      <div ref={editModalRef} className='modal'>
        <div className='modal-content'>
          <h4>
            Изменить компанию <strong>"{editData.name}"</strong>
          </h4>
          <div className='input-field' style={{ marginTop: 16 }}>
            <input
              id='name'
              type='text'
              value={editData.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setEditData(prev => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
            <label htmlFor='name'>Название</label>
          </div>
          <div className='input-field'>
            <input
              type='text'
              id='date'
              value={editData.startDate?.toLocaleDateString()}
              ref={startEditDatePickerRef}
            />
            <label htmlFor='date'>Дата начала</label>
          </div>
          <div className='input-field'>
            <input
              type='text'
              id='date'
              value={editData.startDate?.toLocaleDateString()}
              ref={endEditDatePickerRef}
            />
            <label htmlFor='date'>Дата окончания</label>
          </div>
        </div>
        <div className='modal-footer'>
          <button
            className='btn light-blue darken-2 waves-effect waves-light'
            onClick={modalEditClickHandler}
          >
            <i className='material-icons left'>save</i>
            Сохранить изменения
          </button>
        </div>
      </div>
    </>
  )
}
