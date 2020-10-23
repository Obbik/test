import React, { useState, useContext, useEffect } from 'react'
// import { Link, Route, Switch } from 'react-router-dom'
// import { useLocation, useParams } from 'react-router'
import { SearchbarContext } from '../../../context/searchbar-context'
import { NavigationContext } from '../../../context/navigation-context'
// import { LangContext } from '../../../context/lang-context'
import useFetch from '../../../hooks/fetch-hook'
import useForm from '../../../hooks/form-hook'
import TagForm from '../../../components/Modals/TagForm'

export default () => {
  const { fetchMssqlApi } = useFetch()
  // const { TRL_Pack } = useContext(LangContext)
  const { setHeaderData } = useContext(NavigationContext)
  const { Searchbar, compareText } = useContext(SearchbarContext)

  const [section, setSection] = useState('machine')
  const changeSection = section => () => setSection(section)

  const [tags, setTags] = useState({
    machine: [],
    product: []
  })

  const deleteLabel = label => () => {
    if (window.confirm('Czy na pewno chcesz usunąć sekcje?'))
      fetchMssqlApi('/tags', { method: 'DELETE', data: { Label: label } }, getTags)
  }

  const { form, openForm, closeForm } = useForm()

  const getTags = () => {
    fetchMssqlApi('tags', {}, tags => setTags(tags))
  }

  const [, setState] = useState()
  const handleUpdate = () => setState({})

  const filteredTags = tags[section].filter(tag => compareText(tag.label))

  useEffect(() => {
    getTags()
    setHeaderData({ text: 'Tagi' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ul className="nav nav-tabs machine-tabs w-100 mb-3">
        <li className="nav-item w-50">
          <button
            className={`nav-link btn w-100 ${section === 'machine' ? 'active' : ''}`}
            onClick={changeSection('machine')}
          >
            Maszyna
          </button>
        </li>
        <li className="nav-item w-50">
          <button
            className={`nav-link btn w-100 ${section === 'product' ? 'active' : ''}`}
            onClick={changeSection('product')}
          >
            Produkt
          </button>
        </li>
      </ul>
      {tags[section].length ? (
        <>
          <Searchbar callback={handleUpdate} />
          <div className="row mb-2">
            <div className="col-12 col-md-6 offset-lg-2 col-lg-4 mb-2">
              <button
                className="btn list-group-item list-group-item-action text-center"
                onClick={openForm('new')}
              >
                <i className="fas fa-plus" />
              </button>
            </div>
            <div className="col-12 col-md-6 col-lg-4 mb-2 position-relative">
              <button
                className="btn list-group-item list-group-item-action"
                onClick={openForm('others')}
              >
                Inne
              </button>
            </div>
          </div>
          <div className="row">
            {filteredTags.map((tag, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4 mb-2 position-relative">
                <button
                  className="btn list-group-item list-group-item-action"
                  onClick={openForm(tag.label)}
                >
                  {tag.label}
                </button>
                <button
                  type="button"
                  className="btn btn-light position-absolute"
                  onClick={deleteLabel(tag.label)}
                  style={{
                    top: '50%',
                    right: 22,
                    transform: 'translateY(-50%)',
                    zIndex: 25
                  }}
                >
                  <i className="fas fa-times text-danger" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="row">
          <div className="col-12 col-md-6 col-lg-4 mb-2">
            <button
              className="btn list-group-item list-group-item-action text-center"
              onClick={openForm('new')}
            >
              <i className="fas fa-plus" />
            </button>
          </div>
        </div>
      )}
      {form && (
        <TagForm
          tagData={
            form === 'others'
              ? tags[section].find(label => label.others)
              : form !== 'new'
              ? filteredTags.find(tag => tag.label === form)
              : null
          }
          handleClose={closeForm}
          getTags={getTags}
          section={section === 'machine' ? 1 : 2}
        />
      )}
    </>
  )
}
