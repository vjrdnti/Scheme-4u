import './Scheme.css';
import React, { useState } from 'react';

function Schemes({ data, show, onClose }) {
  let schemes = JSON.parse(data);
  const [selectedScheme, setSelectedScheme] = useState(null);
  if (!show) return null;


  const openModal = (scheme) => {
 	console.log(scheme);
    setSelectedScheme(scheme);
  };

  const closeModal = () => {
    setSelectedScheme(null);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="App">
      <h1>Government Schemes for VJNT and SBC Students</h1>
      <div className="scheme-cards">
        {schemes.map((scheme, index) => (
          <div className="scheme-card" key={index} onClick={() => openModal(scheme)}>
            <h2>{scheme.name}</h2>
          </div>
        ))}
      </div>

      {selectedScheme && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>
            <h2>{selectedScheme.name}</h2>
            <a href={selectedScheme.link} target="_blank" rel="noopener noreferrer">Check Eligibility</a>
            <p><strong>Details:</strong> {selectedScheme.details}</p>
            <p><strong>Benefits:</strong> {selectedScheme.benefits}</p>
            <p><strong>Eligibility:</strong> {selectedScheme.eligibility}</p>
            <p><strong>Process:</strong> {selectedScheme.process}</p>
            <p><strong>Required Documents:</strong> {selectedScheme.documents}</p>
            <p><strong>Resources:</strong>{selectedScheme.resources}</p>
          </div>
        </div>
      )}
    </div>
      </div>
    </div>
  );
}

export default Schemes;
