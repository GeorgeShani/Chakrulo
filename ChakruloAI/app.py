import os
import streamlit as st
from langchain_ollama import ChatOllama
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import UnstructuredURLLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.summarize import load_summarize_chain
from typing import List

# --- 1. CONFIGURATION ---
# List of your 33 scientific paper URLs
DOCUMENT_URLS = [
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4152162/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6753329/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6615562/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9576569/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6057834/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6339989/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8260663/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8099722/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166911/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12031868/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5460236/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5460236/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5672023/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166968/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7190111/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10926278/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4135744/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166968/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166967/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6981245/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6339989/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3066201/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166911/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10138634/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6165321/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6753329/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4136787/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3166430/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5515520/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10712242/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4964660/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5955502/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4379453/",
]
# Path to persistently store the vector database
VECTOR_DB_PATH = "./chakrulo_ai_chroma_db_local"


# --- 2. RAG HELPER FUNCTIONS ---
@st.cache_resource
def setup_rag_pipeline():
    """Initializes and caches the RAG components (Load, Split, Embed, Store)."""

    st.write("### Setting up Chakrulo AI Knowledge Base...")

    # Check if Vector Store exists
    if os.path.exists(VECTOR_DB_PATH):
        st.write("Loading existing Chroma DB...")
        # Use local embeddings (no internet required)
        embedding_function = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        vectorstore = Chroma(persist_directory=VECTOR_DB_PATH, embedding_function=embedding_function)
    else:
        st.write("Loading 33 documents from URLs...")
        # A. LOAD: Use UnstructuredURLLoader for robust scientific paper loading
        loader = UnstructuredURLLoader(urls=DOCUMENT_URLS)
        documents = loader.load()
        st.write(f"Loaded {len(documents)} documents.")
        st.write("Splitting documents into chunks...")
        # B. SPLIT: Use RecursiveCharacterTextSplitter
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ".", " ", ""]
        )
        texts = text_splitter.split_documents(documents)
        st.write(f"Split into {len(texts)} chunks.")
        st.write("Creating embeddings locally (this may take a few minutes on first run)...")
        # C. EMBED & STORE: Use LOCAL HuggingFace embeddings (no API calls)
        embedding_function = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        vectorstore = Chroma.from_documents(
            documents=texts,
            embedding=embedding_function,
            persist_directory=VECTOR_DB_PATH
        )
        st.write("Vector Store created and saved.")

    # D. RETRIEVER: Create a retriever from the vector store
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    # E. LLM: Initialize the Chat Model with Ollama (fully local)
    llm = ChatOllama(
        model="llama3.2",
        temperature=0.1
    )
    # F. RAG Chain: Standard setup for Q&A and Understandings
    system_prompt_template = (
        "You are Chakrulo AI, an expert scientific research assistant. "
        "Your task is to provide accurate, evidence-based answers *ONLY* based on the "
        "CONTEXT provided below from the scientific documents. "
        "If the context does not contain the answer, state clearly: 'I cannot find the relevant information in the current document set.'\n\n"
        "CONTEXT: {context}"
    )
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt_template),
            ("human", "{input}"),
        ]
    )

    # Use create_stuff_documents_chain for combining retrieved documents
    combine_docs_chain = create_stuff_documents_chain(llm, prompt)
    # Create the full retrieval chain
    retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)

    # G. Summarization Chain (Map-Reduce) - for large documents
    summary_chain = load_summarize_chain(llm, chain_type="map_reduce", verbose=True)
    return retrieval_chain, summary_chain, vectorstore, llm


def generate_understanding(retrieval_chain, question: str) -> str:
    """Generates an answer (understanding) using the RAG chain."""
    response = retrieval_chain.invoke({"input": question})
    return response["answer"]


def generate_summary(summary_chain, vectorstore, query: str) -> str:
    """Generates a summary using the Map-Reduce chain."""
    st.info("Generating summary using Map-Reduce. This may take longer.")

    # Retrieve relevant documents for the query
    relevant_docs = vectorstore.as_retriever(search_kwargs={"k": 10}).invoke(query)

    if not relevant_docs:
        return "Could not retrieve documents relevant to the summary query."
    # Map-Reduce takes a list of Documents
    return summary_chain.invoke(relevant_docs)["output_text"]


def generate_recommendation(retrieval_chain, question: str) -> str:
    """Generates scientific recommendations using a specialized prompt."""

    # Augment the RAG question to force a recommendation output
    recommendation_query = (
        f"Based on the knowledge found regarding the topic: '{question}', synthesize and provide three specific, "
        "numbered, and evidence-based recommendations for future research, space mission design, or countermeasure development. "
        "Start your response with 'Recommendations:'."
    )

    # The standard RAG chain will now execute with the recommendation-focused prompt
    response = retrieval_chain.invoke({"input": recommendation_query})
    return response["answer"]


# --- 3. STREAMLIT APP INTERFACE ---
def main():
    """Streamlit application entry point."""
    st.set_page_config(page_title="Chakrulo AI", layout="wide")

    # Streamlit sidebar for control
    with st.sidebar:
        st.title("Chakrulo AI")
        st.header("Select Function")
        # Dropdown to select the mode
        mode = st.selectbox(
            "Choose AI Mode:",
            ("Scientific Understanding", "Scientific Summary", "Scientific Recommendation"),
            index=0,
            help="Select the type of output you need from the documents."
        )
        st.markdown("---")
        st.subheader("Knowledge Base")
        st.write(f"33 documents indexed and ready.")
        st.info("Running 100% offline with Ollama + Local Embeddings")
        st.button("Clear Chat History", on_click=lambda: st.session_state.update(messages=[]))
    # --- Initial Setup ---
    try:
        if 'retrieval_chain' not in st.session_state:
            retrieval_chain, summary_chain, vectorstore, llm = setup_rag_pipeline()
            st.session_state.retrieval_chain = retrieval_chain
            st.session_state.summary_chain = summary_chain
            st.session_state.vectorstore = vectorstore
            st.session_state.llm = llm
    except Exception as e:
        st.error(f"Failed to initialize Chakrulo AI. Make sure Ollama is running. Error: {e}")
        st.info("Run: ollama serve")
        return
    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []
    # Display chat messages from history on app rerun
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    # Accept user input
    if prompt := st.chat_input(f"Ask for a {mode.lower()}..."):
        # Display user message in chat message container
        with st.chat_message("user"):
            st.markdown(prompt)
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("assistant"):
            with st.spinner(f"Generating {mode.lower()}..."):
                try:
                    if mode == "Scientific Understanding":
                        response = generate_understanding(st.session_state.retrieval_chain, prompt)
                    elif mode == "Scientific Summary":
                        # For summary, the user's prompt is used as a filter/topic
                        response = generate_summary(st.session_state.summary_chain, st.session_state.vectorstore,
                                                    prompt)
                    elif mode == "Scientific Recommendation":
                        response = generate_recommendation(st.session_state.retrieval_chain, prompt)
                    else:
                        response = "Invalid mode selected."
                except Exception as e:
                    response = f"Error generating response: {str(e)}\n\nMake sure Ollama is running (ollama serve)."

            st.markdown(response)
            st.session_state.messages.append({"role": "assistant", "content": response})


if __name__ == "__main__":
    main()
