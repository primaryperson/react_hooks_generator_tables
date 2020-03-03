import React from 'react';
import './style.scss'

function Thead() {
    return (
        <thead>
            <tr>
                <th>Name</th>
                <th>Surname</th>
                <th>Age</th>
                <th>City</th>
                <th colSpan="2"></th>
            </tr>
        </thead>
    )
}

function TbodyItem({ fields, index, onEdit, onRemove }) {
    return (
        <tr>
            {
                Object.keys(fields).map((key) =>
                    <td key={key}>{ fields[key] }</td>
                )
            }
            <td colSpan="2">
                <div className="table-info__change-container">
                    <button className="table-info__edit-item" onClick={() => onEdit(index)}>Edit</button>
                    <button className="table-info__remove-item"  onClick={() => onRemove(index)}>Delete</button>
                </div>
            </td>
        </tr>
    )
}

function Tbody({ table, onEdit, onRemove }) {
    return (
        <tbody>
            {
                table.map((item, index) => {
                    return <TbodyItem
                                onEdit={() => onEdit(index)}
                                onRemove={() => onRemove(index)}
                                index={index}
                                key={index}
                                fields={ item }
                            />
                })
            }
        </tbody>
    )
}

export default function Table({ onCopy, onRemove, onEditItem, onRemoveItem, data, index }) {
    const emitIndex = (fn, payload) => {
        return () => fn({
            index,
            ...payload,
        })
    }

    const emitItemPayload = (fn) => {
        return (index) => emitIndex(fn, {
            itemIndex: index,
        })();
    };

    return (
        <div className="table-info">
            <div className="table-info__actions">
                <button className="table-info__copy-table" onClick={emitIndex(onCopy)}>Copy Table</button>
                <button className="table-info__remove-table" onClick={emitIndex(onRemove)}>
                    <img alt="delete" src="/btn_delete.svg" />
                </button>
            </div>
            <table>
                <Thead />
                <Tbody
                    onEdit={emitItemPayload(onEditItem)}
                    onRemove={emitItemPayload(onRemoveItem)}
                    table={data}
                />
            </table>
        </div>
    );
}
