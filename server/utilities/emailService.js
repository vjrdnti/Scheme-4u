const nodemailer = require('nodemailer');
require('dotenv').config();

// Function to send email
const sendEmail = (to, subject, text) => {
 const userForm = JSON.parse(text);
 const userData = JSON.parse(userForm);
  //console.log(userData);
 let flag=0;
 if (userData.map) {
  	flag=1;
  	console.log(flag);
  }
  else{
  	console.log(to);
  	console.log(userData);
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Generate email content based on flag
  const generateEmailContent = (flag, userData) => {
    if (flag === 0) {
      // Generate email with user details and schemes
      return `
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; font-family: Arial, sans-serif;">
          <h1 style="text-align: center; color: #333;">Counseling Details</h1>
          <p><strong>Name:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Phone:</strong> ${userData.phone}</p>
          <p><strong>State:</strong> ${userData.state}</p>
          <p><strong>Caste:</strong> ${userData.caste}</p>
          <p><strong>Minority Status:</strong> ${userData.minority}</p>
          <h2>Available Schemes:</h2>
          ${userData.prediction.map(scheme => `
            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <h3 style="color: #007BFF;">${scheme.name}</h3>
              <p><strong>Details:</strong> ${scheme.details}</p>
              <p><strong>Benefits:</strong> ${scheme.benefits}</p>
              <p><strong>Eligibility:</strong> ${scheme.eligibility}</p>
              <p><strong>Process:</strong> ${scheme.process}</p>
              <p><strong>Documents Required:</strong> ${scheme.documents}</p>
              <p><strong>Resources:</strong> <a href="${scheme.resources[0]}" target="_blank">Resource Link</a></p>
              <p><a href="${scheme.link}" style="display: inline-block; padding: 10px 15px; background-color: #007BFF; color: #fff; border-radius: 4px; text-decoration: none;">Check Eligibility</a></p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (flag === 1) {
      // Generate email with only schemes
      return `
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; font-family: Arial, sans-serif;">
          <h1 style="text-align: center; color: #333;">Available Schemes</h1>
          ${userData.map(scheme => `
            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <h3 style="color: #007BFF;">${scheme.name}</h3>
              <p><strong>Details:</strong> ${scheme.details}</p>
              <p><strong>Benefits:</strong> ${scheme.benefits}</p>
              <p><strong>Eligibility:</strong> ${scheme.eligibility}</p>
              <p><strong>Process:</strong> ${scheme.process}</p>
              <p><strong>Documents Required:</strong> ${scheme.documents}</p>
              <p><strong>Resources:</strong> <a href="${scheme.resources[0]}" target="_blank">Resource Link</a></p>
              <p><a href="${scheme.link}" style="display: inline-block; padding: 10px 15px; background-color: #007BFF; color: #fff; border-radius: 4px; text-decoration: none;">Check Eligibility</a></p>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      throw new Error('Invalid flag value');
    }
  };

  const emailContent = generateEmailContent(flag, userData);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text, // Plain text version
    html: emailContent, // HTML version generated based on flag
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmail;
