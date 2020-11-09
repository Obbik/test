import React, { Fragment, useState } from 'react';
import useFetch from '../../hooks/fetch-hook';

// TO DO: merge/unmerge user instructions

const TestFeeder = () => {
    const { fetchApi } = useFetch();

    const [machineFeederNo, setMachineFeederNo] = useState('');
    const [selectedRadio, setSelectedRadio] = useState('Vend');

    const handleSubmit = e => {
        e.preventDefault();

        let url = 'shop/test-feeder';

        if (selectedRadio === 'Merge')
            url = '/shop/feeder/double';
        else if (selectedRadio === 'Unmerge')
            url = '/shop/feeder/single';

        fetchApi(
            url,
            { method: 'POST', data: { MachineFeederNo: machineFeederNo } }
        )
    }

    return (
        <Fragment>
            <div className="row">
                <div className="col-12 mb-2">
                    <h5>Ustawienia wyboru</h5>
                </div>
                <div className="col-12">
                    <form onSubmit={handleSubmit} className="form-inline">
                        <div className="form-group mr-3">
                            <label htmlFor="MachineFeederNo" className="sr-only">Numer wyboru</label>
                            <input
                                type="number"
                                className="form-control"
                                id="MachineFeederNo"
                                name="MachineFeederNo"
                                placeholder="Podaj nr wyboru"
                                min={0}
                                onChange={e => setMachineFeederNo(e.target.value)}
                                value={machineFeederNo}
                                required
                            />
                        </div>
                        <div className="form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="VendRadio"
                                id="VendRadio"
                                onChange={e => setSelectedRadio(e.target.value)}
                                value="Vend"
                                checked={selectedRadio === "Vend"}
                            />
                            <label className="form-check-label" htmlFor="VendRadio">
                                Wydaj
                            </label>
                        </div>
                        <div className="form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="MergeRadio"
                                id="MergeRadio"
                                onChange={e => setSelectedRadio(e.target.value)}
                                value="Merge"
                                checked={selectedRadio === "Merge"}
                            />
                            <label className="form-check-label" htmlFor="MergeRadio">
                                Połącz
                            </label>
                        </div>
                        <div className="form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="UnmergeRadio"
                                id="UnmergeRadio"
                                onChange={e => setSelectedRadio(e.target.value)}
                                value="Unmerge"
                                checked={selectedRadio === "Unmerge"}
                            />
                            <label className="form-check-label" htmlFor="UnmergeRadio">
                                Rozłącz
                            </label>
                        </div>
                        <button type="submit" className="btn btn-secondary mr-2">Wydaj</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default TestFeeder;