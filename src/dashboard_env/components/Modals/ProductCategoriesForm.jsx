import React, { useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import FormSkel from './FormSkel'

export default ({
  categories,
  productCategories,
  toggleCategory,
  submitForm,
  closeForm
}) => {
  const { TRL_Pack } = useContext(LangContext)

  return (
    <FormSkel
      headerText={TRL_Pack.products.productCategoriesHeader}
      handleClose={closeForm}
    >
      <form className="mb-n3" id="modal-form" onSubmit={submitForm}>
        {categories
          .filter(category => category.CategoryId)
          .map((category, idx) => (
            <div key={idx} className="form-group form-check">
              <label className="form-check-label">
                <input
                  type="checkbox"
                  checked={productCategories.includes(category.CategoryId)}
                  onChange={toggleCategory(category.CategoryId)}
                  className="form-check-input mr-2"
                />
                <h6 className="mb-0">{category.Name}</h6>
              </label>
            </div>
          ))}
      </form>
    </FormSkel>
  )
}
