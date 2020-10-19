import React, { useState, useContext } from 'react'
import { LangContext } from '../../context/lang-context'
import FormSkel from './FormSkel'

export default ({ tags, setTags, handleClose, multitag, setFilter }) => {
  const { TRL_Pack } = useContext(LangContext)

  const [activeLabel, setActiveLabel] = useState(null)

  const addTagToFilter = tagId => {
    setFilter(prev => ({ ...prev, activeTags: prev.activateTags.concat(tagId) }))
  }

  const handleChange = labelIdx => () => {
    if (labelIdx === activeLabel) {
      setActiveLabel(null)
    } else if (tags[labelIdx].options.length > 0) {
      setActiveLabel(labelIdx)
    } else {
      setTags(prev =>
        prev.map((tag, idx) =>
          labelIdx === idx
            ? {
                ...tag,
                isActive: !tag.isActive
              }
            : tag
        )
      )
      setActiveLabel(null)
    }
  }

  const activateTag = tagId => () => {
    setTags(prev =>
      prev.map((tag, idx) =>
        activeLabel === idx
          ? {
              ...tag,
              options: tag.options.map(opt => {
                if (tagId === opt.tagId) return { ...opt, isActive: !opt.isActive }
                else if (!multitag)
                  return {
                    ...opt,
                    isActive: false
                  }
                else return opt
              })
            }
          : tag
      )
    )
  }

  return (
    <FormSkel headerText="Tagi" noFooter handleClose={handleClose} classes="d-flex p-0">
      <div className="w-50 overflow-auto" style={{ maxHeight: 250 }}>
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className={`font-weight-bolder list-group-item cursor-pointer ${
              idx === activeLabel
                ? 'active'
                : tag.isActive
                ? 'list-group-item-success'
                : ''
            }`}
            onClick={handleChange(idx)}
          >
            {tag.label}
          </div>
        ))}
      </div>
      {activeLabel !== null && (
        <div className="w-50 overflow-auto" style={{ maxHeight: 250 }}>
          {tags[activeLabel].options.map((opt, idx) => (
            <div
              key={idx}
              className={`font-weight-bolder list-group-item cursor-pointer ${
                opt.isActive ? 'list-group-item-success' : ''
              }`}
              onClick={activateTag(opt.tagId)}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </FormSkel>
  )
}
