const User = require("../model/User");
const bcrypt = require("bcrypt");


const signup = async (req, res) => {
    try {

        let { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, msg: "Send all fields" });
        }
        const existingEmail = await User.findOne({
            email: { $regex: `^${email}$`, $options: "i" },
        });



        if (existingEmail) {
            return res.status(409).json({
                success: false,
                msg: "User with this email already exists.",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const securepassword = await bcrypt.hash(password, salt);
        await User.create({
            email: email,
            password: securepassword,
        });
        return res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, msg: "Internal server error" });
    }
};
module.exports = signup;
