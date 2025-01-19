const generateForgotPasswordEmail = (resetLink) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 10px;">
            <img src="https://res.cloudinary.com/dkkwuulf9/image/upload/v1737279124/full-logo_vi7kq0.png" alt="Canvas Logo" style="width: 150px; margin-bottom: 20px;" />
            <h2 style="color: #333;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #555;">Forgot your password? No worries! Click the button below to reset it:</p>
            
            <a href="${resetLink}" style="display: inline-block; background-color: #4CAF50; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 18px; border-radius: 5px; margin: 20px 0; font-weight: bold;">Reset Password</a>

            <p style="color: #777; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="word-wrap: break-word; color: #555;">
                <a href="${resetLink}" style="color: #1a73e8;">${resetLink}</a>
            </p>

            <p style="margin-top: 20px; font-size: 14px; color: #999;">If you didn't request a password reset, you can safely ignore this email.</p>

            <p style="margin-top: 20px; font-size: 16px; font-weight: bold; color: #333;">Keep Creating, Keep Inspiring! ✨</p>
        </div>
    `;
};

module.exports = { generateForgotPasswordEmail };
