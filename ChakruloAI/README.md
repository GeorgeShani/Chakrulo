# Chakrulo AI

A fully offline, RAG-powered scientific research assistant that provides evidence-based answers from 33 space medicine research papers. Built with Streamlit, LangChain, Ollama, and ChromaDB.

## Overview

Chakrulo AI is an intelligent chatbot that helps researchers, students, and space enthusiasts explore scientific literature about space medicine, astronaut health, and space mission preparation. The system runs entirely locally without requiring API keys or internet connectivity after initial setup.

## Features

- **100% Offline Operation**: No API keys, no cloud services, complete data privacy
- **Three AI Modes**:
  - **Scientific Understanding**: Q&A with evidence-based answers
  - **Scientific Summary**: Comprehensive summaries using Map-Reduce
  - **Scientific Recommendation**: Actionable recommendations for research and missions
- **Persistent Vector Database**: One-time document processing, instant retrieval thereafter
- **33 Research Papers**: Curated collection from NCBI/PMC on space medicine
- **Chat History**: Conversation memory within the session
- **Source Attribution**: Answers grounded in actual document content

## Technology Stack

- **Streamlit**: Interactive web interface
- **LangChain**: RAG pipeline orchestration
- **Ollama**: Local LLM inference (llama3.2)
- **ChromaDB**: Vector database for document embeddings
- **HuggingFace Transformers**: Local sentence embeddings (all-MiniLM-L6-v2)
- **UnstructuredURLLoader**: Robust document ingestion from web URLs

## Prerequisites

### System Requirements

- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: ~5GB for models and vector database
- **CPU**: Multi-core processor recommended
- **OS**: macOS, Linux, or Windows with WSL

### Software Dependencies

```bash
# Python 3.8 or higher
python3 --version

# Ollama installed and configured
ollama --version 3.2
```

## Installation

### Step 1: Install Ollama

