
## The Story

Fine-tuning language models usually means dealing with multiple tools and a lot of manual work - downloading models, preparing datasets, writing training scripts. I wanted something that handled the entire workflow in one place. Forge LLM takes care of everything from processing your documents to testing your fine-tuned model, so you can focus on what you want the model to learn rather than wrestling with infrastructure.

## How it Works

The application has two main parts: a FastAPI backend that handles all the machine learning operations, and a React frontend that makes the whole process easy to use.

When you upload a PDF, the backend uses Docling to extract the text and structure. Then it automatically generates question-answer pairs from your content - this becomes your training dataset. You don't need to manually label data or write examples.

For the actual fine-tuning, I implemented LoRA (Low-Rank Adaptation), which is a parameter-efficient technique. Instead of updating all the model weights, LoRA adds small trainable layers that modify the model's behavior. This means you can customize models on regular hardware without needing enterprise-grade GPUs.

Once training is done, you can test your model directly in the app to see how it performs on your specific domain before putting it to use.

## Technologies Used

*   **Backend:** FastAPI, Python
*   **Machine Learning:** Hugging Face Transformers, PEFT (LoRA), Docling
*   **Frontend:** React, TypeScript
*   **Model Management:** Hugging Face Hub integration

## Key Features

*   Upload PDFs and automatically generate training data
*   Download and manage models from Hugging Face
*   Fine-tune using LoRA for efficient customization
*   Test models with inference endpoints
*   Full-stack interface that brings everything together
