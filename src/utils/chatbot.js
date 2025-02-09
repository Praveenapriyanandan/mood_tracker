// Example with OpenAI
export const generateBotResponse = async (userMessage) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AIzaSyD5VcbKofY0CRZlKYj1LHUnKw7ND47mQFU}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a supportive friend helping someone with their emotional well-being."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });
  
    const data = await response.json();
    return data.choices[0].message.content;
  };