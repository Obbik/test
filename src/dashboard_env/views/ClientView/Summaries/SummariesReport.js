import React from 'react'

const SummariesReport = () => {
    return (
        <div className="row mb-4">
            <div className="col-12 col-md-6 mb-4 mb-md-0">
                <div className="card h-100">
                    <h5 className="card-header">Podstawowe Dane </h5>
                    <div className="card-body d-flex flex-column justify-content-center">

                        <form id="machine-form" autoComplete="off">
                            <div className="row mb-3">
                                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">
                                    Numer
                                    </div>
                                <div className="col-lg-8 my-auto">
                                    <input
                                        className="mx-auto mx-lg-0"
                                        style={{ maxWidth: 275 }}
                                        name="machineName"
                                        value="PA 814/3/2021"
                                        minLength={2}
                                        maxLength={50}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">
                                    typ
                                    </div>
                                <div className="col-lg-8 my-auto">
                                    <input
                                        style={{ maxWidth: 275 }}
                                        className="mx-auto mx-lg-0"
                                        name="location"
                                        value="sprzedaż dedaliczna"
                                        // handleChange={handleChange}
                                        // list={locationsData.map(location => location.Name)}
                                        newList
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">
                                    Dokument Magazynowy
                                </div>
                                <div className="col-lg-8 my-auto">
                                    <input
                                        style={{ maxWidth: 275 }}
                                        className="mx-auto mx-lg-0"
                                        name="machineType"
                                        value="Wz 819/3/2021"
                                        // handleChange={handleChange}
                                        // list={machineTypesData.map(machineType => machineType.Name)}
                                        newList
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">
                                    maszyna
                                </div>
                                <div className="col-lg-8 my-auto">
                                    <input
                                        style={{ maxWidth: 275 }}
                                        className="mx-auto mx-lg-0"
                                        name="maintenance"
                                        value="góra sałatkowiec"
                                        // handleChange={handleChange}
                                        // list={maintenancesData.map(maintenances => maintenances.Name)}
                                        newList
                                    />
                                </div>
                            </div>
                            <div className="row mb-n1">
                                <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">Stworzony</div>
                                <div className="col-lg-8 my-auto">
                                    <input
                                        style={{ maxWidth: 275 }}
                                        className="mx-auto mx-lg-0"
                                        name="maintenance"
                                        value="16.03.2020"
                                        // handleChange={handleChange}
                                        // list={maintenancesData.map(maintenances => maintenances.Name)}
                                        newList
                                    />
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="card h-100">
                    <h5 className="card-header">test</h5>
                    <div className="card-body d-flex flex-column justify-content-center">
                        <div className="row mb-3">
                            <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right">Informacje Dodatkowe</div>
                            <strong className="col-lg-6 text-center text-lg-left text-center">
                                Sprzedaż przez maszynę
                            </strong>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-4 mb-2 mb-lg-0 text-lg-right"> Wartość brutto</div>
                            <strong className="col-lg-8 text-center text-lg-left">
                                2,80
                                </strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummariesReport
