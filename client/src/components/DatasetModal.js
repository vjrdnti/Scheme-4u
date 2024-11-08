import React, { useState } from 'react';
import './DatasetModal.css';

const DatasetModal = ({ dataset, onClose }) => {
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [uniqueValues, setUniqueValues] = useState({});

    const handleColumnChange = (column) => {
        setSelectedColumns(prev =>
            prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
        );
    };

    const getUniqueValues = (column) => {
        const values = dataset.data.map(item => item[column]);
        const unique = [...new Set(values)];
        setUniqueValues(prev => ({ ...prev, [column]: unique }));
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{dataset.name}</h2>
                <div>
                    <h3>Select Columns to View:</h3>
                    {Object.keys(dataset.data[0] || {}).map(column => (
                        <div key={column}>
                            <input
                                type="checkbox"
                                checked={selectedColumns.includes(column)}
                                onChange={() => handleColumnChange(column)}
                            />
                            <label>{column}</label>
                            <button onClick={() => getUniqueValues(column)}>Get Unique</button>
                            {uniqueValues[column] && (
                                <div>
                                    <h4>Unique Values:</h4>
                                    <ul>
                                        {uniqueValues[column].map((value, index) => (
                                            <li key={index}>{value}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <h3>Data Preview:</h3>
                <table>
                    <thead>
                        <tr>
                            {selectedColumns.map(column => (
                                <th key={column}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataset.data.map((item, index) => (
                            <tr key={index}>
                                {selectedColumns.map(column => (
                                    <td key={column}>{item[column]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DatasetModal;
	
