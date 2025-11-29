

## Overview

A production-ready web application that provides personalized outdoor activity recommendations based on real-time weather data, air quality, and your calendar schedule. This intelligent assistant helps you decide whether to go outside by analyzing current conditions and your availability, powered by OpenWeatherMap API and local LLM via Ollama.

## Key Features

- **Real-Time Weather Integration**: Fetches current weather conditions and air quality data using OpenWeatherMap API
- **Google Calendar Integration**: Checks your schedule to provide recommendations based on your availability
- **AI-Powered Recommendations**: Uses local LLM (Mistral 7B via Ollama) to generate personalized outdoor activity suggestions
- **Clean Web Interface**: Modern, responsive web UI for easy interaction
- **RESTful API**: Well-structured API endpoints for programmatic access
- **Production-Ready Architecture**: Clean code structure with proper error handling, logging, and configuration management

## Technical Stack

- **Python 3.8+**: Core programming language
- **Flask**: Web framework for API and web interface
- **OpenWeatherMap API**: Real-time weather and air quality data
- **Google Calendar API**: Schedule integration via OAuth 2.0
- **Ollama**: Local LLM deployment for AI recommendations
- **Mistral 7B**: Language model for personalized suggestions
- **Docker**: Containerization for easy deployment

## Architecture

The project follows a modular, production-ready architecture:

```
├── app.py              # Flask web application
├── main.py             # CLI interface
├── config.py           # Configuration management
├── weather.py          # Weather API integration
├── my_calendar.py      # Google Calendar integration
├── llm_service.py      # LLM service integration
├── templates/          # Web interface templates
└── static/             # CSS and JavaScript assets
```

## How It Works

1. **User Input**: User asks a question like "Should I go for a run?"
2. **Data Collection**: Fetches current weather, air quality, and calendar events
3. **AI Processing**: Local LLM analyzes all data to provide personalized recommendation
4. **Response Generation**: Returns detailed recommendation with reasoning
5. **Web/API Display**: Shows results via clean web interface or API response

## Use Cases

- Planning outdoor activities based on weather conditions
- Deciding whether to walk, bike, or take transit
- Checking if it's a good time for outdoor exercise
- Getting activity suggestions based on current conditions
- Coordinating outdoor plans with your calendar schedule

## Privacy & Security

- All AI processing happens locally via Ollama (no data sent to external LLM services)
- Secure OAuth 2.0 authentication for Google Calendar
- Environment-based configuration for sensitive data
- API keys properly managed through .env files

## Configuration Options

All settings managed through environment variables:
- OpenWeatherMap API integration
- Ollama model selection (default: Mistral 7B)
- Default city and country settings
- Flask server configuration
- Custom timeout and debug settings

## Deployment Options

- **Development**: Simple Flask server for local testing
- **Production**: Gunicorn WSGI server with multiple workers
- **Docker**: Full containerization with docker-compose support
- **CLI Mode**: Command-line interface for terminal users

## Links

- [GitHub Repository](https://github.com/Muhsiinn/should_you_go_outside)

## Technologies Used

Python | Flask | OpenWeatherMap API | Google Calendar API | Ollama | Mistral 7B | OAuth 2.0 | Docker | REST API
