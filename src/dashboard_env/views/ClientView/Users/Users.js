import React, { useState, useEffect, useContext } from 'react'
import { NavigationContext } from '../../../context/navigation-context'
import { LangContext } from '../../../context/lang-context'
import { Link } from 'react-router-dom'


import useForm from '../../../hooks/form-hook'
import useFetch from '../../../hooks/fetchMSSQL-hook'
import useFilter from '../../../hooks/filter-hook'


// import SearchInput from '../../../components/SearchInput/SearchInput'
import Pagination from '../../../components/Pagination/Pagination'
import Filter from '../../../components/Filter/Filter'

import filterItems from '../../../util/filterItems'

import EditUser from '../../../components/Modals/EditUser'
import EditPasswordUser from '../../../components/Modals/EditPasswordUser'
import AddUser from '../../../components/Modals/AddUser'


export default () => {
    const { fetchMssqlApi } = useFetch()
    const { form, openForm, closeForm } = useForm()
    const { setHeaderData } = useContext(NavigationContext)
    const { TRL_Pack } = useContext(LangContext)

    const { searchedText } = useFilter()

    const resetPage = () => setFilter(prev => ({ ...prev, page: 1 }))
    const resetFilter = () => setFilter(defaultFilter)
    const toggleFilter = () => setFilter(prev => ({ ...prev, visible: !prev.visible }))


    const [usersData, setUsersData] = useState([])
    const [id, setId] = useState()

    const handleSwitchPage = pageNo => () => setFilter(prev => ({ ...prev, page: pageNo }))


    let defaultFilter
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
                    id: 1,
                    name: "Id",
                    sortable: true,
                    searchable: true,
                    type: 'text',
                },
                {
                    id: 2,
                    name: TRL_Pack.Users.Name,
                    sortable: true,
                    searchable: true,
                    type: 'text',
                },
                {
                    id: 3,
                    name: "Email",
                    sortable: true,
                    searchable: true,
                    type: 'text',
                },
                {
                    id: 5,
                    name: TRL_Pack.Users.LastName,
                    sortable: true,
                    searchable: true,
                    type: 'text',
                },

                {
                    id: 6,
                    name: TRL_Pack.Users.Position,
                    sortable: true,
                    searchable: true,
                    type: 'text',
                },
            ]
        }
    }

    const usersFilter = row =>
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

        const col = Object.keys(usersData[0])[Number(id) - 1]

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
        } else return 0
        if (order === 'asc') return valueA < valueB ? -1 : 1
        else return valueA < valueB ? 1 : -1
    }



    const [filter, setFilter] = useState(() => {
        if (localStorage.getItem('productFilter')) {
            return JSON.parse(localStorage.getItem('productFilter'))
        } else return defaultFilter
    })
    const filteredUsers = usersData.filter(({ Name }) => filterItems(searchedText, Name))

    const handleOpenModal = (id, name) => {
        setId(id)
        openForm(name)()
    }

    useEffect(() => {
        setHeaderData({ text: TRL_Pack.Users.Users })
        fetchMssqlApi(`users`, {}, users => setUsersData(users))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            { (
                <>
                    <Pagination
                        totalItems={filteredUsers.length}
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
                                data: usersData,
                                resetPage,
                                resetFilter
                            }}
                        />
                    )}
                    <div className="d-flex justify-content-end btn btn-link link-icon mr-2" onClick={() => handleOpenModal(null, "addUser")} style={{ textDecoration: "none" }}>
                        <i className="fas fa-plus   mr-2" /> {TRL_Pack.Users.AddUser}
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
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersData
                                        .filter(usersFilter)
                                        .sort(sortRows)
                                        .slice(
                                            (filter.page - 1) * filter.rowsPerPage,
                                            filter.page * filter.rowsPerPage
                                        )
                                        .map((value, idx) => (
                                            <tr key={idx}>
                                                {Object.keys(value)
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
                                                                {value[col]}
                                                            </button>
                                                        </td>
                                                    ))}
                                                <td style={{ width: "30px" }}>
                                                    <i className="fas fa-key btn btn-link link-icon" onClick={() => handleOpenModal(value.UserId, "editPassword")} style={{ textDecoration: "none" }} />
                                                </td>
                                                <td style={{ width: "30px" }}>
                                                    <i className="far fa-edit btn btn-link link-icon" onClick={() => handleOpenModal(value.UserId, "editUser")} />
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {form === "editPassword" && form && (
                                <EditPasswordUser
                                    handleClose={closeForm}
                                    id={id}
                                />
                            )}
                            {form === "editUser" && form && (
                                <EditUser
                                    handleClose={closeForm}
                                    id={id}
                                    setUsersData={setUsersData}
                                />
                            )}
                            {form === "addUser" && form && (
                                <AddUser
                                    handleClose={closeForm}
                                    setUsersData={setUsersData}
                                />
                            )}
                        </div>

                    </>

                </>
            )
            }
        </>
    )
}
