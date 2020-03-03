import React, { useState, useReducer } from 'react';
import './App.css';

import Card from './components/Card/index';
import Table from './components/Table/index';

function tablesReducer(state, { type, payload }) {
    switch (type) {
        case 'ADD_ITEM':
            const [ firstTable, ...secondaryPartTables ] = state;

            return [
                [
                    ...firstTable || [], payload,
                ],
                ...secondaryPartTables,
            ]
        case 'COPY': {
            const firstPartTables = state.slice(0, payload.index);
            const lastPartTables = state.slice(payload.index, state.length);
            const currentTable = state[payload.index]

            return [
                ...firstPartTables,
                currentTable,
                ...lastPartTables,
            ]
        } case 'REMOVE': {
            if (state.length === 1) {
                return state
            }

            return state.filter((_, index) => {
                return payload.index !== index;
            });
        }
        case 'REMOVE_ITEM': {
            const currentTable = state[payload.index]
            const firstPartTables = state.slice(0, payload.index);
            const tablesAllAfterCurrent = state.slice(payload.index + 1, state.length);

            const newTable = currentTable.filter((_, index) => {
                return payload.itemIndex !== index;
            })

            return [
                ...firstPartTables,
                newTable,
                ...tablesAllAfterCurrent,
            ]
        }
        case 'EDIT_ITEM': {
            const currentTable = state[payload.index];

            const updatedCurrentTable = currentTable.map((item, index) => {
                if (index === payload.itemIndex) {
                    return {
                        ...payload.fields
                    }
                }

                return item
            })

            return state.map((table, index) => {
                if (index === payload.index) {
                    return updatedCurrentTable
                }

                return table
            })
        }
        default:
            return state
    }
}

function App() {
    function handle(type) {
        return function(data) {
            dispatch({ type, payload: data });
        }
    }

    const [tables, dispatch] = useReducer(tablesReducer, [[]])
    const [ activeTableItem, setActiveTableItem ] = useState(null);

    function handleEditItem({ index, itemIndex }) {
        setActiveTableItem({
            index,
            itemIndex,
            fields: {
                ...tables[index][itemIndex]
            }
        })
    }

    function editItem(payload) {
        handle('EDIT_ITEM')(payload)
        setActiveTableItem(null)
    }

    return (
        <div className="App">
            <Card
                onAdd={ handle('ADD_ITEM') }
                onSaveEdit={ editItem }
                activeTableItem={ activeTableItem }
            />
            {
                tables.map((data, index) =>
                    <Table
                        onCopy={ handle('COPY') }
                        onRemove={ handle('REMOVE') }
                        onEditItem={ handleEditItem }
                        onRemoveItem={ handle('REMOVE_ITEM') }
                        key={ index }
                        index={ index }
                        data={ data } />
                )
            }
        </div>
    );
}

export default App;
