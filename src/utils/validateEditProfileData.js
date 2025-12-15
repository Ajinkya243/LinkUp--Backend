const validateEditProfileData = (req) => {
    const { email } = req.body;
    if (email) return false; // Block changing email

    const allowedEditFields = ["firstName", "lastName", "age", "skills"];
    const isAllowed = Object.keys(req.body).every(el => allowedEditFields.includes(el));
    return isAllowed;
};

module.exports = { validateEditProfileData };