import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../../context/navigation-context'
import { LangContext } from '../../../context/lang-context'
import { useHistory, Link } from 'react-router-dom'



import useFetch from '../../../hooks/fetchMSSQL-hook'
import useFilter from '../../../hooks/filter-hook'


// import SearchInput from '../../../components/SearchInput/SearchInput'
import Pagination from '../../../components/Pagination/Pagination'
import Filter from '../../../components/Filter/Filter'

import filterItems from '../../../util/filterItems'


export default (props) => {
    const { fetchMssqlApi } = useFetch()
    const { setHeaderData } = useContext(NavigationContext)
    const { TRL_Pack } = useContext(LangContext)
    const { searchedText, updateSearchedText, page, updateCurrentPage } = useFilter()
    const history = useHistory()

    const resetPage = () => setFilter(prev => ({ ...prev, page: 1 }))
    const resetFilter = () => setFilter(defaultFilter)
    const toggleFilter = () => setFilter(prev => ({ ...prev, visible: !prev.visible }))



    const [timeStamps, setTimeStamps] = useState([])
    const [reports, setReports] = useState([])
    const [summary, setSummary] = useState([])

    const handleSwitchPage = pageNo => () => setFilter(prev => ({ ...prev, page: pageNo }))

    const getData = () => {
        fetchMssqlApi(`time-spans`, {}, timeStamps => setTimeStamps(timeStamps))
        fetchMssqlApi(`report-conditions?reportId=${props.match.params.ReportId}`, {}, reports => setReports(reports))
    }


    useEffect(() => {
        setHeaderData({ text: TRL_Pack.definitions.products })
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    let defaultFilter




    const displayProperDate = (oldDate) => {
        const date = new Date(oldDate)
        const properDate = date.toISOString().split('T')[0]
        return properDate
    }


    if (localStorage.getItem("clientId") !== "console" && sessionStorage.getItem("DB_TYPE") !== "mysql") {
        defaultFilter = {
            showIndexes: false,
            page: 1,
            rowsPerPage: 25,
            rowsPerPageOptions: [10, 25, 50],
            visible: false,
            sortByColumns: true,
            sortBy: '3 | asc | text',
            activeTags: [],
            disableIndexes: "true",
            columns: [

                {
                    id: 3,
                    name: TRL_Pack.summaries.reportName,
                    sortable: true,
                    searchable: true,
                    type: 'text',
                },
                {
                    id: 10,
                    name: TRL_Pack.summaries.timeFrame,
                    sortable: true,
                    searchable: true,
                    type: 'text',
                },
                {
                    id: 11,
                    name: TRL_Pack.summaries.creationDateTime,
                    sortable: true,
                    searchable: true,
                    type: 'text',
                },
                {
                    id: 13,
                    name: TRL_Pack.summaries.sharedProduct,
                    sortable: true,
                    searchable: true,
                    selectable: true,
                    type: 'bool',
                },
            ]
        }
    }

    const reportFilter = row =>
        filter.columns
            .filter(col => col.searchbar ? col.searchbar : col.selectbar)
            .every(col => {
                const x = String(row[Object.keys(row)[col.id - 1]])
                    .toLowerCase()
                    .includes(col.searchbar ? col.searchbar.toLowerCase() : col.selectbar.toLowerCase())
                return x
            }
            )

    const sortRows = (a, b) => {
        const [id, order, type] = filter.sortBy.split(' | ')

        const col = Object.keys(reports[0])[Number(id) - 1]

        if (a[col] === b[col]) return 0
        else if (a[col] === null) return 1
        else if (b[col] === null) return -1

        let valueA, valueB
        if (type === 'text' || type === 'date') {

            valueA = a[col]?.toLowerCase()
            valueB = b[col]?.toLowerCase()
        }
        else if (type === "bool") {
            valueA = Number(a[col])
            valueB = Number(b[col])
        }
        else if (type === 'price') {
            valueA = Number(a[col].replace(',', ''))
            valueB = Number(b[col].replace(',', ''))

            //   // Number().toLocaleString(undefined, {minimumFractionDigits: 2}) num => str '1 245 151,50'
        } else return 0
        if (order === 'asc') return valueA < valueB ? -1 : 1
        else return valueA < valueB ? 1 : -1
    }

    const returnParsedIsShared = (col) => {
        if (typeof col === 'string') {
            return col
        }
        else if (typeof col === 'number') {
            if (col === 1) {
                return TRL_Pack.products.props.shared
            }
            else if (col === 0) {
                return TRL_Pack.products.props.notShared
            }
        }
        else if (col === true) return TRL_Pack.products.props.shared
        else if (col === false) return TRL_Pack.products.props.notShared
    }


    const [filter, setFilter] = useState(() => {
        if (localStorage.getItem('productFilter')) {
            return JSON.parse(localStorage.getItem('productFilter'))
        } else return defaultFilter
    })
    const filteredProducts = reports.filter(({ Name }) => filterItems(searchedText, Name))
    const currentSummary = summary.find(array => (array.ReportId == props.match.params.ReportId))
    useEffect(() => {
        fetchMssqlApi(`/reports-list`, {}, summary => setSummary(summary))
    }, [])
    return (
        <>
            { (
                <>
                    <Pagination
                        totalItems={filteredProducts.length}
                        page={filter.page}
                        rowsPerPage={filter.rowsPerPage}
                        handleSwitchPage={handleSwitchPage}
                        filterVisibility={filter.visible}
                        toggleFilter={toggleFilter}
                        resetFilter={resetFilter}

                    />
                    {filter.visible && (
                        <Filter
                            {...{
                                filter,
                                setFilter,
                                columns: filter.columns,
                                data: reports,
                                resetPage,
                                resetFilter
                            }}
                        />
                    )}
                    <div className="text-center"><h2>{currentSummary?.Name}</h2></div>
                    <div className="d-flex justify-content-end">
                        <button
                            onClick={() => history.push("/summaries")}
                            className=" btn btn-link text-decoration-none"

                        >
                            <i className="fas fa-arrow-left mr-2" />
                        </button>
                        <div style={{ flex: "1" }} />

                        <Link
                            to={`${props.location.pathname}/new`}
                            className="btn btn-link link-icon"

                        >
                            <i className="fas fa-plus ml-2" /> {TRL_Pack.summaries.addReport}
                        </Link>

                    </div>
                    <>
                        <div className="overflow-auto">
                            <table className="table table-striped border">
                                <thead>
                                    <tr>
                                        {filter.showIndexes && <th className="text-center">#</th>}
                                        {filter.columns
                                            .filter(col => !col.hidden && !col.disabled)
                                            .map((col, idx) => (
                                                <th key={idx}>{col.name}</th>
                                            ))}
                                        <th />
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts
                                        .filter(reportFilter)
                                        .sort(sortRows)
                                        .slice(
                                            (filter.page - 1) * filter.rowsPerPage,
                                            filter.page * filter.rowsPerPage
                                        )
                                        .map((product, idx) => (
                                            <tr key={idx}>
                                                {Object.keys(product)
                                                    .filter((col, col_idx) => {
                                                        return filter.columns
                                                            .filter(col => !col.hidden && !col.disabled)
                                                            .map(col => col.id)
                                                            .includes(col_idx + 1)
                                                    }
                                                    )
                                                    .map((col, col_idx) => (
                                                        <td key={col_idx} className="small">
                                                            <button

                                                                style={{ wordBreak: 'break-word' }}
                                                                className="btn btn-link font-size-inherit text-reset text-decoration-none p-1"
                                                            >
                                                                {sessionStorage.getItem("DB_TYPE") !== "mysql" ? (col_idx === 2 ? displayProperDate(product[col]) : returnParsedIsShared(product[col])) : product[col]}
                                                            </button>
                                                        </td>
                                                    ))}
                                                <td></td>
                                                <td style={{ width: "30px" }}>
                                                    <Link
                                                        to={`${props.location.pathname}/${product.ReportConditionId}`}
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
                    </>

                </>
            )
            }
        </>
    )
}
