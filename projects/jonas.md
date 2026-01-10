
[Youtube](https://youtu.be/lOE8pAQAz4M)

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
## Use Jonas

ollama run muhsinahmdtk/Jonas