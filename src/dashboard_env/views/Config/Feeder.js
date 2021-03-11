import React, { Fragment, useState, useContext } from 'react';
import useFetch from '../../hooks/fetchMSSQL-hook';
import { LangContext } from '../../context/lang-context'
// TO DO: merge/unmerge user instructions

const TestFeeder = () => {
    const { TRL_Pack } = useContext(LangContext)
    const { fetchMssqlApi } = useFetch();

    const [machineFeederNo, setMachineFeederNo] = useState('');
    const [selectedRadio, setSelectedRadio] = useState('Vend');

    const handleSubmit = e => {
        e.preventDefault();

        let url = 'shop/test-feeder';

        if (selectedRadio === 'Merge')
            url = 'shop/feeder/double';
        else if (selectedRadio === 'Unmerge')
            url = 'shop/feeder/single';

        fetchMssqlApi(
            url,
            { method: 'POST', data: { MachineFeederNo: machineFeederNo } }
        )
    }

    return (
        <Fragment>
            <div className="row">
                <div className="col-12 mb-2">
                    <h5>{TRL_Pack.lift.choiceSettings}</h5>
                </div>
                <div className="col-12">
                    <form onSubmit={handleSubmit} className="form-inline">
                        <div className="form-group mr-3">
                            <label htmlFor="MachineFeederNo" className="sr-only">{TRL_Pack.lift.setNumberOfChoice}</label>
                            <input
                                type="number"
                                className="form-control"
                                id="MachineFeederNo"
                                name="MachineFeederNo"
                                placeholder={TRL_Pack.lift.setNumberOfChoice}
                                min={0}
                                onChange={e => setMachineFeederNo(e.target.value)}
                                onKeyUp={e => setMachineFeederNo(e.target.value)}
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
                                {TRL_Pack.lift.spend}
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
                                {TRL_Pack.lift.merge}
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
                                {TRL_Pack.lift.unmerge}
                            </label>
                        </div>
                        <button type="submit" className="btn btn-secondary mr-2">{TRL_Pack.lift.send}</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default TestFeeder;