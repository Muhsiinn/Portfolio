

## The Story

The Klinikum Report Editor was created to help manage mental health data in a more organized and visual way. I built this tool to track daily wellness metrics, medication dosages, and emotional states over time. The goal was to create a simple yet powerful interface that could help visualize patterns in mental health data and make it easier to share comprehensive reports with healthcare providers.

## How it Works

The application is built with Flask and provides a complete CRUD interface for managing health report data. All data is stored locally in CSV format, ensuring complete privacy and data ownership.

The system features a customizable field management system - users can add, remove, or modify tracked metrics through a web interface. When you add new numeric fields, they automatically appear in the graphing system without requiring any code changes.

The visualization engine generates multiple chart types including trend lines, correlation matrices, and comparative analyses. The PDF export feature compiles all graphs and notes into a professional report that can be easily shared with healthcare providers.

The frontend is designed to be clean and responsive, with smooth animations and a gradient background that creates a calming user experience. The interface automatically adjusts to different screen sizes for mobile accessibility.

## Features

- **Data Management**: View, add, edit, and delete entries with full validation
- **Interactive Visualizations**: 9+ chart types including mood trends, medication tracking, sleep patterns, and correlation matrices
- **Customizable Fields**: Add or remove tracked metrics through the web interface
- **PDF Export**: Generate comprehensive reports with graphs and notes
- **Auto-save**: Changes automatically persist to CSV file
- **Privacy-First**: All data stored locally with no external connections

## Technologies Used

- **Backend:** Python, Flask
- **Data Processing:** Pandas, NumPy
- **Visualization:** Matplotlib
- **PDF Generation:** ReportLab
- **Frontend:** HTML, CSS, JavaScript
- **Data Storage:** CSV files

## Code Snippets

Here's the core field management system that allows dynamic field configuration:

```python
def load_fields_config():
    if os.path.exists(FIELDS_CONFIG_FILE):
        with open(FIELDS_CONFIG_FILE, 'r') as f:
            return json.load(f)
    return get_default_fields_config()

def save_fields_config(config):
    with open(FIELDS_CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)
```

And the automatic graph generation for custom numeric fields:

```python
# Automatically detect and graph custom numeric fields
numeric_fields = [field for field in fields_config
                  if field['type'] == 'number'
                  and field['name'] not in default_fields]

for field in numeric_fields:
    plt.figure(figsize=(10, 5))
    plt.plot(df['date'], df[field['name']], marker='o')
    plt.title(f"{field['label']} Over Time")
    plt.xticks(rotation=45)
    plt.tight_layout()
```
