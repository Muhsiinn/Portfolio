
[Youtube](https://youtu.be/4T2OyjqdU_A)

## The Story

Access to information shouldn't depend on an internet connection. I built this Offline Wiki to provide a complete, searchable knowledge base that works entirely offline. Using a compressed Wikipedia/Wikivoyage database (ZIM format), this project gives you instant access to thousands of articles about European destinations, all stored locally and searchable through an intelligent Q&A interface.

## How it Works

The Offline Wiki is powered by a Retrieval-Augmented Generation (RAG) system that combines semantic search with a local language model. When you ask a question, the system searches through the Wikipedia content to find the most relevant information, then uses a lightweight AI model running locally via Ollama to generate a natural, conversational answer.

The core of the system is a FAISS vector database that indexes all the Wikipedia content. Text is chunked into manageable pieces, converted into semantic embeddings using Sentence Transformers, and stored in a fast, searchable index. When a query comes in, the system finds the most similar chunks using cosine similarity, then feeds that context to the language model.

The entire system runs locally with no internet connection required. The backend is a Flask application that streams responses in real-time, creating a smooth, chat-like experience. All models and data are cached in memory for instant responses.

## Technologies Used

*   **Backend:** Python, Flask
*   **Machine Learning:** Sentence Transformers, FAISS, Ollama (TinyLlama)
*   **Data:** Wikipedia/Wikivoyage ZIM files
*   **Vector Database:** FAISS (Facebook AI Similarity Search)

## Code Snippets

Here is the code for loading and caching the embedding model offline:

```python
def get_local_embedder():
    """Load embedding model once into memory (offline)."""
    global _GLOBAL_EMBEDDER
    if _GLOBAL_EMBEDDER is not None:
        return _GLOBAL_EMBEDDER

    model_path = LOCAL_MODEL_PATH
    word_embedding_model = models.Transformer(model_path)
    pooling_model = models.Pooling(word_embedding_model.get_word_embedding_dimension())

    normalize_path = os.path.join(model_path, "2_Normalize")
    if os.path.exists(normalize_path):
        normalize_model = models.Normalize()
        _GLOBAL_EMBEDDER = SentenceTransformer(
            modules=[word_embedding_model, pooling_model, normalize_model]
        )
    else:
        _GLOBAL_EMBEDDER = SentenceTransformer(
            modules=[word_embedding_model, pooling_model]
        )

    print(f"[INFO] Model loaded once into RAM from {model_path}")
    return _GLOBAL_EMBEDDER
```

And here is the retrieval system that finds relevant chunks using FAISS:

```python
def retrieve(query: str, k: int = 4) -> list[str]:
    """Retrieve top-k relevant text chunks."""
    index, chunks = get_faiss_index()
    model = get_local_embedder()

    q = np.array(model.encode([query]), dtype="float32")
    D, I = index.search(q, k)
    return [chunks[i] for i in I[0] if 0 <= i < len(chunks)]
```

The streaming answer generation combines retrieval with Ollama:

```python
def answer_question(question: str, k: int = 4, max_context_chars: int = 4000, stream=False):
    ensure_index()
    hits = retrieve(question, k=k)
    context = "\n\n".join(h[:max_context_chars] for h in hits)

    if len(context.strip()) < 200:
        yield "Information not found in local data."
        return

    system = (
        "You are an offline Austrian wiki assistant. "
        "Answer ONLY using the provided context. "
        "If the context does not contain enough information, respond exactly with: "
        "'Information not found in local data.' "
        "Be concise and factual."
    )
    prompt = f"{system}\n\nContext:\n{context}\n\nQuestion: {question}\nAnswer:"

    import ollama
    if stream:
        for chunk in ollama.generate(model=OLLAMA_MODEL, prompt=prompt, stream=True):
            yield chunk.get("response", "")
    else:
        out = ollama.generate(model=OLLAMA_MODEL, prompt=prompt)
        yield out["response"]
```
