import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '../../../context/lang-context'
import { NavigationContext } from '../../../context/navigation-context'
import ReturnLink from '../../../components/Return/ReturnLink'
import useFetch from '../../../hooks/fetch-hook'
import Pagination from '../../../components/Pagination/Pagination'
import Filter from '../../../components/Filter/Filter'
import Fab from '../../../components/FloatingActionButton/Fab'
import { API_URL } from '../../../config/config'

export default () => {
  const { TRL_Pack } = useContext(LangContext)
  const { fetchMssqlApi } = useFetch()
  const { setHeaderData } = useContext(NavigationContext)
  const [currentReport, setCurrentReport] = useState(null)

  const [page, setPage] = useState(1)
  const resetPage = () => setPage(1)

  const defaultFilter = {
    showIndexes: true,
    rowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
    visible: false
  }

  const [filter, setFilter] = useState(defaultFilter)

  const [tags, setTags] = useState([])
  const getTags = () => {
    fetchMssqlApi('tags', {}, tags => setTags(tags.machine))
  }

  const toggleFilter = () => setFilter(prev => ({ ...prev, visible: !prev.visible }))
  const resetFilter = () => {
    const currentReportConfig = defaultReports.find(
      report => report.id === currentReport.id
    )
    setFilter({
      ...defaultFilter,
      sortBy: currentReportConfig.defaultSorting,
      sortByColumns: currentReportConfig.sortByColumns,
      columns: currentReportConfig.columns,
      activeTags: []
    })
  }

  useEffect(
    () => {
      setHeaderData({ text: TRL_Pack.reports.header })

      getTags()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const defaultReports = [
    {
      id: 1,
      label: TRL_Pack.reports.lastVisits.title,
      apiPath: 'last-visits',
      sortByColumns: true,
      defaultSorting: '2 | asc | date',
      columns: [
        {
          id: 1,
          name: TRL_Pack.reports.lastVisits.cols[0],
          sortable: true,
          searchable: true,
          type: 'text',
          solid: true
        },
        {
          id: 2,
          name: TRL_Pack.reports.lastVisits.cols[1],
          sortable: true,
          type: 'date'
        },
        {
          id: 3,
          name: TRL_Pack.reports.lastVisits.cols[2],
          sortable: true,
          searchable: true,
          type: 'text'
        },
        {
          id: 4,
          name: TRL_Pack.reports.lastVisits.cols[3],
          sortable: true,
          type: 'money'
        },
        {
          id: 5,
          name: TRL_Pack.reports.lastVisits.cols[4],
          sortable: true,
          type: 'date'
        }
      ]
    },
    {
      id: 2,
      label: TRL_Pack.reports.lastCoinInventories.title,
      apiPath: 'last-coin-inventories',
      sortByColumns: true,
      defaultSorting: '5 | asc | date',
      columns: [
        {
          id: 1,
          name: TRL_Pack.reports.lastCoinInventories.cols[0],
          sortable: true,
          searchable: true,
          type: 'text',
          solid: true
        },
        {
          id: 2,
          name: TRL_Pack.reports.lastCoinInventories.cols[1],
          searchable: true,
          type: 'text'
        },
        {
          id: 3,
          name: TRL_Pack.reports.lastCoinInventories.cols[2],
          searchable: true,
          type: 'text'
        },
        {
          id: 4,
          name: TRL_Pack.reports.lastCoinInventories.cols[3],
          sortable: true,
          searchable: true,
          type: 'text'
        },
        {
          id: 5,
          name: TRL_Pack.reports.lastCoinInventories.cols[4],
          sortable: true,
          type: 'date'
        },
        {
          id: 6,
          name: TRL_Pack.reports.lastCoinInventories.cols[5],
          sortable: true,
          type: 'text'
        },
        {
          id: 7,
          name: TRL_Pack.reports.lastCoinInventories.cols[6],
          sortable: true,
          type: 'money'
        },
        {
          id: 8,
          name: TRL_Pack.reports.lastCoinInventories.cols[7],
          sortable: true,
          type: 'money'
        },
        {
          id: 9,
          name: TRL_Pack.reports.lastCoinInventories.cols[8],
          sortable: true,
          type: 'money'
        },
        {
          id: 10,
          name: TRL_Pack.reports.lastCoinInventories.cols[9],
          sortable: true,
          type: 'money'
        },
        {
          id: 11,
          name: TRL_Pack.reports.lastCoinInventories.cols[10],
          sortable: true,
          type: 'money'
        }
      ]
    },
    {
      id: 3,
      label: TRL_Pack.reports.lastCoinInventoriesSum.title,
      apiPath: 'last-coin-inventories-sum',
      sortByColumns: true,
      defaultSorting: '1 | asc | text',
      columns: [
        {
          id: 1,
          name: TRL_Pack.reports.lastCoinInventoriesSum.cols[0],
          sortable: true,
          searchable: true,
          type: 'text',
          solid: true
        },
        {
          id: 2,
          name: TRL_Pack.reports.lastCoinInventoriesSum.cols[1],
          searchable: true,
          type: 'text'
        },
        {
          id: 3,
          name: TRL_Pack.reports.lastCoinInventoriesSum.cols[2],
          sortable: true,
          searchable: true,
          type: 'text'
        },
        {
          id: 4,
          name: TRL_Pack.reports.lastCoinInventoriesSum.cols[3],
          sortable: true,
          searchable: true,
          type: 'money'
        },
        {
          id: 5,
          name: TRL_Pack.reports.lastCoinInventoriesSum.cols[4],
          sortable: true,
          searchable: true,
          type: 'money'
        },
        {
          id: 6,
          name: TRL_Pack.reports.lastCoinInventoriesSum.cols[5],
          sortable: true,
          searchable: true,
          type: 'money'
        },
        {
          id: 7,
          name: TRL_Pack.reports.lastCoinInventoriesSum.cols[6],
          sortable: true,
          searchable: true,
          type: 'money'
        },
        {
          id: 8,
          name: TRL_Pack.reports.lastCoinInventoriesSum.cols[7],
          sortable: true,
          searchable: true,
          type: 'money'
        },
        {
          id: 9,
          name: TRL_Pack.reports.lastCoinInventoriesSum.cols[8],
          sortable: true,
          searchable: true,
          type: 'text'
        },
        {
          id: 10,
          name: TRL_Pack.reports.lastCoinInventoriesSum.cols[9],
          sortable: true,
          searchable: true,
          type: 'text'
        }
      ]
    }
  ]

  const handleChange = id => {
    const report = defaultReports.find(r => r.id === id)

    setHeaderData({ text: TRL_Pack.reports.header, subtext: report.label })

    fetchMssqlApi(report.apiPath, {}, data => {
      report.data = data
      setFilter(prev => ({
        ...prev,
        sortBy: report.defaultSorting,
        sortByColumns: report.sortByColumns,
        columns: report.columns,
        activeTags: []
      }))
      setCurrentReport(report)
    })
  }

  const handleDownload = () => {
    const data = {
      filter: filter.columns.map(col => {
        const { id, name, searchable, sortable, solid, type, ...newFilterData } = col
        return newFilterData
      }),
      tags: [
        ...tags
          .filter(tag => filter.activeTags.includes(tag.tagId))
          .map(tag => [tag.tagId]),
        ...tags
          .filter(label => label.options.length > 0)
          .filter(label =>
            label.options.find(opt => filter.activeTags.includes(opt.tagId))
          )
          .map(tag =>
            tag.options
              .filter(opt => filter.activeTags.includes(opt.tagId))
              .map(opt => opt.tagId)
          )
      ]
    }

    fetchMssqlApi(
      currentReport.apiPath,
      { method: 'POST', data, hideNotification: true },
      path => window.open(`${API_URL}/${path}`, '_blank')
    )
  }

  const resetReport = () => {
    setHeaderData({ text: 'Reports' })
    setCurrentReport(null)
  }

  const handleSwitchPage = pageNo => () => setPage(pageNo)

  const sortRows = (a, b) => {
    const [id, order, type] = filter.sortBy.split(' | ')

    const col = Object.keys(currentReport.data[0])[Number(id) - 1]

    if (a[col] === b[col]) return 0
    else if (a[col] === null) return 1
    else if (b[col] === null) return -1

    let valueA, valueB

    if (type === 'text' || type === 'date') {
      valueA = a[col]?.toUpperCase()
      valueB = b[col]?.toUpperCase()
    } else if (type === 'money') {
      valueA = a[col]
      valueB = b[col]

      // Number().toLocaleString(undefined, {minimumFractionDigits: 2}) num => str '1 245 151,50'
    } else return 0

    if (order === 'asc') return valueA < valueB ? -1 : 1
    else return valueA < valueB ? 1 : -1
  }

  const reportFilter = row =>
    Object.values(row)[0] !== null &&
    filter.columns
      .filter(col => col.searchbar)
      .every(
        col =>
          row[Object.keys(row)[col.id - 1]] !== null &&
          row[Object.keys(row)[col.id - 1]]
            .toLowerCase()
            .includes(col.searchbar.toLowerCase())
      )

  const tagFilter = machine => {
    return (
      tags
        .filter(tag => tag.options.length === 0 && filter.activeTags.includes(tag.tagId))
        .map(tag => tag.tagId)
        .every(tag => machine.MachineTags.split(', ').includes(tag)) &&
      tags
        .filter(
          label =>
            label.options.length > 0 &&
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

  // const tagFilter = machine =>
  //   tags
  //     .filter(tag => tag.isActive)
  //     .map(tag => tag.tagId)
  //     .every(tag => machine.MachineTags.split(', ').includes(tag)) &&
  //   tags
  //     .filter(tag => !tag.tagId)
  //     .filter(tag => tag.options.find(opt => opt.isActive))
  //     .map(tag => tag.options.filter(opt => opt.isActive).map(tag => tag.tagId))
  //     .every(label => label.some(opt => machine.MachineTags.split(', ').includes(opt)))

  const formatValue = (col_idx, value) => {
    if (value === null) return value
    if (currentReport.columns[col_idx].type === 'money')
      return value.toLocaleString('pl-PL', {
        minimumFractionDigits: 2,
        style: 'currency',
        currency: 'PLN'
      })
    return value
  }

  return (
    <>
      {currentReport ? (
        <>
          <Fab action={handleDownload} icon="far fa-save" />
          <ReturnLink handleClick={resetReport} path="#" />
          <Pagination
            {...{
              totalItems: currentReport.data.filter(reportFilter).length,
              page,
              handleSwitchPage,
              rowsPerPage: filter.rowsPerPage,
              toggleFilter,
              filterVisibility: filter.visible
            }}
          />
          {filter.visible && (
            <Filter
              {...{
                filter,
                setFilter,
                columns: currentReport.columns,
                data: currentReport.data,
                resetPage,
                tags,
                resetFilter
              }}
            />
          )}
          {currentReport.data && (
            <div className="row">
              <div className="col overflow-auto">
                <table className="table table-striped table-bordered align-middle table-machines">
                  <thead>
                    <tr>
                      {filter.showIndexes && <th className="text-center">#</th>}
                      {filter.columns
                        .filter(col => !col.hidden)
                        .map((col, idx) => (
                          <th key={idx}>{col.name}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentReport.data
                      .filter(reportFilter)
                      .filter(tagFilter)
                      .sort(sortRows)
                      .slice((page - 1) * filter.rowsPerPage, page * filter.rowsPerPage)
                      .map((row, row_idx) => (
                        <tr key={row_idx}>
                          {filter.showIndexes && (
                            <td className="text-center small font-weight-bold">
                              {(page - 1) * filter.rowsPerPage + row_idx + 1}
                            </td>
                          )}
                          {Object.keys(row).map(
                            (col, col_idx) =>
                              filter.columns
                                .filter(col => !col.hidden)
                                .map(col => col.id)
                                .includes(col_idx + 1) && (
                                <td key={col_idx} className="small">
                                  {formatValue(col_idx, row[col])}
                                </td>
                              )
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="row">
          {defaultReports.map(report => (
            <div key={report.id} className="col-12 col-md-6 col-lg-4 mb-2">
              <button
                onClick={() => handleChange(report.id)}
                className="h-100 btn list-group-item list-group-item-action rounded"
                disabled={report.disabled}
              >
                {report.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
