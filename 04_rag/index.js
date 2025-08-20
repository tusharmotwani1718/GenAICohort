import express from 'express';
import cors from 'cors';
import {
    chat,
    indexing,
    indexTextContext,
    indexUrlContext
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

/**
 * ✍️ Index raw text as context
 */
app.post("/api/indexing/text", async (req, res) => {
    try {
        const { text, textName } = req.body;

        const result = await indexTextContext(text, textName);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ?? "Internal server error.",
        });
    }
});


/**
 * 🌐 Index webpage content from a URL
 */
app.post("/api/indexing/url", async (req, res) => {
    try {
        const { url, urlName } = req.body;

        const result = await indexUrlContext(url, urlName);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message ?? "Internal server error.",
        });
    }
});

app.post('/api/retreival/chat', async (req, res) => {
    try {
        const { fileName, userQuery, inputs } = req.body;

        if (!fileName || !userQuery) {
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
