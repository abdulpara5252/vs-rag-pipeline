require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');
const chokidar = require('chokidar'); // Library to watch file system changes

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Function to read file from local system
async function readFileFromLocal(filePath) {
    try {
        const data = await fs.readFile(filePath);
        return data;
    } catch (error) {
        console.error('Error reading file from local path:', error);
        throw error;
    }
}

// Function to parse PDF and extract text
async function parsePdf(pdfBuffer) {
    try {
        const data = await pdfParse(pdfBuffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw error;
    }
}

// Function to parse DOC/DOCX and extract text
async function parseDocx(docxBuffer) {
    try {
        const result = await mammoth.extractRawText({ buffer: docxBuffer });
        return result.value; // Extracted text
    } catch (error) {
        console.error('Error parsing DOCX:', error);
        throw error;
    }
}

// Function to parse XLS/XLSX and extract text
async function parseXlsx(xlsxBuffer) {
    try {
        const workbook = xlsx.read(xlsxBuffer, { type: 'buffer' });
        let text = '';
        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            text += xlsx.utils.sheet_to_csv(sheet); // Convert sheet to CSV text
        });
        return text;
    } catch (error) {
        console.error('Error parsing XLSX:', error);
        throw error;
    }
}

// Function to parse file based on its type
async function parseFile(fileBuffer, filePath) {
    const extension = path.extname(filePath).toLowerCase();

    switch (extension) {
        case '.pdf':
            return await parsePdf(fileBuffer);
        case '.docx':
        case '.doc':
            return await parseDocx(fileBuffer);
        case '.xlsx':
        case '.xls':
            return await parseXlsx(fileBuffer);
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
}

// Function to divide text into chunks
function chunkText(text, chunkSize = 1000) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}

// Function to get embeddings from OpenAI
async function getEmbeddings(text) {
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error getting embeddings from OpenAI:', error);
        throw error;
    }
}

// Function to insert data into Supabase
async function insertIntoSupabase(content, embedding, fileName, knowledgeBaseId) {
    try {
        const { data, error } = await supabase
            .from('DocumentChunk')
            .insert([{ content, embedding, file_name: fileName, knowledgeBaseId, created_at: new Date() }]);

        if (error) {
            console.error('Error inserting into Supabase:', error);
            throw error;
        }

        console.log('Inserted into Supabase:', data);
    } catch (error) {
        console.error('Supabase insertion failed:', error);
        throw error;
    }
}

// Main function to process the file
async function processFile(filePath, knowledgeBaseId) {
    try {
        // Extract the file name from the file path
        const fileName = path.basename(filePath); // Extracts the file name from the path

        // Step 1: Read file from local system
        const fileBuffer = await readFileFromLocal(filePath);

        // Step 2: Parse file and extract text
        const text = await parseFile(fileBuffer, filePath);

        // Step 3: Divide text into chunks
        const chunks = chunkText(text);

        // Debug: Log the number of chunks created
        console.log(`Number of chunks created: ${chunks.length}`);

        // Step 4: Get embeddings for each chunk and insert into Supabase
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            console.log(`Processing chunk ${i + 1} of ${chunks.length}`);

            // Get embeddings for the chunk
            const embedding = await getEmbeddings(chunk);

            // Insert the chunk into Supabase
            await insertIntoSupabase(chunk, embedding, fileName, knowledgeBaseId); // Pass the knowledgeBaseId
        }

        console.log('File processing completed successfully.');
    } catch (error) {
        console.error('Error processing file:', error);
    }
}

// Watch the `uploaded_files` directory for new files
const watchDirectory = './uploaded_files'; // Directory to watch
const knowledgeBaseId = 2; // Replace with the actual knowledgeBaseId

const watcher = chokidar.watch(watchDirectory, {
    persistent: true,
    ignoreInitial: true, // Ignore files already in the directory
});

// Event listener for when a new file is added
watcher.on('add', async (filePath) => {
    console.log(`New file detected: ${filePath}`);
    await processFile(filePath, knowledgeBaseId);
});

// Event listener for errors
watcher.on('error', (error) => {
    console.error('Error watching directory:', error);
});

console.log(`Watching directory for new files: ${watchDirectory}`);