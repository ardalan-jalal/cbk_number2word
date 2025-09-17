import tkinter as tk
from num2cbk import number2word

def show_message():
    try:
        user_input = int(entry.get())
        result = number2word(user_input)
        output_text.config(state="normal")       # allow editing to update
        output_text.delete("1.0", tk.END)        # clear previous text
        output_text.insert(tk.END, result)       # insert new result
        output_text.config(state="disabled")     # make it read-only
        output_text.tag_configure("rtl", justify="right")
        output_text.tag_add("rtl", "1.0", "end")
    except ValueError:
        output_text.config(state="normal")
        output_text.delete("1.0", tk.END)
        output_text.insert(tk.END, "تکایە ژمارە بنووسە")  # "Please enter a number"
        output_text.config(state="disabled")
        output_text.tag_configure("rtl", justify="right")
        output_text.tag_add("rtl", "1.0", "end")

# Create main window 
root = tk.Tk()
root.title("گۆڕینی ژمارە بۆ ووشەی سۆرانی")

# Set window size
root.geometry("600x300")

# Input field
entry = tk.Entry(root, width=40, font=("Calibri", 12))
entry.pack(pady=10)

# Submit button
button = tk.Button(root, text="Submit", command=show_message, font=("Calibri", 12))
button.pack(pady=5)

# Output Text widget (copyable and scrollable)
output_frame = tk.Frame(root)
output_frame.pack(pady=10, fill="both", expand=True)

scrollbar = tk.Scrollbar(output_frame)
scrollbar.pack(side="right", fill="y")

output_text = tk.Text(output_frame, height=8, font=("Tahoma", 14), wrap="word", yscrollcommand=scrollbar.set)
output_text.pack(side="left", fill="both", expand=True)
output_text.config(state="disabled")  # read-only
output_text.tag_configure("rtl", justify="right")  # default RTL

scrollbar.config(command=output_text.yview)

# Run the application
root.mainloop()
