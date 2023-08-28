const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// REGISTER CONTROLLER
const register = async (req, res) => {

    try {
        const data = req.body;
        const { name, email, password, wallet } = data;

        if (Object.keys(data).length === 0) {
            return res.status(200).send({ status: false, message: "User all fields are required" })
        }

        if (!name) {
            return res.status(400).send({ status: false, message: "missing username" })
        }
        if (!email) {
            return res.status(400).send({ status: false, message: "missing email" })
        }

        if (!password) {
            return res.status(400).send({ status: false, message: "missing password" })
        }

        // if user email already registered
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({ status: false, message: "email already exists, go to login" })
        }

        // hasing password
        const bcryptedPassword = await bcrypt.hash(password, 10);
        data.password = bcryptedPassword;


        // saving user
        const registerdUser = await userModel.create(data);
        return res.status(201).send({ status: true, message: "registration successfull", data: registerdUser });

    } catch (error) {
        res.status(500).send({ status: false, message: "server error in registration", error })
    }
}


// LOGIN CONTROLLER

const login = async (req, res) => {

    try {
        const data = req.body;
        const { email, password } = data;

        if (!email) {
            return res.status(400).send({ status: false, message: "missing email" })
        }

        if (!password) {
            return res.status(400).send({ status: false, message: "missing password" })
        }

        // checking email exists or not
        const existingUser = await userModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(200).send({ status: false, message: "email not registered, please register " })
        }

        // comparing passwrod
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(200).send({ status: false, message: "email or password invalid" })
        }

        // creating token (not used for authentication)
        const token = jwt.sign({ userId: existingUser._id }, "wallet-dashborad", { expiresIn: "7d" });
        res.setHeader("token", token);
        return res.status(200).send({ status: true, message: "login successfull", user : existingUser, token });

    } catch (error) {
        res.status(500).send({ status: false, message: "server error in login", error })
    }
}

// UPDATE WALLET

const updateWallet = async (req,res) => {
    try {
        const {userId} = req.params
        const {amountToAdd} = req.body;
        const amount = parseInt(amountToAdd)
        if(!amountToAdd){
            return res.status(400).send({ status: false, message: "missing amount to add in wallet" })
        }

        // searching user and adding amount to wallet
        const findUser = await userModel.findById(userId);
        findUser.wallet = findUser.wallet + amount;
        findUser.save();

        return res.status(200).send({status : true, message : "amount added to wallet", availableBalance :findUser.wallet});

    } catch (error) {
        res.status(500).send({ status: false, message: "server error in update wallet", error })   
    }
}

module.exports = { register, login , updateWallet};