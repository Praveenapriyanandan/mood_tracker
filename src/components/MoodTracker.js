import React, { useState } from 'react';
import './MoodTracker.css';

const MoodTracker = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentMood, setCurrentMood] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const moods = {
    mood_swings: { emoji: "😕", label: "Mood Swings" },
    irritated: { emoji: "😠", label: "Irritated" },
    sad: { emoji: "😢", label: "Sad" },
    anxious: { emoji: "😟", label: "Anxious" },
    depressed: { emoji: "😞", label: "Depressed" },
    guilty: { emoji: "😔", label: "Guilty" },
    stressed: { emoji: "😖", label: "Stressed" },
    angry: { emoji: "😡", label: "Angry" }
  };

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    const initialMessage = {
      type: 'bot',
      content: `I see you're feeling ${moods[mood].label.toLowerCase()}. Would you like to talk about it? I'm here to listen and help.`
    };
    setMessages([initialMessage]);
    setShowChat(true);
  };

  const generateBotResponseGemini = async (userMessage) => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Act as a friend who hears about the mood and give only two suggestion on beginning    ${moods[currentMood]?.label}, 
                     and respond to the following message understanding user's replies: ${userMessage}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;

    } catch (error) {
      console.error('Error getting bot response:', error);
      return "I apologize, but I'm having trouble connecting right now. Could you please try again?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Using Gemini API for generating bot response
      const botResponse = await generateBotResponseGemini(inputMessage);

      setMessages(prev => [...prev, {
        type: 'bot',
        content: botResponse
      }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I'm having trouble responding right now. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="mood-tracker">
      {!showChat ? (
        <div className="mood-selector">
          <h2>How are you feeling today?</h2>
          <div className="mood-grid">
            {Object.entries(moods).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleMoodSelect(key)}
                className="mood-button"
              >
                <div className="mood-emoji">{value.emoji}</div>
                <div className="mood-label">{value.label}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <button 
              onClick={() => setShowChat(false)}
              className="back-button"
            >
              ←
            </button>
            <span>Chat Support</span>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.type}-message`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="message-input"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className={`send-button ${isLoading ? 'disabled' : ''}`}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
