import React, { useState, useRef } from 'react'

export default () => {
  const [state, setState] = useState({
    temp: true,
    led: false,
    buzzer: true
  })

  const handleChange = name => {
    setState(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const [modal, setModal] = useState(false)
  const modalNode = useRef({})

  const modalConstructor = modal => {
    switch (modal) {
      case 'select_product':
        return {
          header: 'Wybierz produkt',
          body: <input type="slot" className="form-control" placeholder="01" />,
          footer: 'Wybierz'
        }
      case 'set_temp':
        return {
          header: 'Ustaw temperature',
          body: (
            <input
              type="range"
              className="form-control-range"
              id="formControlRange"
            />
          ),
          footer: 'Zapisz zmiany'
        }
      case 'fetch_temp':
        return {
          header: 'Aktualna temperatura',
          body: '10 °C'
        }
      case 'manage_lines':
        return {
          header: 'Zarządzaj pasami',
          body: (
            <>
              <input className="form-control mb-3" placeholder="01" />
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-primary btn-block mr-3 p-2"
                >
                  Ustaw pas na pojedyńczy
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-block p-2 mt-0"
                >
                  Ustaw pas na podwójny
                </button>
              </div>
              <hr className="my-3" />
              <button type="button" className="btn btn-primary btn-block p-2">
                Ustaw wszystkie pasy na pojedyńcze
              </button>
            </>
          )
        }
      default:
        return {}
    }
  }

  const openModal = modal => {
    modalNode.current = modalConstructor(modal)

    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
  }

  const buttons = [
    {
      text: 'Test wyborów'
    },
    {
      text: 'Wydanie produktu',
      event: () => openModal('select_product')
    },
    {
      text: 'Reset',
      event: () => {}
    },
    {
      text: 'Temperatura',
      color: state.temp ? 'btn-success' : 'btn-danger',
      event: () => handleChange('temp')
    },
    {
      text: 'Ustaw temperature',
      event: () => openModal('set_temp')
    },
    {
      text: 'Pobierz temperature',
      event: () => openModal('fetch_temp')
    },
    {
      text: 'Led',
      color: state.led ? 'btn-success' : 'btn-danger',
      event: () => handleChange('led')
    },
    {
      text: 'Buzzer',
      color: state.buzzer ? 'btn-success' : 'btn-danger',
      event: () => handleChange('buzzer')
    },
    {
      text: 'Stan drzwi'
    },
    {
      text: 'Stan windy'
    },
    {
      text: 'Sterowanie windą'
    },
    {
      text: 'Reset pozycji windy'
    },
    {
      text: 'Zarządzanie pasami',
      event: () => openModal('manage_lines')
    },
    {
      text: 'Wyczyść błędy'
    }
  ]

  return (
    <>
      <div className="row">
        {buttons.map((button, idx) => (
          <div
            key={idx}
            className="col-12 col-sm-6 col-md-4 mb-3 px-2 text-center"
          >
            <button
              type="button"
              onClick={button.event}
              className={`btn ${button.color || 'btn-primary'} btn-block p-2`}
            >
              {button.text}
            </button>
          </div>
        ))}
      </div>
      <div
        style={modal ? { display: 'block', opacity: 1 } : {}}
        className="modal fade"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalNode.current.header}</h5>
              <button
                type="button"
                onClick={() => closeModal()}
                className="close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{modalNode.current.body}</div>
            {modalNode.current.footer && (
              <div className="modal-footer">
                <button type="button" className="btn btn-primary">
                  {modalNode.current.footer}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
