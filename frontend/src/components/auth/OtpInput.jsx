import React, { useRef, useState } from "react";

const OtpInput = ({ name = "otp" }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        // Only take the last character if multiple characters are pasted/entered
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // If a number is entered, move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        // Update hidden input with complete OTP value
        const hiddenInput = document.querySelector(`input[name="${name}"]`);
        if (hiddenInput) {
            hiddenInput.value = newOtp.join("");
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
            // Clear current input
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").substring(0, 6);
        const newOtp = [...otp];

        for (let i = 0; i < pastedData.length && i < 6; i++) {
            if (!isNaN(pastedData[i])) {
                newOtp[i] = pastedData[i];
                if (inputRefs.current[i]) {
                    inputRefs.current[i].value = pastedData[i];
                }
            }
        }

        setOtp(newOtp);
        
        // Update hidden input
        const hiddenInput = document.querySelector(`input[name="${name}"]`);
        if (hiddenInput) {
            hiddenInput.value = newOtp.join("");
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-2xl text-center border-2 rounded-lg focus:border-black focus:outline-none"
                        maxLength={1}
                    />
                ))}
            </div>
            {/* Hidden input to store complete OTP value */}
            <input type="hidden" name={name} />
        </div>
    );
};

export default OtpInput;