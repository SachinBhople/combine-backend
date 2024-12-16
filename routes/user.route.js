const router = require("express").Router()
const { userProtected } = require("../middleware/userProtected")
const userController = require("./../controllers/user.controller")

router
    .get("/order/:id", userController.userGetAllOrders)
    .get("/order-details/:id", userController.userGetOrderDetails)
    .post("/place-order", userController.userPlaceOrder)
    .put("/order-cancel/:id", userController.userCancelOrder)
    .post("/update-password", userController.userUpdatePassword)
    .delete("/delete-address/:addressId", userController.deleteAddress)
    .get("/get-address/:id", userController.getAddresses)
    .post("/add-address", userController.addAddress)
    .post("/update-address", userController.updateAddress)


    .post("/add-product", userController.addCart)
    .delete("/delete-product/:id", userController.deleteItemFromCart)
    .delete("/delete-all-product/:userId", userController.deleteAllCart)
    .get("/get-all-product/:uid", userController.getAllCartItems)

module.exports = router