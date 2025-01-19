const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateEmailTemplate = (otp) => {
    return `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
            <div style="margin-bottom: 20px;">
                <img src="https://res.cloudinary.com/dkkwuulf9/image/upload/v1737279124/full-logo_vi7kq0.png" alt="Your Blog App" style="max-width: 150px;">
            </div>
            <h2 style="color: #333;">Email Verification</h2>
            <p style="font-size: 16px; color: #555;">Use the OTP below to verify your email and **start your journey with Canvas!</p>
            <h1 style="color: #ff9800; font-size: 40px; letter-spacing: 2px; margin: 20px 0;">${otp}</h1>
            <p style="font-size: 14px; color: #777;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
            <div style="margin-top: 30px; font-size: 14px; color: #999;">
                <p>If you didn’t request this, please ignore this email.</p>
                <p>Keep Creating, Keep Inspiring! ✍️</p>
            </div>
        </div>
    `;
};

module.exports = { generateOTP, generateEmailTemplate };
