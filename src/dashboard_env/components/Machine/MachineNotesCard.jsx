import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/fetchSQL-hook'
import ServiceNotes from '../Modals/ServiceNotes'

export default () => {
  const { fetchMssqlApi } = useFetch()
  const { machineId } = useParams()

  const [serviceNotes, setServiceNotes] = useState([])
  const [serviceNotesModal, setServiceNotesModal] = useState(false)
  const openServiceNotesModal = () => setServiceNotesModal(true)
  const closeServiceNotesModal = () => setServiceNotesModal(false)

  const getServiceNotes = () => {
    fetchMssqlApi(`service-notes/${machineId}`, {}, notes => setServiceNotes(notes))
  }

  const deleteServiceNote = id => () => {
    if (window.confirm('Potwierdź usunięcie notatki'))
      fetchMssqlApi(`service-note/${id}`, { method: 'DELETE' }, getServiceNotes)
  }

  const submitNote = evt => {
    evt.preventDefault()

    const { note } = evt.target.elements

    fetchMssqlApi(
      `service-note/${machineId}`,
      {
        method: 'POST',
        data: { Note: note.value }
      },
      () => {
        closeServiceNotesModal()
        getServiceNotes()
      }
    )
  }

  useEffect(() => {
    getServiceNotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <div className="card h-100">
        <h5 className="card-header">
          Notatki
          <button
            className="float-right btn btn-sm btn-link text-decoration-none"
            onClick={openServiceNotesModal}
          >
            <i className="fas fa-plus mr-2" />
            Dodaj notatke
          </button>
        </h5>
        <div className="card-body d-flex flex-column justify-content-center">
          {serviceNotes.length ? (
            <ul
              className="list-group list-group-flush overflow-auto"
              style={{ maxHeight: 200 }}
            >
              {serviceNotes.map((note, idx) => (
                <li key={idx} className="list-group-item px-2 py-3 d-flex">
                  <div className="flex-grow-1">
                    <span>{note.Content}</span>
                    <br />
                    <small className="d-block text-right">{note.CreateDateTime}</small>
                  </div>
                  <div className="d-flex p-2">
                    <button
                      className="my-auto ml-2 fas fa-trash text-muted btn btn-link text-decoration-none p-1 icon-large"
                      onClick={deleteServiceNote(note.NoteId)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-center font-weight-bolder">Brak notatek</span>
          )}
        </div>
      </div>
      {serviceNotesModal && (
        <ServiceNotes handleSubmit={submitNote} handleClose={closeServiceNotesModal} />
      )}
    </>
  )
}
