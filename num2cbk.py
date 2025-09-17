
import pandas as pd

# Read the Excel files
df = pd.read_excel("data.xlsx", engine="openpyxl")

# Convert to dictionary
my_dict = dict(zip(df["index"], df["respective"]))


MAX_VALUE = 1_000_000_000_000_000_000  # 10^18

def number2word(num):
    """Convert a number into words (supports up to 10^18)"""
    
    if num > MAX_VALUE:
        return f"Error: Maximum allowed number is {MAX_VALUE:,}"  # show with commas

    if num >= 0 and num <=19:
        return my_dict[num]

    elif num >= 20 and num <= 99:
        ten, ones = divmod(num, 10)
        if ones == 0:
            return my_dict[num]
        else:
            return f"{my_dict[ten*10]} و {my_dict[ones]}"

    elif num >= 100 and num <= 999:
        hundreds, reminder = divmod(num, 100)
        parts = []
        if hundreds > 1:
            parts.append(my_dict[hundreds])
        parts.append(my_dict[100])
        if reminder > 0:
            parts.append("و " + number2word(reminder))
        return " ".join(parts)
    
    # 1000 and above
    big_units = sorted([i for i in my_dict if i > 100], reverse=True)
    for unit in big_units:
        if num >= unit:
            count, remainder = divmod(num, unit)
            parts = []
            if count > 1:
                parts.append(number2word(count))
            parts.append(my_dict[unit])
            if remainder:
                parts.append("و " + number2word(remainder))
            return " ".join(parts)
