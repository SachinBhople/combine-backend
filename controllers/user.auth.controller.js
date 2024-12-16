const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/User")



exports.registerUser = async (req, res) => {
    try {
        const {name, email, password } = req.body

 const found = await User.findOne({ email })
    if (found) {
        return res.status(401).json({ message:  "User Email already Registered" })
    }

        const hashPass = await bcrypt.hash(password, 10)
        // console.log(hashPass)
        await User.create({ ...req.body, password: hashPass })
        res.json({ message: "User Register Success" })
    } catch (error) {
        res.status(500).json({
            message: error.message || "something wents wrong"
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verify email
        const result = await User.findOne({ email });
        if (!result) {
            return res.status(401).json({ message: "INVALID EMAIL" });
        }

        // Verify password
        const varify = await bcrypt.compare(password, result.password);
        if (!varify) {
            return res.status(401).json({ message: "INVALID PASSWORD" });
        }


        const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1h" });

        res.cookie("user", token, {
            httpOnly: true,         
            secure: false, 
            maxAge: 840000000,    
        });


        // console.log("Cookies:", JSON.stringify(req.cookies.user));


        res.json({
            message: "User Login Success",
            result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong"
        });
    }
}
exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie("auth")
        res.status(200).json({ message: "User Logout Success" })
    } catch (error) {
        res.status(500).json({
            message: error.message || "something wents wrong"
        })
    }
}