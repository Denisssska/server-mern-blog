import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from "helmet";
import morgan from 'morgan';
import path from "path";
import {fileURLToPath} from 'url';
import {register} from './controllers/auth.js';
import {createPost} from './controllers/posts.js';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import {verifyToken} from "./middleware/auth.js";
import {users, posts} from "./data/index.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

// configurations

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('common'));

app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors());
app.use('/assets', express.static(path.join(__fileName, 'public/assets')))

/* fileStorage*/

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/assets')
    },
    filename(req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload = multer({storage});

app.post('/auth/register', upload.single("picture"), register)
app.post('/posts', verifyToken, upload.single("picture"), createPost)
app.get('/', (req, res) => res.send('Hello World!'))

/*routes*/

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);


const PORT = process.env.PORT || 3001;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_DB_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`Server port: ${PORT} successfully`)
        /*add data one time*/
        User.insertMany(users);
        Post.insertMany(posts);
    });
}).catch((e) => console.log(`${e} did not connect`));