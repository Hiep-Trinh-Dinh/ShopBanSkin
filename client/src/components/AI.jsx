import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const AIChatComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Xin chào. \nTôi có thể giúp gì cho bạn?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  // API Constants (from your script.js)
  const API_KEY = "AIzaSyDQ3uSLNra5YRjaBVeK0inwRQv8mA78FkM";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ 
        top: chatBodyRef.current.scrollHeight, 
        behavior: "smooth" 
      });
    }
  }, [messages]);

  // Generate bot response
  const generateBotResponse = async (userMessage, fileData = null) => {
    setIsTyping(true);
    
    const requestBody = {
      contents: [{
        parts:[
          { text: userMessage },
          ...(fileData ? [{ inline_data: fileData }] : [])
        ]
      }]
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if(!response.ok) throw new Error(data.error.message);

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1").trim();
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: apiResponseText 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: error.message,
        error: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = inputMessage.trim();
    if (!message && !selectedFile) return;

    // Prepare file data if any
    let fileData = null;
    if (selectedFile) {
      fileData = {
        data: selectedFile.data,
        mime_type: selectedFile.type
      };
    }

    // Add user message to chat
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: message,
      attachment: selectedFile ? selectedFile.preview : null
    }]);

    // Clear input and file
    setInputMessage('');
    setSelectedFile(null);

    // Generate bot response
    setTimeout(() => {
      generateBotResponse(message, fileData);
    }, 600);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result.split(",")[1];
      setSelectedFile({
        preview: e.target.result,
        data: base64String,
        type: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  // Cancel file selection
  const handleCancelFile = () => {
    setSelectedFile(null);
  };

  // Handle emoji selection (placeholder - would need emoji-mart in your dependencies)
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div>
      {/* Chat Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-[#5350C4] rounded-full p-3 cursor-pointer shadow-lg hover:bg-[#3d39ac] transition-colors z-50"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0');
      `}</style>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[420px] bg-white rounded-[15px] shadow-xl overflow-hidden z-50">
          {/* Chat Header */}
          <div className="flex items-center bg-[#5350C4] p-[15px_22px] justify-between">
            <div className="flex gap-[10px] items-center">
              <svg className="h-[35px] w-[35px] p-[6px] fill-[#5350C4] flex-shrink-0 bg-white rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
              </svg>
              <h2 className="text-white text-[1.31rem] font-[600]">Chatbot</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="border-none text-white h-[40px] w-[40px] text-[1.9rem] -mr-[10px] pt-[2px] cursor-pointer rounded-full bg-transparent hover:bg-[#3d39ac] transition-[0.2s]"
            >
              <span className="material-symbols-rounded">keyboard_arrow_down</span>
            </button>
          </div>

          {/* Chat Body */}
          <div 
            ref={chatBodyRef}
            className="p-[25px_22px] flex gap-[20px] h-[460px] mb-[82px] overflow-y-auto flex-col"
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex gap-[11px] items-center ${message.type === 'user' ? 'flex-col items-end' : ''}`}
              >
                {message.type === 'bot' && (
                  <svg className="h-[35px] w-[35px] p-[6px] fill-white flex-shrink-0 mb-[2px] self-end bg-[#5350C4] rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                  </svg>
                )}
                <div 
                  className={`p-[12px_16px] max-w-[75%] text-[0.95rem] whitespace-pre-line ${
                    message.type === 'bot' 
                      ? 'bg-[#F2F2FF] rounded-[13px_13px_13px_3px]' + (message.error ? ' text-red-500' : '')
                      : 'text-white bg-[#5350C4] rounded-[13px_13px_3px_13px]'
                  }`}
                >
                  {message.content}
                </div>
                {message.attachment && (
                  <img 
                    src={message.attachment} 
                    alt="attachment" 
                    className="w-1/2 -mt-[7px] rounded-[13px_3px_13px_13px]" 
                  />
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-[11px] items-center">
                <svg className="h-[35px] w-[35px] p-[6px] fill-white flex-shrink-0 mb-[2px] self-end bg-[#5350C4] rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                  <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
                <div className="p-[12px_16px] max-w-[75%] text-[0.95rem] bg-[#F2F2FF] rounded-[13px_13px_13px_3px]">
                  <div className="flex gap-[4px] py-[15px]">
                    <div className="h-[7px] w-[7px] opacity-70 rounded-[50px] bg-[#6F6BC2] animate-[dotPulse_1.8s_ease-in-out_infinite_0.2s]"></div>
                    <div className="h-[7px] w-[7px] opacity-70 rounded-[50px] bg-[#6F6BC2] animate-[dotPulse_1.8s_ease-in-out_infinite_0.3s]"></div>
                    <div className="h-[7px] w-[7px] opacity-70 rounded-[50px] bg-[#6F6BC2] animate-[dotPulse_1.8s_ease-in-out_infinite_0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Footer */}
          <div className="absolute bottom-0 w-full bg-white p-[15px_22px_20px]">
            <form 
              onSubmit={handleSendMessage}
              className="flex relative items-center bg-white rounded-[32px] outline-[1px] outline-[#CCCCE5] focus-within:outline-[2px] focus-within:outline-[#5350C4]"
            >
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message..."
                className="border-none p-[14px_0_13px_18px] h-[47px] w-full resize-none text-[0.95rem] rounded-[inherit] outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              
              <div className="flex h-[47px] gap-[3px] items-center self-end pr-[6px]">
                <button 
                  type="button"
                  onClick={toggleEmojiPicker}
                  className="h-[35px] w-[35px] border-none cursor-pointer text-[#706DB0] bg-transparent rounded-full hover:bg-[#f1f1ff] transition-[0.2s]"
                >
                  <span className="material-symbols-rounded">sentiment_satisfied</span>
                </button>
                
                <div className="h-[35px] w-[35px] relative">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  
                  {selectedFile && (
                    <img 
                      src={selectedFile.preview} 
                      alt="Preview" 
                      className="absolute w-full h-full object-cover rounded-full" 
                    />
                  )}
                  
                  {!selectedFile ? (
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute h-[35px] w-[35px] border-none cursor-pointer text-[#706DB0] bg-transparent rounded-full hover:bg-[#f1f1ff] transition-[0.2s]"
                    >
                      <span className="material-symbols-rounded">attach_file</span>
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleCancelFile}
                      className="absolute h-[35px] w-[35px] border-none cursor-pointer text-red-500 bg-white rounded-full hover:bg-[#f1f1ff] transition-[0.2s]"
                    >
                      <span className="material-symbols-rounded">close</span>
                    </button>
                  )}
                </div>
                
                {(inputMessage.trim() || selectedFile) && (
                  <button 
                    type="submit"
                    className="h-[35px] w-[35px] border-none cursor-pointer text-white bg-[#5350C4] rounded-full hover:bg-[#3d39ac] transition-[0.2s]"
                  >
                    <span className="material-symbols-rounded">arrow_upward</span>
                  </button>
                )}
              </div>
            </form>
            
            {/* Emoji Picker would be rendered here if using emoji-mart */}
            {showEmojiPicker && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-20 bg-white shadow-lg rounded-lg p-2">
                {/* This is a placeholder - you would need to implement emoji-mart or similar */}
                <div className="grid grid-cols-5 gap-2">
                  {['😀', '😂', '❤️', '👍', '🎉', '🔥', '👏', '🙏', '🥳', '😊'].map(emoji => (
                    <button 
                      key={emoji} 
                      onClick={() => handleEmojiSelect(emoji)}
                      className="text-2xl cursor-pointer hover:bg-gray-100 p-1 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx="true">{`
        @keyframes dotPulse {
          0%, 44% {
            transform: translateY(0);
          }
          28% {
            opacity: 0.4;
            transform: translateY(-4px);
          }
          44% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default AIChatComponent;