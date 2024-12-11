import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const startConversation = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/tina/start');
        setMessages([{ sender: 'ai', text: response.data }]);
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
    };

    startConversation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('http://localhost:4000/api/tina/next', { message: input });
      const aiMessage = { sender: 'ai', text: response.data };
      setMessages([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    }

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatMessage = (message) => {
    return (
      <div className={`message ${message.sender}`}>
        <div className="message-content">
          {message.sender === 'ai' ? (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          ) : (
            message.text
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index}>
            {formatMessage(msg)}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your response..."
          className="input-textarea"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;