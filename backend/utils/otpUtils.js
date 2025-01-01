const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateEmailTemplate = (otp) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Email Verification</h2>
            <p>Your OTP for email verification is:</p>
            <h1 style="color: #4CAF50; font-size: 40px; letter-spacing: 2px;">${otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
        </div>
    `;
};

module.exports = { generateOTP, generateEmailTemplate };