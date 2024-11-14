const UserForm = require('../models/Users');
const sendEmail = require('../utilities/emailService');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const schemeDataPath = path.join(__dirname, '../data/filters_and_slugs.json');
const mainDataPath = path.join(__dirname, '../data/main.json');

const jsonData = JSON.parse(fs.readFileSync(schemeDataPath, 'utf8'));
const mainData = JSON.parse(fs.readFileSync(mainDataPath, 'utf8'));


//ENDPOINT 1
const getDropdownData = async (req, res) => {
  try {
    const dropdownData = {};
    jsonData.forEach((scheme) => {

      Object.keys(scheme).forEach((key) => {
        if (!dropdownData[key]) {
          dropdownData[key] = new Set(); 
        }

        // for each subcategory key (e.g., "All", "MP" under "state")
        if (typeof scheme[key] === 'object') {
          Object.keys(scheme[key]).forEach((subKey) => {
            dropdownData[key].add(subKey);
          });
        }
      });
    });


    Object.keys(dropdownData).forEach((key) => {
      dropdownData[key] = Array.from(dropdownData[key]);
    });

    res.status(200).json({ success: true, dropdownData });
  } catch (error) {
    console.error('Error generating dropdown data:', error);
    res.status(500).json({ success: false, message: 'Error generating dropdown data' });
  }
};	

// ENDPOINT 2
const furtherCounselling = async (req, res) => {
  const { phone, mailOption } = req.body;
  //console.log( phone );
  try {

    const userForm = await UserForm.findOne({ phone });

    if (userForm) {

    const personalEmail = process.env.PERSONAL_EMAIL;  // Your personal email
    const userData = JSON.stringify(userForm, null, 2); 

    await sendEmail(personalEmail, 'Further Counselling booking', `${JSON.stringify(userData)}`);
    await sendEmail(userForm.email, 'Your session is booked', `${JSON.stringify(userData)}`);

    res.status(200).json({ message: 'Email sent successfully', userForm });
    }
    else{
      res.status(404).json({ error: 'No user data found' });
    }
  } catch (error) {
    console.error('Error retrieving user data or sending email:', error);
    res.status(500).json({ error: 'Failed to retrieve data or send email' });
  }
};



// ENDPOINT 3
const submitFirstTimeForm = async (req, res) => {
  const { name, age, email, phone, state, caste, minority, gender, residence, diasbled, marital_status, bpl, employment, gemployee, student, occupation, mailoption } = req.body;
  //console.log(mailoption);
  let filledFields = [];
  let filledValues = [];
  let arrayOfArrays = [];
  
	for (let field in req.body) {
		if (field === 'name') continue;
		if (field === 'age') continue;
		if (field === 'email') continue;
		if (field === 'phone') continue;
		if (field === 'mailoption') continue;
		if (req.body[field] !== '' && req.body[field]!==false && req.body[field]!==true) {
				filledFields.push(field);
				filledValues.push(req.body[field]);
		}
	}
	
	//console.log(filledFields);
	
	for (let i = 0; i < filledFields.length; i++) {
		let arr = jsonData[0][`${filledFields[i]}`][`${filledValues[i]}`];
		if (arr) {
        arrayOfArrays.push(arr);
    }
	}
	
	let currentArray = [];
	let len_to_iterate = arrayOfArrays.length;
	
	while(len_to_iterate!==1){
		let tempArray = arrayOfArrays[0];
		for (let i = 1; i < len_to_iterate; i++) {
		  tempArray = tempArray.filter(value => arrayOfArrays[i].includes(value));
		}
		currentArray = currentArray.concat(tempArray);
		len_to_iterate = len_to_iterate - 1;
	}
	
	
    try {
    // Check if user already exists by phone
    const exists1 = await UserForm.findOne({ email });
    const exists = await UserForm.findOne({ phone });

    if (exists && exists1) {

      await UserForm.deleteOne({ _id: exists._id });
    }
    if (exists1 && !exists){

    	await UserForm.deleteOne({ _id: exists1._id });
    }
    
    if (!exists1 && exists){

    	await UserForm.deleteOne({ _id: exists._id });
    }
    
    let ans_arr = []
	
	for(let i=0; i<Object.keys(mainData['slug']).length; i++){
		if( currentArray.includes(mainData['slug'][i]) ) {
			let ans = {'name': mainData['Scheme Name'][i],  'link': mainData['link'][i], 'details': mainData['details'][i],
						'benefits': mainData['benefits'][i], 'eligibility': mainData['eligibility'][i], 'process': mainData['process'][i],
						'documents': mainData['document-list'][i], 'resources': mainData['resources'][i]
					  };
			ans_arr.push(ans);
			//console.log(ans['name']);
		}
	}
	
	
	// Save to DB
	let prediction = [].concat(ans_arr).reverse();
    const newForm = new UserForm({ name, age, email, phone, state, caste, minority, gender, residence, diasbled, marital_status, bpl, employment, gemployee, student, occupation, prediction });
    await newForm.save();
		
		// mail if mailoption is true
    if (mailoption===true) {
      await sendEmail(email, 'Your schemes', `${JSON.stringify(prediction)}`);
    }
    
    res.status(exists ? 202 : 201).json({ schemes:`${JSON.stringify(prediction)}` });
  } catch (error) {
    console.log(`Error saving form data or sending email: ${error}`);
    res.status(500).json({ error: 'Failed to save form or send email' });
  }
};



// ENDPOINT 4
const submitSecondTimeForm = async (req, res) => {
  const { phone, mailoption } = req.body;
  try {

    const exists = await UserForm.findOne({ phone });
    
    if (!exists) {
      return res.status(406).json({ message: 'No user found' });
    }
    

    let userData = { 'state': exists.state, 'gender': exists.gender, 'caste': exists.caste, 'minority': exists.minority, 'gender': exists.gender, 'residence': exists.residence, 'diasbled': exists.diasbled, 'marital_status': exists.marital_status, 'bpl': exists.bpl, 'employment': exists.employment, 'gemployee': exists.gemployee, 'student': exists.student, 'occupation': exists.occupation, 'prediction': exists.prediction };
   
	
    // Send email if mailoption is true
    if (mailoption) {
      await sendEmail(exists.email, 'Your Schemes', `${JSON.stringify(userData['prediction'])}`);
    }
    
    

    res.status(202).json({ message: 'User found', schemes: `${JSON.stringify(userData['prediction'])}` });
  } catch (error) {
    console.error('Error retrieving user data or sending email:', error);
    res.status(500).json({ error: 'Failed to retrieve user data or send email' });
  }
};




module.exports = { submitFirstTimeForm, furtherCounselling, submitSecondTimeForm, getDropdownData};
