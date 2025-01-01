import React, { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <div className="relative w-[100%] mb-4">
            <input
                type={type == 'password' ? (passwordVisible ? 'text' : 'password') : type}
                name={name}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                className="input-box"
            />

            {/* Input Icon */}
            <i className={`fi fi-rr-${icon} input-icon`}></i>


            {/* Eye icon for password */}
            {type == 'password' ? <i className={`fi fi-rr-eye${!passwordVisible ? '-crossed' : ''} input-icon left-[auto] right-5 cursor-pointer`} onClick={() => setPasswordVisible(!passwordVisible)}></i> : ""}
        </div>
    );
};

export default InputBox;
