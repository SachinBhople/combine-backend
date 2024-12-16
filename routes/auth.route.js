const router = require("express").Router()

const authController = require("./../controllers/auth.controller")
const userAuthController = require("./../controllers/user.auth.controller")


router
    .post("/registerAdmin", authController.registerAdmin)
    .post("/loginAdmin", authController.loginAdmin)
    .post("/logoutAdmin", authController.logout)
    .post("/customer-register", authController.registerUser)
    .post("/customer-login", authController.loginUser)
    .post("/login", userAuthController.loginUser)
    .post("/logout", userAuthController.logoutUser)
    .post("/register", userAuthController.registerUser)







module.exports = router