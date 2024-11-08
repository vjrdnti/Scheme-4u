import React, { useState, useEffect } from 'react';
import './Main.css';
import Schemes from '../components/Scheme';

const UserFormPage = () => {
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [currentCard, setCurrentCard] = useState(0);
	const [formData, setFormData] = useState({
		name: '',
		age: '',
		email: '',
		phone: '',
		state: '',
		caste: '',
		minority: '',
		gender: '',
		residence: '',
		disabled: '',
		marital_status: '',
		bpl: '',
		employment: '',
		gemployee: '',
		student: '',
		occupation: '',
		mailoption: false,
	  });
	const [options, setOptions] = useState({}); 
	const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
	const [showSchemes, setShowSchemes] = useState(false);
	const [schemeData, setSchemeData] = useState([]);
	
	useEffect(() => {
		const fetchOptions = async () => {
		  try {
		    const response = await fetch('http://localhost:5000/api/form/dropdown-data');
		    const data = await response.json();
		    setOptions(data.dropdownData); 
		    console.log(options);
		  } catch (error) {
		    console.error('Error fetching options:', error);
		  }
		};		
		fetchOptions();
		//console.log(options);
	  }, []);
	  
	const [form2Data, setForm2Data] = useState({
        phone: '',
        mailoption: true,
    });
    
    const [form3Data, setForm3Data] = useState({
        phone: '',
        mailoption: false,
    });
    
    const [sessionBooked, setSessionBooked] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    
    const handleInputChange2 = (e) => {
        const { name, value, type, checked } = e.target;
        setForm2Data({
            ...form2Data,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    
    const handleInputChange3 = (e) => {
        const { name, value, type, checked } = e.target;
        setForm3Data({
            ...form3Data,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    
   const flipToNextCard = () => {
    setCurrentCard(currentCard === 0 ? 1 : 0);
  };

    const handleFirstTimeSubmit = async (e) => {
        e.preventDefault();
        console.log(JSON.stringify(formData));
        const response = await fetch('http://localhost:5000/api/form/first-time', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.status===201) {
        	setSchemeData(data.schemes);
        	setShowSchemes(true);
            alert('Form submitted! Check your email for options.');
            // Render scheme cards section after successful submission
            setIsFirstTime(false);
        }
        else if(response.status===202){
          setSchemeData(data.schemes);
          setShowSchemes(true);
          alert(`updated user data for ${formData.phone}`);
          setIsFirstTime(false);
        }
        else{
          alert('server error');
        }
    };
    
    
    const handleSecondSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/form/not-first-time', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form2Data),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Form submitted.');
            setSchemeData(data.schemes);
            setIsFirstTime(false);
            setShowSchemes(true);
        }
        else if(response.status===406){
          alert('phone number not in db');
        }
    };
    

    const handleCounsellingSubmit = async (e) => {
        e.preventDefault();
        const { phone } = form3Data.phone;
        const response = await fetch('http://localhost:5000/api/form/further-counselling', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form3Data),
        });
        if (response.ok) {
            setSessionBooked(true);
            alert('Session booked! Check your email.');
        }
        else if(response.status===404){
          alert('No user found');
        }
        else{
          alert('server error');
        }
    };

    return (
			<div className="form-container">
			  <div className="flip-card">
				<div className={`flip-card-inner ${currentCard === 1 ? 'flipped' : ''}`}>
				  
				  {/* First Time Registration - Front Side */}
				  <div className="flip-card-front">
					<h2>First Time Registration</h2>
					<form onSubmit={handleFirstTimeSubmit} className="grid-form">
					  <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
					  <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required />
					  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
					  <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
					  <label>State</label>
						<select name="state" value={formData.state} onChange={handleInputChange} required>
						  <option value={null}>Select State</option> {/* Default null option */}
						  {options.state && options.state.map((state) => <option key={state} value={state}>{state}</option>)}
						</select>
					  <button type="button" onClick={() => setShowAdditionalDetails(true)}>Show more</button>
					  <label>
						  <input type="checkbox" name="mailoption" checked={formData.mailoption} onChange={handleInputChange} />
						  Send my options via email
						</label>
						  <div className="action-buttons">
						    <button type="submit" className="submit-button">Submit</button>
						  </div>
					  {showAdditionalDetails && (
					  	<>
					  	<div className="additional-details">

						<label>Caste</label>
						<select name="caste" value={formData.caste} onChange={handleInputChange}>
						  <option value={null}>Select Caste</option>
						  {options.caste && options.caste.map((caste) => <option key={caste} value={caste}>{caste}</option>)}
						</select>

						<label>Minority?</label>
						<select name="minority" value={formData.minority} onChange={handleInputChange}>
						  <option value={null}>Select Minority Status</option>
						  {options.minority && options.minority.map((minority) => <option key={minority} value={minority}>{minority}</option>)}
						</select>

						<label>Urban/Rural</label>
						<select name="residence" value={formData.residence} onChange={handleInputChange}>
						  <option value={null}>Select Residence</option>
						  {options.residence && options.residence.map((residence) => <option key={residence} value={residence}>{residence}</option>)}
						</select>

						<label>Gender</label>
						<select name="gender" value={formData.gender} onChange={handleInputChange}>
						  <option value={null}>Select Gender</option>
						  {options.gender && options.gender.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
						</select>

						<label>Are you disabled?</label>
						<select name="disabled" value={formData.disabled} onChange={handleInputChange}>
						  <option value={null}>Select Disability Status</option>
						  {options.disabled && options.disabled.map((disabled) => <option key={disabled} value={disabled}>{disabled}</option>)}
						</select>

						<label>Marital Status</label>
						<select name="marital_status" value={formData.marital_status} onChange={handleInputChange}>
						  <option value={null}>Select Marital Status</option>
						  {options.marital_status && options.marital_status.map((status) => <option key={status} value={status}>{status}</option>)}
						</select>

						<label>Are you BPL?</label>
						<select name="bpl" value={formData.bpl} onChange={handleInputChange}>
						  <option value={null}>Select BPL Status</option>
						  {options.bpl && options.bpl.map((bpl) => <option key={bpl} value={bpl}>{bpl}</option>)}
						</select>

						<label>Employment Status</label>
						<select name="employment" value={formData.employment} onChange={handleInputChange}>
						  <option value={null}>Select Employment Status</option>
						  {options.employment && options.employment.map((employment) => <option key={employment} value={employment}>{employment}</option>)}
						</select>

						<label>Are you a government employee?</label>
						<select name="gemployee" value={formData.gemployee} onChange={handleInputChange}>
						  <option value={null}>Select Government Employee Status</option>
						  {options.gemployee && options.gemployee.map((gemployee) => <option key={gemployee} value={gemployee}>{gemployee}</option>)}
						</select>

						<label>Are you a student?</label>
						<select name="student" value={formData.student} onChange={handleInputChange}>
						  <option value={null}>Select Student Status</option>
						  {options.student && options.student.map((student) => <option key={student} value={student}>{student}</option>)}
						</select>

						<label>Occupation</label>
						<select name="occupation" value={formData.occupation} onChange={handleInputChange}>
						  <option value={null}>Select Occupation</option>
						  {options.occupation && options.occupation.map((occupation) => <option key={occupation} value={occupation}>{occupation}</option>)}
						</select>
						<div className="action-buttons">
						    <button type="button" onClick={() => setShowAdditionalDetails(false)}>Back</button>
						</div>
						</div>
						</>
						)}
					</form>
				  </div>

				  {/* Further Counselling - Back Side */}
				  <div className="flip-card-back">
					<h2>Further Counselling</h2>
					<form onSubmit={handleCounsellingSubmit} className="grid-form">
					  <input type="phone" name="phone" placeholder="Enter your registered phone" value={form3Data.phone} onChange={handleInputChange3} required />
					  <label>
						<input type="checkbox" name="mailoption" checked={form3Data.mailoption} onChange={handleInputChange3} />
						Send my options via email
					  </label>
					  <button type="submit" className="submit-button">See results</button>
					</form>
					<h2>check results again</h2>
					<form onSubmit={handleSecondSubmit} className="grid-form">
					  <input type="phone" name="phone" placeholder="enter number" value={form2Data.phone} onChange={handleInputChange2} required />
					  <div className="action-buttons">
						<button type="submit" className="submit-button">Submit</button>
					  </div>
					</form>
				  </div>

				</div>
			  </div>

			  <div className="flip-button">
				<button onClick={flipToNextCard}>
				  {currentCard === 0 ? 'Not your first visit? Click here' : 'Go to First Time Registration'}
				</button>
			  </div>
			  {showSchemes && (
			  	<Schemes show={showSchemes} data={schemeData} onClose={() => setShowSchemes(false)} />
			  )}
			</div>
  	)
};


export default UserFormPage;

