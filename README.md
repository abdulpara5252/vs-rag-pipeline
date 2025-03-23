# 📄 AI Document Processor

This Node.js project automates the extraction, chunking, embedding, and storage of content from uploaded documents using OpenAI and Supabase. It supports **PDF**, **DOCX**, and **XLSX** file formats and watches a local folder for new uploads to process them in real-time.

---

## ✨ Features

- 📂 **Automatic File Watching** – Uses `chokidar` to monitor an `uploaded_files` directory for new files.
- 📑 **Multi-Format Support** – Parses `.pdf`, `.docx`, `.xlsx`, and `.xls` files.
- 🔍 **Text Chunking** – Splits large document texts into manageable 1000-character chunks.
- 🧠 **OpenAI Embeddings** – Generates vector embeddings using `text-embedding-3-small`.
- ☁️ **Supabase Integration** – Stores chunks, embeddings, metadata in a `DocumentChunk` table.

---

## 🛠 Tech Stack

- **Node.js**
- **OpenAI API**
- **Supabase**
- **Chokidar**
- **Mammoth.js** (for DOCX)
- **pdf-parse**
- **xlsx**

---

## 📁 Folder Structure
📦project-root ┣ 📂uploaded_files # Folder being watched for new uploads ┣ 📜index.js # Main script ┣ 📜.env # Environment variables ┗ 📜README.md # Project documentation


---

## 🔧 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/abdulpara5252/vs-rag-pipeline.git
cd vs-rag-pipeline

npm install

## Configure Environment Variables

Create a .env file in the root with the following:
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_key

Run the Application
node index.js


## 🧪Example Use Case 
Drop a file (e.g., report.pdf) into the uploaded_files folder.

The app:

Extracts and chunks the text.

Generates embeddings via OpenAI.

Uploads content and metadata to Supabase.







