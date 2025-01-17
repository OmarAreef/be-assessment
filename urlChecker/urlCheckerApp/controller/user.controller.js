const userService = require('../service/user.service');
const catchAsync = require('../utils/catchAsync');

exports.register =catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const resultUser = await userService.register(email, password);
    return res.json(resultUser)

})

exports.verify = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await userService.verify(id);
    return res.json({"message" : "Email verified successfully, you can now login"})
})

exports.login = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const tokenResult = await userService.login(email, password);
    // set cookie with refresh token
    res.cookie('accessToken', tokenResult.accessToken, {
        httpOnly: true,
    });
    
    return res.json("Login successful")
})