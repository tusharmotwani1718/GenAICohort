import express from 'express';
import cors from 'cors';
import {
    chat,
    indexing
} from './src/index.js'
import multer from 'multer';


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))


app.use(express.json());


// setup multer:
// configure storage (optional: customize file name & destination)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/api/indexing/uploadFile', upload.single("file"), async (req, res) => {
    try {
        const fileToUpload = req.file;


        if (!fileToUpload) throw new Error("Please upload a valid file format for indexing.");

        await indexing(req.file?.path, req.file?.originalname);

        // console.log("file uploaded successfully: ", fileToUpload)

        res.json({
            success: true,
            message: "File uploaded and indexed successfully"
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error. See console log of backend app." });
    }
})

app.post('/api/retreival/chat', async (req, res) => {
    try {
        const { fileName, userQuery, inputs } = req.body;

        if(!fileName || !userQuery) {
           return res.json({
                success: false,
                message: "Please provide fileName and userQuery"
            })
        }

        const response = await chat(fileName, userQuery, inputs);

        return res.json({
            success: true,
            message: response
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message ?? "Internal Server Error"
        })
    }
})

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
