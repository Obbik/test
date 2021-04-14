import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import useFetch from '../../../hooks/fetchMSSQL-hook'
import Pagination from '../../../components/Pagination/Pagination'
import Filter from '../../../components/Filter/Filter'
import NoResults from '../../../components/NoResults/NoResults'

export default () => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)

  const [tags, setTags] = useState([])
  const [machines, setMachines] = useState([])

  const handleSwitchPage = pageNo => () => setFilter(prev => ({ ...prev, page: pageNo }))
  const resetPage = () => setFilter(prev => ({ ...prev, page: 1 }))

  const defaultFilter = {
    showIndexes: true,
    page: 1,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50],
    visible: false,
    sortByColumns: true,
    sortBy: '3 | asc | text',
    activeTags: [],
    columns: [
      {
        id: 1,
        name: 'ID',
        disabled: true
      },
      {
        id: 2,
        name: TRL_Pack.machines.properties.machineName,
        sortable: true,
        searchable: true,
        type: 'text',
        solid: true
      },
      {
        id: 3,
        name: TRL_Pack.machines.properties.serialNo,
        searchable: true,
        sortable: true,
        type: 'text'
      },
      {
        id: 4,
        name: TRL_Pack.machines.properties.location,
        sortable: true,
        searchable: true,
        type: 'text'
      },
      {
        id: 5,
        name: TRL_Pack.machines.properties.machineType,
        sortable: true,
        searchable: true,
        type: 'text'
      },
      {
        id: 6,
        name: TRL_Pack.machines.properties.maintenance,
        sortable: true,
        searchable: true,
        type: 'text'
      }
    ]
  }

  const [filter, setFilter] = useState(() => {
    if (localStorage.getItem('machinesFilter')) {
      return JSON.parse(localStorage.getItem('machinesFilter'))
    } else return defaultFilter
  })

  const toggleFilter = () => setFilter(prev => ({ ...prev, visible: !prev.visible }))
  const resetFilter = () => setFilter(defaultFilter)

  const getMachines = () => {
    fetchMssqlApi('machines', {}, machines => setMachines(machines))
  }
  const getTags = () => {
    fetchMssqlApi('tags', {}, tags =>
      setTags(tags.machine.filter(tag => tag.options.length > 0))
    )
  }

  useEffect(() => {
    setHeaderData({ text: TRL_Pack.machines.header })

    getMachines()
    getTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => localStorage.setItem('machinesFilter', JSON.stringify(filter)), [
    filter
  ])

  const sortRows = (a, b) => {
    const [id, order, type] = filter.sortBy.split(' | ')
    const col = Object.keys(machines[0])[Number(id) - 1]

    if (a[col] === b[col]) return 0
    else if (a[col] === null) return 1
    else if (b[col] === null) return -1

    let valueA, valueB
    if (type === 'text' || type === 'date') {
      valueA = a[col]?.toUpperCase()
      valueB = b[col]?.toUpperCase()
    } else if (type === 'price') {
      valueA = Number(a[col].replace(',', ''))
      valueB = Number(b[col].replace(',', ''))

      // Number().toLocaleString(undefined, {minimumFractionDigits: 2}) num => str '1 245 151,50'
    } else return 0

    if (order === 'asc') return valueA < valueB ? -1 : 1
    else return valueA < valueB ? 1 : -1
  }

  const reportFilter = row =>
    filter.columns
      .filter(col => col.searchbar)
      .every(col =>
        row[Object.keys(row)[col.id - 1]]
          .toLowerCase()
          .includes(col.searchbar.toLowerCase())
      )

  const tagFilter = machine => {
    return (
      tags
        .filter(
          label =>
            label.others &&
            label.options
              .map(tag => tag.tagId)
              .some(tag => filter.activeTags.includes(tag))
        )
        .map(label =>
          label.options
            .map(opt => opt.tagId)
            .filter(tagId => filter.activeTags.includes(tagId))
        )
        .every(label =>
          label.every(opt => machine.MachineTags.split(', ').includes(opt))
        ) &&
      tags
        .filter(
          label =>
            !label.others &&
            label.options
              .map(tag => tag.tagId)
              .some(tag => filter.activeTags.includes(tag))
        )
        .map(label =>
          label.options
            .map(opt => opt.tagId)
            .filter(tagId => filter.activeTags.includes(tagId))
        )
        .every(label => label.some(opt => machine.MachineTags.split(', ').includes(opt)))
    )
  }

  return (
    <>
      <Pagination
        {...{

          totalItems: machines.filter(reportFilter).filter(tagFilter).length,
          page: filter.page,
          handleSwitchPage,
          rowsPerPage: filter.rowsPerPage,
          toggleFilter,
          resetFilter,
          filterVisibility: filter.visible
        }}
      />
      {filter.visible && (
        <>
          <Filter
            {...{
              filter,
              setFilter,
              columns: filter.columns,
              data: machines,
              resetPage,
              tags,
              resetFilter
            }}
          />
        </>
      )}
      {machines.filter(reportFilter).filter(tagFilter).length ? (
        <div className="overflow-auto">
          <table className="table table-striped">
            <thead>
            </thead>
            <tbody>
              {machines
                .filter(reportFilter)
                .filter(tagFilter)
                .sort(sortRows)
                .slice(
                  (filter.page - 1) * filter.rowsPerPage,
                  filter.page * filter.rowsPerPage
                )
                .map((machine, idx) => (
                  <tr key={idx}>
                    {filter.showIndexes && (
                      <td className="text-center small font-weight-bold">
                        {(filter.page - 1) * filter.rowsPerPage + idx + 1}
                      </td>
                    )}
                    {Object.keys(machine)
                      .filter((col, col_idx) =>
                        filter.columns
                          .filter(col => !col.hidden && !col.disabled)
                          .map(col => col.id)
                          .includes(col_idx + 1)
                      )
                      .map((col, col_idx) => (
                        <td key={col_idx} className="small">
                          {machine[col]}
                        </td>
                      ))}
                    <td>
                      <Link
                        to={`/machine/${machine.MachineId}`}
                        className="btn btn-link link-icon"
                      >
                        <i className="far fa-edit" />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <NoResults />
      )
      }
    </>
  )
}