Visit [ollama.ai](https://ollama.ai) and install for your platform.

Download the llama3.2 model:

```bash
ollama pull llama3.2
```

Verify installation:

```bash
ollama list
```

### Step 2: Clone Repository

```bash
git clone https://github.com/GeorgeShani/ChakruloAI.git
cd chatbot
```

### Step 3: Install Python Dependencies

```bash
pip install streamlit
pip install langchain langchain-community langchain-ollama
pip install chromadb
pip install sentence-transformers
pip install unstructured
pip install "unstructured[html]"  # For HTML parsing
```

Or use requirements file:

```bash
pip install -r requirements.txt
```

### Step 4: Verify File Structure

Ensure your project has:

```
chatbot/
├── app.py                          # Main Streamlit application
├── requirements.txt                # Python dependencies
└── chakrulo_ai_chroma_db_local/    # Created on first run
```

## Usage

### Starting the Application

**Terminal 1**: Start Ollama server

```bash
ollama serve
```

**Terminal 2**: Launch Streamlit app

```bash
cd /path/to/chatbot
streamlit run app.py
```

The app will open in your browser at `http://localhost:8501`

### First Run: Database Creation

On first launch, the system will:

1. Load all 33 documents from URLs (~2-3 minutes)
2. Split documents into chunks
3. Generate embeddings locally (~5-10 minutes)
4. Save vector database to disk

**Important**: Keep Ollama running during this process.

Subsequent runs load the existing database instantly.

### Using the Chatbot

#### 1. Scientific Understanding Mode

Ask specific questions about the research:

**Example queries**:
- What are the main cardiovascular effects of microgravity?
- How does radiation affect astronaut health?
- What countermeasures exist for bone density loss?
- Explain the psychological challenges of long-duration missions

**Expected behavior**:
- Direct answers from document content
- If information isn't found, clearly states this
- Cites relevant context from papers

#### 2. Scientific Summary Mode

Request comprehensive summaries on topics:

**Example queries**:
- Summarize all findings about muscle atrophy in space
- Overview of sleep disturbances during spaceflight
- Summary of nutrition requirements for Mars missions

**Expected behavior**:
- Uses Map-Reduce to process multiple documents
- Takes longer to generate (30-60 seconds)
- Provides a synthesized overview

#### 3. Scientific Recommendation Mode

Get actionable recommendations:

**Example queries**:
- What research gaps exist in space radiation protection?
- Recommend countermeasures for mental health in isolation
- Suggest training protocols for future Mars missions

**Expected behavior**:
- Generates 3 numbered recommendations
- Evidence-based suggestions
- Focuses on research directions or practical applications

### Chat Interface Features

**Sidebar Controls**:
- Mode selection dropdown
- Knowledge base status
- Clear chat history button

**Main Chat**:
- Natural conversation flow
- Message history preserved in session
- Streaming responses with loading indicator

## Configuration

### Modifying Document Sources

Edit `DOCUMENT_URLS` in `app.py`:

```python
DOCUMENT_URLS = [
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4152162/",
    # Add your URLs here
]
```

After changing URLs, delete the vector database folder to force recreation:

```bash
rm -rf chakrulo_ai_chroma_db_local
```

### Adjusting LLM Parameters

Modify the LLM initialization:

```python
llm = ChatOllama(
    model="llama3.2",
    temperature=0.1,  # Lower = more focused, higher = more creative
    # num_ctx=4096,   # Context window size
    # num_predict=512 # Max tokens in response
)
```

### Retrieval Settings

Change number of retrieved documents:

```python
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
```

Higher k = more context, slower responses

### Text Chunking

Adjust chunk parameters for different document types:

```python
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=2000,      # Characters per chunk
    chunk_overlap=200,    # Overlap between chunks
    separators=["\n\n", "\n", ".", " ", ""]
)
```

## Troubleshooting

### Issue: "Connection refused" to Ollama

**Cause**: Ollama server not running

**Solution**:

```bash
ollama serve
```

Keep this terminal open while using the app.

### Issue: Slow response times

**Causes and Solutions**:
- First run embedding generation - Normal, wait for completion
- Insufficient RAM - Close other applications
- Large context retrieval - Reduce `search_kwargs["k"]`
- Model too large - Try a smaller model:

```bash
ollama pull llama3.2:1b
```

### Issue: "Cannot find relevant information"

**Causes**:
- Question outside document scope
- Poor embedding quality
- Documents not loaded properly

**Solutions**:
- Verify documents loaded: Check terminal output on first run
- Rephrase query with keywords from the papers
- Try Summary mode for broader topics

### Issue: Vector database errors

**Solution**: Delete and recreate:

```bash
rm -rf chakrulo_ai_chroma_db_local
streamlit run app.py
```

### Issue: Import errors

**Solution**: Install missing dependencies:

```bash
pip install --upgrade langchain langchain-community
pip install unstructured[html]
```

## Performance Optimization

### Speed Improvements

Use smaller models:

```bash
ollama pull llama3.2:1b  # Faster, less accurate
```

Reduce retrieval count:

```python
search_kwargs={"k": 3}  # Default is 5
```

Increase RAM allocation to Ollama:

```bash
# In Ollama Modelfile
PARAMETER num_thread 8
```

### Accuracy Improvements

Use larger models:

```bash
ollama pull llama3.1:8b
```

Increase context:

```python
search_kwargs={"k": 10}
```

Adjust temperature:

```python
temperature=0.0  # More deterministic
```

## Advanced Features

### Adding Custom Prompts

Modify system prompts in `app.py`:

```python
system_prompt_template = (
    "You are [Custom Role]. "
    "Your expertise includes [Domain]. "
    "Provide answers that are [Style].\n\n"
    "CONTEXT: {context}"
)
```

### Integrating Local PDFs

Replace URL loader with directory loader:

```python
from langchain_community.document_loaders import DirectoryLoader

loader = DirectoryLoader(
    "./research_papers/",
    glob="**/*.pdf",
    loader_cls=UnstructuredPDFLoader
)
documents = loader.load()
```

### Adding Memory Across Sessions

Implement persistent chat history:

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()
# Save to disk after each conversation
# Load on app startup
```

### API Integration

To use the chatbot logic in other applications:

```python
from app import setup_rag_pipeline, generate_understanding

# Initialize once
retrieval_chain, _, _, _ = setup_rag_pipeline()

# Generate answers
answer = generate_understanding(retrieval_chain, "Your question here")
print(answer)
```

## Project Structure

```
chatbot/
├── app.py                              # Main Streamlit application
├── requirements.txt                    # Python dependencies
├── chakrulo_ai_chroma_db_local/        # Vector database (auto-generated)
│   ├── chroma.sqlite3
│   ├── *.parquet
│   └── ...
└── README.md                           # This file
```

## Document Collection

The system indexes 33 research papers covering:

- Cardiovascular effects of spaceflight
- Musculoskeletal adaptations
- Radiation exposure and countermeasures
- Psychological challenges
- Nutrition and metabolism
- Sleep and circadian rhythms
- Vestibular and sensorimotor changes
- Immune system function

All papers sourced from PubMed Central (PMC).

## Limitations

- **Language**: English only
- **Knowledge cutoff**: Papers published before the collection date
- **Scope**: Limited to indexed documents
- **Hallucination risk**: May generate plausible but incorrect information if documents don't contain the answer
- **No real-time data**: Cannot access updated research without reindexing

## Best Practices

- Keep Ollama running in a separate terminal
- Ask specific questions rather than broad topics
- Use Summary mode for overviews
- Verify critical information against original papers
- Clear chat history when changing topics
- Monitor system resources during intensive operations

## Security & Privacy

- **Fully offline**: No data leaves your machine
- **No API keys**: No external service dependencies
- **Local storage**: All data stored on your device
- **Session-based**: Chat history cleared on restart

## Contributing

Contributions welcome! Areas for improvement:

- Additional document sources
- Better prompt engineering
- Performance optimizations
- UI enhancements
- Multi-language support

## Support

- **Issues**: Open a GitHub issue
- **Documentation**: See inline code comments
- **Ollama Docs**: https://ollama.ai/docs
- **LangChain Docs**: https://python.langchain.com

## Acknowledgments

- Research papers from NCBI/PubMed Central
- LangChain framework for RAG implementation
- Ollama for local LLM inference
- HuggingFace for embedding models
- Streamlit for rapid prototyping