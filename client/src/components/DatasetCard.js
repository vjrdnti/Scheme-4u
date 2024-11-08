import React, { useState } from 'react';
import './DatasetCard.css';

const DatasetCard = ({ dataset, onClick }) => {
    return (
        <div className="dataset-card" onClick={onClick}>
            <h3>{dataset.name}</h3>
            <p>{dataset.data.length} records</p>
        </div>
    );
};

export default DatasetCard;

