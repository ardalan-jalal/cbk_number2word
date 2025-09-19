# Kurdish Number to Word Converter

A minimalist web application that converts numbers to Kurdish words. Clean, fast, and efficient.

## Features

- 🔢 Convert numbers to Kurdish words (supports up to 1,000,000,000,000,000,000)
- 🎨 Clean, minimal UI with Kurdish fonts
- 📱 Responsive design
- ⚡ Real-time conversion and validation
- 📋 Copy results with one click
- ⚙️ Minimalist codebase for better performance

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cbk_number2word
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the application:

```bash
python -m uvicorn app:app --reload --port 8000
```

4. Open your browser and navigate to:

```
http://localhost:8000
```

## Usage

1. Enter a number in the input field (supports up to 1 quintillion)
2. Click the "گۆڕین" (Convert) button or press Enter
3. View the Kurdish translation in the result area
4. Click the copy button to copy the result to clipboard

**Maximum supported number:** 1,000,000,000,000,000,000 (1 quintillion)

## API Endpoints

### POST /convert

Convert a number to Kurdish words.

**Request:**

```json
{
  "number": "123"
}
```

**Response:**

```json
{
  "success": true,
  "kurdish_words": "سەد و بیست و سێ"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error message"
}
```

## Technologies Used

- **Backend:** FastAPI, Python
- **Frontend:** HTML5, CSS3, JavaScript (minimalist approach)
- **Fonts:** Noto Sans Arabic
- **Icons:** Font Awesome
- **Data Processing:** Pandas, OpenPyXL

## File Structure

```
cbk_number2word/
├── app.py              # Minimalist FastAPI backend
├── num2cbk.py          # Number to Kurdish word conversion logic
├── data.xlsx           # Kurdish number mappings
├── requirements.txt    # Python dependencies
├── static/
│   ├── index.html     # Clean HTML page
│   ├── style.css      # Minimal styles with Kurdish fonts
│   └── script.js      # Essential JavaScript logic
└── README.md          # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
