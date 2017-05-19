def csplit(string):
    delimiter = ", "
    stack = [string]
    for char in delimiter:
        pieces = []
        for substr in stack:
            pieces.extend(substr.split(char))
        stack = pieces
        
    if(stack[0] == 'def'):
        del stack[0];
    return stack

def lsplit(block):
    delimiter = ";"
    
    stack = [block]
    
    pieces = []
    for substr in stack:
        pieces.extend(substr.split(delimiter))
    stack = pieces
    
    del stack[-1];
    
    return stack

string = input("enter:");
string = lsplit(string);
print(string)
print(csplit(string[0]))
