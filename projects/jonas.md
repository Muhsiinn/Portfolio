

Meet Jonas, a friendly chatbot designed to be your personal guide to Austrian German and culture. I built Jonas to be more than just a language app; he's a conversational partner who makes learning feel like chatting with a local.

## The Story

The idea for Jonas came from my own experiences learning German in Austria. I wanted to create a tool that could help bridge the gap between textbook German and the way people actually speak. Jonas is designed to be a patient and friendly guide, someone who can not only teach you vocabulary and grammar, but also give you insights into Austrian culture.

## How it Works

Jonas is powered by a customized language model. I started with a base model called `stabilityai/stablelm-2-zephyr-1_6b` and then trained it on a custom dataset of conversations to give it the unique persona of a friendly Austrian German tutor.

To make the conversation more context-aware, I also built a system that allows Jonas to retrieve relevant information from a knowledge base of Austrian-related text. When a user asks a question, this system finds the most relevant information and provides it to the language model, which then generates a more accurate and helpful response.

The backend is a Flask application that serves the model and the retrieval system. It uses a streaming endpoint to send the model's response to the frontend in real-time, which creates a more natural and engaging user experience.

The frontend is a simple and clean chat interface built with HTML, CSS, and JavaScript. It sends user messages to the backend and displays the streaming response from the server.

## Technologies Used

*   **Backend:** Python, Flask
*   **Machine Learning:** PyTorch, Hugging Face Transformers, Sentence-Transformers, FAISS
*   **Frontend:** HTML, CSS, JavaScript

## Code Snippets

Here is a snippet of the code that merges the LoRA adapters:

```python
import torch
import os
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

BASE_MODEL = "./base_model"            # base model path
ADAPTER_1  = "./jonas_adapterv2"       # first LoRA adapter
ADAPTER_2  = "./jonas_adapterv4"       # second LoRA adapter
OUT_DIR    = "./jonas_merged_modelv5"  # output folder
OFFLOAD_DIR = "./offload"

# blending strength
ALPHA_1 = 0  # 70% weight from adapter v2
ALPHA_2 = 1 # 30% weight from adapter v4

os.makedirs(OFFLOAD_DIR, exist_ok=True)

print("Loading base model...")
base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float16,
    device_map="auto",
    offload_folder=OFFLOAD_DIR,
)

print(f"Loading adapter v2 (scale={ALPHA_1})...")
model = PeftModel.from_pretrained(
    base_model,
    ADAPTER_1,
    device_map="auto",
    offload_folder=OFFLOAD_DIR,
)

# scale adapter v2 before merging
for name, param in model.named_parameters():
    if "lora_" in name and param.requires_grad:
        param.data *= ALPHA_1

model = model.merge_and_unload()

print(f"Loading adapter v4 (scale={ALPHA_2})...")
model = PeftModel.from_pretrained(
    model,
    ADAPTER_2,
    device_map="auto",
    offload_folder=OFFLOAD_DIR,
)

# scale adapter v4 before merging
for name, param in model.named_parameters():
    if "lora_" in name and param.requires_grad:
        param.data *= ALPHA_2

model = model.merge_and_unload()

print("Saving merged model...")
model.save_pretrained(OUT_DIR)

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
tokenizer.save_pretrained(OUT_DIR)

print(f"Merge complete. Saved merged model to: {OUT_DIR}")
```

And here is the code for the RAG system:

```python
import faiss, pickle
import numpy as np
from sentence_transformers import SentenceTransformer
import os

INDEX_PATH = "faiss_index/austria.index"
CHUNK_PATH = "faiss_index/chunks.pkl"
EMBED_MODEL = "Embedding_model/all-MiniLM-L6-v2"

# Global cache
_index, _embedder, _chunks = None, None, None

def load_retriever():
    global _index, _embedder, _chunks
    if _index is None:
        print("Loading FAISS index and embedder...")
        _embedder = SentenceTransformer(EMBED_MODEL)
        _index = faiss.read_index(INDEX_PATH)
        with open(CHUNK_PATH, "rb") as f:
            _chunks = pickle.load(f)
    return _index, _embedder, _chunks

def retrieve_context(query, top_k=3):
    index, embedder, chunks = load_retriever()
    query_emb = embedder.encode([query], convert_to_numpy=True)
    D, I = index.search(np.array(query_emb, dtype=np.float32), top_k)
    return "\n".join([chunks[i] for i in I[0]])
```