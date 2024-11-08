import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import DatasetCard from '../components/DatasetCard';
import DatasetModal from '../components/DatasetModal';

const Dashboard = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);  // State for file upload
  const [datasetName, setDatasetName] = useState('');      // State for dataset name
  
  useEffect(() => {
    async function fetchDatasets() {
      const res = await axios.get('http://localhost:5000/api/datasets');
      setDatasets(res.data);
    }
    fetchDatasets();
  }, []);

  const handleDatasetClick = (dataset) => {
    setSelectedDataset(dataset);
    setShowModal(true);
  };
  
  const handleCardClick = (dataset) => {
     setSelectedDataset(dataset);
     setShowModal(true);
    };
  
  const handleUniqueValues = async (column) => {
	  const res = await axios.get(`http://localhost:5000/api/datasets/${selectedDataset._id}/unique/${column}`);
	  console.log(res.data);
	};

  const closeModal = () => {
    setShowModal(false);
    setSelectedDataset(null);
  };
  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle dataset name input change
  const handleDatasetNameChange = (e) => {
    setDatasetName(e.target.value);
  };
  
  const handleFileUpload = async () => {
    if (!selectedFile || !datasetName) {
      alert('Please provide a dataset name and choose a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', datasetName);  // Add dataset name

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File uploaded successfully!');
      setSelectedFile(null);  // Reset file input
      setDatasetName('');     // Reset dataset name input

      // Refresh the datasets list after upload
      const res = await axios.get('http://localhost:5000/api/datasets');
      setDatasets(res.data);
    } catch (error) {
      console.error('Error uploading the file', error);
      alert('File upload failed!');
    }
  };

  return (
    <div className="main-container">
      <div className="nav-bar">
        <button onClick={() => {
          localStorage.removeItem('username');
          localStorage.removeItem('token');
          navigate('/login');
        }} className="logout-button top-right">
          Logout
        </button>
      </div>
      
      <div className="upload-container">
        <input 
          type="text" 
          placeholder="Dataset Name" 
          value={datasetName} 
          onChange={handleDatasetNameChange} 
          className="dataset-input"
        />
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="file-input"
        />
        <button onClick={handleFileUpload} className="upload-button">
          Upload CSV
        </button>
      </div>
      
      <div className="page-container">
        {datasets.map((dataset) => (
          <DatasetCard
                        key={dataset._id}
                        dataset={dataset}
                        onClick={() => handleCardClick(dataset)}
                    />
        ))}
        {showModal && selectedDataset && (
        <DatasetModal dataset={selectedDataset} onClose={closeModal} />
      )}
      </div>
    </div>
  );
};

export default Dashboard;
