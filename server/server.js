require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const formRoutes = require('./routes/formRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/form', formRoutes); 
app.get('/', (req, res) => {
    res.send('API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => console.log(err));


// CSV Schema
const Dataset = mongoose.model('Dataset', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    data: {
        type: Array,  // Array to store CSV data
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    }
}));

app.post('/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const datasetName = req.body.name;
    const chunkSize = 10 * 1024 * 1024;
    
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded!' });
    }

    const fileSize = fs.statSync(file.path).size; //file size
    const filePath = file.path;
    const fileName = file.originalname.split('.')[0]; //original file name without extension


    const saveToMongoDB = async (data, part) => {
        try {
            const dataset = new Dataset({
                name: `${datasetName}${part ? `_part_${part}` : ''}`,  
                data: data                                             
            });
            await dataset.save();
            console.log(`Saved dataset ${part ? `_part_${part}` : ''} to MongoDB`);
        } catch (error) {
            console.error(`Error saving dataset ${part ? `_part_${part}` : ''} to MongoDB:`, error);
        }
    };


    if (fileSize <= chunkSize) {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', async () => {
                await saveToMongoDB(results);  // Save entire file to MongoDB
                res.status(201).json({ message: 'File uploaded and saved successfully' });
            })
            .on('error', (error) => {
                console.error('Error parsing file:', error);
                res.status(500).json({ error: 'Failed to parse file' });
            });

    } else {

        let chunkCount = 0;
        const readStream = fs.createReadStream(filePath, { highWaterMark: chunkSize });

        readStream.on('data', (chunk) => {
            chunkCount++;
            const chunkFileName = `${fileName}_part_${chunkCount}.csv`;
            const chunkPath = `uploads/${chunkFileName}`;
            

            fs.writeFileSync(chunkPath, chunk);
            console.log(`Chunk ${chunkCount} saved: ${chunkFileName}`);


            const chunkResults = []; 
            fs.createReadStream(chunkPath)
                .pipe(csvParser())
                .on('data', (data) => {
                    chunkResults.push(data);
                })
                .on('end', async () => {
                    await saveToMongoDB(chunkResults, chunkCount); 
                })
                .on('error', (error) => {
                    console.error(`Error parsing chunk ${chunkCount}:`, error);
                });
        });

        readStream.on('end', () => {
            console.log(`File has been split into ${chunkCount} parts and saved separately.`);
            res.status(201).json({ message: `File uploaded, split into ${chunkCount} parts, and saved successfully.` });
        });

        readStream.on('error', (error) => {
            console.error('Error while reading file:', error);
            res.status(500).json({ error: 'Error during file splitting' });
        });
    }
});


app.get('/api/datasets', async (req, res) => {
    const datasets = await Dataset.find();
    res.json(datasets);
});

app.get('/api/datasets/:id/unique/:column', async (req, res) => {
    const { id, column } = req.params;
    const dataset = await Dataset.findById(id);
    const uniqueValues = [...new Set(dataset.data.map(row => row[column]))];
    res.json(uniqueValues);
});


