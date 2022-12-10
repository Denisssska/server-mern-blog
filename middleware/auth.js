import * as jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Authorisation");
        if (!token) return res.status(403).json('Asses Denied');
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
            // token = token.slice(7,token.length).trimStart();
        }
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (e) {
        res.status(500).json({error: e.message})
    }

}