# 🏷️ Labels Manager

This project is for managing labels using FastAPI, SQLite, and a simple web interface. It allows you to:

✅ Create new labels  
✅ Edit and delete existing ones  
✅ Upload labels from a JSON file  
✅ Switch between light and dark themes

---
## 🐳 Run with Docker

If you have Docker installed:
```bash
docker build -t labels-manager .
docker run -d -p 8000:8000 labels-manager
```
The server will be available at: [http://localhost:8000](http://localhost:8000)

🗂️ Project Structure
```
.
├── main.py            # Main FastAPI server file
├── requirements.txt   # Python dependencies
├── Dockerfile         # For building Docker image
├── test.json          # Sample JSON file with labels
└── app
    └── static
        ├── index.html  # Web interface
        ├── script.js   # Logic for interacting with the API
        ├── style.css   # Styling (light/dark theme)
```

## 📦 API

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| GET    | `/`                  | Serves the main page (index.html) |
| GET    | `/labels`            | Get all labels                    |
| POST   | `/labels`            | Create a new label                |
| PUT    | `/labels/{label_id}` | Update an existing label          |
| DELETE | `/labels/{label_id}` | Delete a label                    |
## 🧪 Load Sample Labels

In the interface, click the “Load JSON” button and select the `test.json` file to quickly load some test data.

✏️ Sample JSON Structure
```
[
  { "name": "Кошка", "confidence": "0.95" },
  { "name": "Собака", "confidence": "0.89" },
  { "name": "Автомобиль", "confidence": "0.92" }
]
```

## 🌟 Features
- Lightweight API built with FastAPI.
- SQLite — built-in database, no extra setup.
- Simple, intuitive interface (HTML/JS/CSS).
- Docker support for deployment.

⚡ Screenshots

![s1](screenshots/screenshot1.png)
![s1](screenshots/screenshot2.png)
![s1](screenshots/screenshot3.png)
