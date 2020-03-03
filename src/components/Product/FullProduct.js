import React from 'react';

const fullProduct = (props) => {
    return(
        <div className="card card-body bg-light mt-5">
            <div className="text-center">
                <h2>Edytuj produkt</h2>
            </div>
            <form>
                <div className="form-group">
                    <label>Nazwa produktu</label>
                    <input type="text" name="name" className="form-control form-control-lg" value="" />
                </div>
                <div className="form-group">
                    <label>Cena</label>
                    <input type="number" name="name" className="form-control form-control-lg" value="" />
                </div>
                <div className="form-group">
                    <label>Cena promocyjna</label>
                    <input type="number" name="name" className="form-control form-control-lg" value="" />
                </div>
                <div className="form-group">
                    <label>Opis</label>
                    <textarea class="form-control" rows="4"></textarea>
                </div>
                <input type="submit" className="btn btn-success" value="Zapisz" />
            </form>
        </div>
    );
}

export default fullProduct;