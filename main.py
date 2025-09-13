
import pandas as pd

# Read the Excel files
df = pd.read_excel("data.xlsx", engine="openpyxl")

# Convert to dictionary
my_dict = dict(zip(df["index"], df["respective"]))


def number2word(num):
    """Convert a number into words (supports 10^18)"""

    
    # if num is between 0-19 immediately return the value
    if num >= 0 and num <=19:
        return my_dict[num]

    # if num is between 20 - 99 we need check the reminders (index) as well
    elif num >= 20 and num <= 99:
        ten, ones = divmod(num, 10)
        if ones == 0:
            return my_dict[num]
        else:
            # (و) is the joiner
            return f"{my_dict[ten*10]} و {my_dict[ones]}"

    # if num is between 100-999 
    elif num >= 100 and num <= 999:
        hundreds, reminder = divmod(num, 100)
        # store parts of hundreads
        parts = []

        # Add hundreds part
        if hundreds > 1:
            parts.append(my_dict[hundreds])
        
        parts.append(my_dict[100])  # always add "hundred"
        
        # Add remainder if exists
        if reminder > 0:
            parts.append("و " + number2word(reminder))
        return " ".join(parts)
    
    # 1000 and above: dynamically use my_dict keys
    # Get all keys > 100, sort descending
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

input = int(input("enter number: "))
print(f"{input}:\t {number2word(input)}")
