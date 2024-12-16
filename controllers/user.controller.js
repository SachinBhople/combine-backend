const asyncHandler = require("express-async-handler")
const Order = require("../models/Order")
const User = require("../models/User")
const Address = require("../models/Address")
const Cart = require("../models/Cart")
const { default: mongoose } = require("mongoose")


exports.userGetAllOrders = asyncHandler(async (req, res) => {
    const result = await Order
        .find({ user: req.params.id })
        .sort({ createdAt: -1 })
        .populate("products.product")
    res.json({ message: "Order fetch success", result })
})

exports.userGetOrderDetails = asyncHandler(async (req, res) => {
    const result = await Order.findById(req.params.id)
    res.json({ message: "Order Details fetch success", result })
})
exports.userUpdatePassword = asyncHandler(async (req, res) => {

    res.json({ message: "password update success" })
})
exports.userPlaceOrder = asyncHandler(async (req, res) => {
    await Order.create(req.body)
    res.json({ message: "order place success" })
})
exports.userCancelOrder = asyncHandler(async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: "cancel" })
    res.json({ message: "order cancel success" })
})


exports.addCart = asyncHandler(async (req, res) => {
    const { pId, uId } = req.body;
    // console.log(req.body);

    let result = await Cart.findOne({ userId: uId, productId: pId });

    if (result) {
        await Cart.findByIdAndUpdate(
            result._id,
            { $inc: { quantity: 1 } }
        );
    } else {
        await Cart.create({ userId: uId, productId: pId, quantity: 1 })
    }

    res.json({ message: 'Cart Add successfully' });
});

exports.getAllCartItems = asyncHandler(async (req, res) => {
    const { uid } = req.params;

    if (!uid || !mongoose.Types.ObjectId.isValid(uid)) {
        return res.status(400).json({ message: 'Invalid or missing User ID' });
    }

    try {
        const result = await Cart.find({ userId: uid }).populate("productId");

        if (result.length === 0) {
            return res.status(404).json({ message: 'No cart items found for this user' });
        }

        res.status(200).json({ message: 'Cart Items Get Success', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});





exports.deleteItemFromCart = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Cart.findByIdAndDelete(id)
    res.json({ message: "Cart Iterm Delete Success" })
})


exports.deleteAllCart = asyncHandler(async (req, res) => {
    const { userId } = req.params
    await Cart.deleteMany({ userId });


    res.status(200).json({ message: "All cart items deleted successfully" });
})

exports.addAddress = asyncHandler(async (req, res) => {
    const {
        userId,
        email,
        pincode,
        city,
        state,
        country,
        addressType,
        mobile,
        address,
        firstname,
        lastName
    } = req.body;




    let user = await User.findById(userId);
    // console.log(user);

    if (!user) {
        return res.status(505).json({ message: "user not found" })
    }

    if (!user.email) {
        const updated = await User.findByIdAndUpdate(userId, { email })
        console.log("updated", updated);

    }
    await Address.create({
        city,
        state,
        pincode,
        country,
        addressType,
        mobile,
        address,
        userId: user._id,
        lastName,
        firstname
    });

    res.json({ message: "Address Created Successfully" });
});

exports.updateAddress = asyncHandler(async (req, res) => {
    // console.log(req.ody);

    const {
        _id,
        email,
        pincode,
        city,
        state,
        country,
        addressType,
        mobile,
        address,
        firstname,
        lastName
    } = req.body;


    let existingAddress = await Address.findById(_id);

    if (!existingAddress) {
        return res.status(404).json({ message: "Address not found" });
    }

    let user = await User.findById(existingAddress.userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // If email is provided and the user's email is empty, update the email
    if (email && !user.email) {
        user.email = email;
        await user.save();
    }

    // Update the address fields
    existingAddress.city = city;
    existingAddress.state = state;
    existingAddress.pincode = pincode;
    existingAddress.country = country;
    existingAddress.addressType = addressType;
    existingAddress.mobile = mobile;
    existingAddress.address = address;
    existingAddress.firstname = firstname;
    existingAddress.lastName = lastName;

    // Save the updated address
    await existingAddress.save();

    res.json({ message: "Address Updated Successfully", updatedAddress: existingAddress });
});



exports.getAddresses = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await Address.find({ userId: id })

    res.json({ message: "All Addresses Fetch Success", result })
})

exports.deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params
    await UserAddress.findByIdAndDelete(addressId)
    res.json({ message: "Address Delete Success" })
})

exports.getReutnRequestedOrder = asyncHandler(async (req, res) => {
    const result = await Order.find({ returnRequested: true }).sort({ createdAt: -1 }).populate("user", { password: 0, active: 0, createdAt: 0, updatedAt: 0, __v: 0 }).populate("products.product")
    res.json({ message: "Reutn Requested Order Fetch Success", result })
})
exports.ReutnRequestedOrderUpdate = asyncHandler(async (req, res) => {
    const { ReturnOrderID } = req.params
    const result = await Order.findByIdAndUpdate(ReturnOrderID, { returnAccepted: true })
    res.json({ message: "Reutn  Order Updated Success", result })
})


