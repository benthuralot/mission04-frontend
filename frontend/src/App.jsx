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

  const formatMessage = (message) => {
    if (message.sender === 'ai') {
      return (
        <div className="message ai">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      );
    }
    return <div className={`message ${message.sender}`}>{message.text}</div>;
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
          placeholder="Type your response..."
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
