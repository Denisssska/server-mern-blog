import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from "helmet";
import morgan from 'morgan';
import path from "path";
import {fileURLToPath} from 'url';

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

const PORT = process.env.PORT || 6001;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(PORT, () => console.log(`Server port: ${PORT} successfully`));
}).catch((e) => console.log(`${e} did not connect`));