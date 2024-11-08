const UserForm = require('../models/Users');
const sendEmail = require('../utilities/emailService');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const schemeDataPath = path.join(__dirname, '../data/filters_and_slugs.json');
const mainDataPath = path.join(__dirname, '../data/main.json');

const jsonData = JSON.parse(fs.readFileSync(schemeDataPath, 'utf8'));
const mainData = JSON.parse(fs.readFileSync(mainDataPath, 'utf8'));

const arr = ['wbtisswcec', 'wbtiswed', 'wbtiswfflcm', 'wicohppdjkbocwwb', 'ahst', 'ahstc-dc', 'atihcdohs', 'aipbo-faascdmf', 'aewc-mesifai-vi', 'aipps-mesifai-vi', 'ata-mesifa-cii', 'cis-mesifa-cii'];



//console.log(mainData['slug'].length);
let ans_arr = []

//console.log(Object.keys(mainData));

for(let i=0; i<Object.keys(mainData['slug']).length; i++){
	if( arr.includes(mainData['slug'][i]) ) {
	let ans = {'name': mainData['Scheme Name'][i],  'link': mainData['link'][i], 'details': mainData['details'][i],
				'benefits': mainData['benefits'][i], 'eligibility': mainData['eligibility'][i], 'process': mainData['process'][i],
				'documents': mainData['document-list'][i], 'resources': mainData['resources'][i]
			  };
	ans_arr.push(ans);
	console.log(ans['name']);
	}
}
