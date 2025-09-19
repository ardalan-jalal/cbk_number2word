from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from num2cbk import number2word
import re

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

class NumberRequest(BaseModel):
    number: str

@app.get("/")
def read_index():
    return FileResponse("static/index.html")

@app.post("/convert")
def convert_number(request: NumberRequest):
    try:
        cleaned_number = re.sub(r'[,\s]', '', request.number.strip())
        
        if not cleaned_number.isdigit():
            return {"success": False, "error": "Input must be a valid positive integer"}
        
        num = int(cleaned_number)
        
        if num < 0:
            return {"success": False, "error": "Number must be positive"}
        
        kurdish_words = number2word(num)
        
        if kurdish_words.startswith("Error:"):
            return {"success": False, "error": kurdish_words}
        
        return {"success": True, "kurdish_words": kurdish_words}
        
    except Exception as e:
        return {"success": False, "error": str(e)}