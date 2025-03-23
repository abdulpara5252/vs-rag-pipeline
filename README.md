 File Processing and Embedding Project
This project is designed to process files (PDF, DOCX, XLSX) from a directory, extract their text, divide the text into chunks, generate embeddings using OpenAI, and store the data in a Supabase database. It uses a file watcher to automatically process new files added to the uploaded_files directory.

Features
File Processing: Supports PDF, DOCX, and XLSX files.

Text Extraction: Extracts text from files and divides it into manageable chunks.

Embeddings: Generates embeddings for each text chunk using OpenAI's text-embedding-3-small model.

Database Storage: Stores the text chunks and their embeddings in a Supabase database.

File Watcher: Automatically processes new files added to the uploaded_files directory.

Use Cases
Document Management: Organize and store large documents in a structured way.

Search and Retrieval: Use embeddings for semantic search and retrieval of document chunks.

Knowledge Base: Build a knowledge base by processing and storing documents in a database.

Prerequisites
Before running the project, ensure you have the following:

Node.js: Install Node.js (v16 or higher) from nodejs.org.

Supabase Account: Create a Supabase account and set up a project at supabase.com.

OpenAI API Key: Obtain an API key from OpenAI.

Environment Variables: Create a .env file in the root directory with the following variables:

plaintext
Copy
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
Setup Instructions
1. Clone the Repository
Clone the project repository to your local machine:

bash
Copy
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2. Install Dependencies
Install the required dependencies using npm:

bash
Copy
npm install

3. Run the Project
Start the project to watch the uploaded_files directory for new files:

bash
Copy
node index.js
Usage
Add Files to the Directory:

Place your files (PDF, DOCX, XLSX) in the uploaded_files directory.

The file watcher will automatically detect and process new files.

View Processed Data:

Check your Supabase DocumentChunk table to see the processed text chunks and their embeddings.

Customize Chunk Size:

Modify the chunkSize parameter in the chunkText function (default is 1000 characters).

Project Structure
Copy
your-repo-name/
├── uploaded_files/          # Directory for uploaded files
├── node_modules/            # Installed dependencies
├── .env                     # Environment variables
├── index.js                 # Main application file
├── package.json             # Project dependencies and scripts
├── README.md                # Project documentation
└── .gitignore               # Files and directories to ignore in Git
Environment Variables
Variable Name	Description
OPENAI_API_KEY	Your OpenAI API key.
SUPABASE_URL	Your Supabase project URL.
SUPABASE_KEY	Your Supabase anon/public key.
Dependencies
dotenv: Loads environment variables from a .env file.

pdf-parse: Parses PDF files and extracts text.

mammoth: Extracts text from DOCX files.

xlsx: Parses XLSX files and extracts text.

openai: Interacts with OpenAI's API for embeddings.

@supabase/supabase-js: Interacts with Supabase for database operations.

chokidar: Watches the uploaded_files directory for new files.

