/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, createRef } from 'react';
import './style.scss'

export default function Card({ onAdd, onSaveEdit, activeTableItem }) {
    const isEdit = !!activeTableItem
    let formData = initState()
    const refForm = createRef()

    const fields = [
        {
            key: 'name',
            placeholder: 'Name',
        },
        {
            key: 'surname',
            placeholder: 'Surname',
        },
        {
            key: 'age',
            placeholder: 'Age',
        },
        {
            key: 'city',
            placeholder: 'City',
        },
    ]

    function initState() {
        return {
            name: '',
            surname: '',
            age: null,
            city: '',
        };
    }

    function mutFormData(prop) {
        return function({ target }) {
            formData[prop] = target.value;
        }
    }

    function handleClick(e) {
        if (isEdit) {
            onSaveEdit({
                ...activeTableItem,
                fields: formData,
            })
        } else {
            onAdd(formData)
        }

        formData = initState()

        e.preventDefault()
        refForm.current.reset()
    }

    function handleFocus({ target }) {
        target.classList.add('hide-placeholder')
    }

    function handleBlur({ target }) {
        target.classList.remove('hide-placeholder')
    }

    useEffect(() => {
        if (isEdit) {
            Object.keys(activeTableItem.fields).forEach((key) => {
                formData[key] = activeTableItem.fields[key];
            })
        } else {
            formData = initState()
        }
    })

    return (
        <form className="card-form" ref={refForm} onSubmit={ handleClick }>
            { fields.map((field) => {
                return (
                    <input
                        key={field.key}
                        type="text"
                        required
                        placeholder={ field.placeholder }
                        defaultValue={ activeTableItem && activeTableItem.fields[field.key] }
                        className="card-form__field"
                        onInput={ mutFormData(field.key) }
                        onFocus={ handleFocus }
                        onBlur={ handleBlur }
                    />
                )
            })}
            <button className="card-form__action">
                { isEdit ? 'Edit' : 'Add' }
            </button>
        </form>
    )
}
