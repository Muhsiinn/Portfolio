## Overview

A Python-based Gmail automation tool that leverages local LLMs via Ollama to intelligently summarize emails and generate automated reply drafts. This project combines the Gmail API with AI capabilities to streamline email management and boost productivity.

## Key Features

- **Smart Email Fetching**: Automatically retrieves emails from Gmail's primary inbox
- **AI-Powered Summarization**: Uses Ollama with Mistral 7B to generate concise email summaries
- **Automated Reply Generation**: Creates contextually relevant reply drafts using AI
- **Content Cleaning**: Removes links and cleans email content for better processing
- **Draft Management**: Creates Gmail drafts ready for review before sending

## Technical Stack

- **Python 3.x**: Core programming language
- **Gmail API**: Email access and manipulation via OAuth 2.0
- **Ollama**: Local LLM deployment for AI capabilities
- **Mistral 7B**: Language model for summarization and reply generation
- **Google Cloud APIs**: Authentication and API access

## Architecture

The project follows a modular architecture with distinct components:

```text
|- auth/         # Gmail API authentication module
|- reader/       # Email fetching and content extraction
|- cleaner/      # Email content cleaning utilities
|- summarizer/   # Email summarization with Ollama
|- reply/        # Automated reply generation
|- main.py       # Email summarization script
`- main_reply.py # Automatic reply generation script
```

## How It Works

1. **Authentication**: Securely authenticates with Gmail using OAuth 2.0
2. **Fetching**: Retrieves recent emails from the primary inbox
3. **Processing**: Cleans and prepares email content for AI processing
4. **Summarization**: Sends email content to local Ollama instance for summarization
5. **Reply Generation**: Creates contextually appropriate reply drafts
6. **Draft Creation**: Saves generated replies as Gmail drafts for review

## Use Cases

- Managing high email volume efficiently
- Quick overview of multiple emails at once
- Generating starting points for email replies
- Reducing time spent on routine email responses
- Maintaining email productivity while traveling

## Privacy and Security

- All AI processing happens locally via Ollama (no data sent to external servers)
- Uses secure OAuth 2.0 authentication
- Credentials stored securely with proper token management
- Generates drafts for review (not auto-sending)

## Future Enhancements

- Support for multiple email labels/folders
- Customizable reply templates based on email context
- Email priority classification
- Scheduled summarization reports
- Integration with other email providers

## Links

- [GitHub](https://github.com/Muhsiinn/Gmail-LLM-Assistant)

## Technologies Used

Python | Gmail API | Ollama | Mistral 7B | OAuth 2.0 | Google Cloud Platform
