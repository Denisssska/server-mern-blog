import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User from "../models/User.js";

/*   register User*/

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        })
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
};
export const login = async (req,res)=>{
    try{
const{email,password} = req.body;
const user = await User.findOne({email});
if(!user) return res.status(400).json({msg:"User does not exist. "});
const isMatch = await bcrypt.compare(password,user.password)
    }catch (e) {
        res.status(500).json({error: e.message})
    }
}
