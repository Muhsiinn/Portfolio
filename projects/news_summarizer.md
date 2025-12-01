

## Overview

An intelligent RSS news aggregator that automatically fetches Austrian news articles from ORF.at, scrapes the full content, and uses local AI to translate and summarize German articles into concise English summaries. This project demonstrates the power of combining web scraping with local LLM capabilities for multilingual news consumption.

## Key Features

- **RSS Feed Parsing**: Automatically fetches articles from ORF.at news RSS feed
- **Web Scraping**: Extracts full article content from news websites using BeautifulSoup
- **AI-Powered Translation & Summarization**: Uses Ollama with Mistral 7B to translate German articles and generate neutral, factual summaries in English
- **Local Processing**: All AI operations run locally via Ollama (no external API calls)
- **Batch Processing**: Handles multiple articles efficiently in one run

## Technical Stack

- **Python 3.x**: Core programming language
- **feedparser**: RSS feed parsing library
- **BeautifulSoup4**: HTML parsing and web scraping
- **requests**: HTTP library for fetching web content
- **Ollama**: Local LLM deployment framework
- **Mistral 7B**: Language model for translation and summarization

## Architecture

The project follows a clean, modular design:

```
├── helpers.py      # Core functionality (fetch, scrape, summarize)
├── main.py         # Main execution script
├── model_conf.py   # Ollama model configuration
└── translate.py    # Translation utilities
```

## How It Works

1. **Feed Parsing**: Fetches the latest articles from ORF.at RSS feed
2. **Content Extraction**: Scrapes each article's full text from the source URL
3. **AI Processing**: Sends German text to local Ollama instance
4. **Translation & Summarization**: Mistral 7B translates and creates neutral, factual English summaries
5. **Output**: Displays summarized news in English for easy consumption

## Use Cases

- Staying informed about Austrian news without language barriers
- Quickly scanning multiple German news articles in English
- Research projects requiring Austrian news monitoring
- Language learners comparing original German with English summaries
- International readers interested in Austrian current events

## Privacy & Security

- All processing happens locally via Ollama (no data sent to external servers)
- No API keys or external services required
- Complete control over news source and data flow

## Future Enhancements

- Support for multiple RSS feeds and news sources
- Sentiment analysis of news articles
- Topic categorization and filtering
- Daily/weekly digest generation
- Export summaries to email or markdown reports
- Multi-language support beyond German-English

## Links

- GitHub: Coming soon

## Technologies Used

Python | feedparser | BeautifulSoup4 | requests | Ollama | Mistral 7B | RSS | Web Scraping
