// Set value to session
const storeInSession = (key, value) => {
    return sessionStorage.setItem(key, value);
}


// Get value from session
const lookInSession = (key) => {
    return sessionStorage.getItem(key);
}


// remove value from session
const removeFromSession = (key) => {
    return sessionStorage.removeItem(key);
}


// Clear all session values
const logOutUser = () => {
    sessionStorage.clear();
}

export { storeInSession, lookInSession, removeFromSession, logOutUser };