import requests

API_KEY = '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'
API_URL = 'https://openrouter.ai/api/v1/chat/completions'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Define initial behavior with a system message
conversation_history = [
    {
        "role": "system",
        "content": (
            f"This conversation is part of an health app and the user was given a weekly exercise and meal plan routine. You are a friendly assistant who offers support on topics related to exercise and nutrition. "
            f"Remember you are not a professional so refer the user to the eating disorder hotline (1-888-375-7767) if they show severe symptoms of an eating disorder "
        )
    }

]

#print("Starting conversation with friendly assistant! Type 'quit' to exit.")

while True:
    user_input = input("You: ")
    
    if user_input.lower() == 'quit':
        print("Exiting conversation...")
        break
    
    conversation_history.append({"role": "user", "content": user_input})
    
    data = {
        "model": "deepseek/deepseek-chat:free",
        "messages": conversation_history
    }
    
    response = requests.post(API_URL, json=data, headers=headers)
    
    if response.status_code == 200:
        reply = response.json()['choices'][0]['message']['content']
        print("Kiwi:", reply)
        conversation_history.append({"role": "assistant", "content": reply})
    else:
        print("Error:", response.status_code, response.text)