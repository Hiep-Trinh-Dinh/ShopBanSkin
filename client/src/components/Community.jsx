import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import { FaPaperPlane, FaPaperclip } from "react-icons/fa";
import Avatar from "./Avatar";
import { fetchAllUser } from "../services/auth-service";
import { sendMessage, getChannelMessages } from "../services/chat-service";
import { jwtDecode } from "jwt-decode";
import { error } from "./Alert";

export default function CommunityPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState({ id: 1, name: "General" });
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setCurrentUser(null);
      }
    }

    const getUsers = async () => {
      try {
        const response = await fetchAllUser();
        if (response.success) {
          setUsers(response.data);
          if (!currentUser && token) {
            const decoded = jwtDecode(token);
            const foundUser = response.data.find(user => user._id === decoded.id);
            if (foundUser) {
              setCurrentUser(foundUser);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getChannelMessages(activeChannel.name);
        if (response.success) {
          const sortedMessages = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setMessages(sortedMessages);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChannel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Kiểm tra người dùng đã đăng nhập chưa
    if (!currentUser) {
      error("Bạn cần đăng nhập để sử dụng chức năng chat!");
      return;
    }

    // Kiểm tra có nội dung hoặc file không
    if (!newMessage.trim() && !selectedFile) {
      error("Vui lòng nhập nội dung hoặc chọn file để gửi!");
      return;
    }

    try {
      const messageData = {
        content: newMessage.trim(),
        channel: activeChannel.name,
        sender: {
          name: currentUser.name || currentUser.username,
          avatar: currentUser.image
        }
      };

      if (selectedFile) {
        messageData.attachment = selectedFile;
      }

      const response = await sendMessage(messageData);

      if (response.success) {
        setMessages([...messages, response.data]);
        setNewMessage("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const userColors = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-red-200", "bg-purple-200", "bg-pink-200"];

  const renderAttachment = (message) => {
    if (!message.attachment) return null;

    switch (message.attachmentType) {
      case 'image':
        return (
          <a href={message.attachment} target="_blank" rel="noopener noreferrer">
            <img src={message.attachment} alt="Attached" className="max-w-xs max-h-60 rounded-md" />
          </a>
        );
      case 'video':
        return (
          <video controls className="max-w-xs max-h-60 rounded-md">
            <source src={message.attachment} />
            Your browser does not support the video tag.
          </video>
        );
      default:
        // Handle generic file
        const fileName = message.attachment.split('/').pop();
        return (
          <a 
            href={message.attachment} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline flex items-center"
          >
            <FaPaperclip className="mr-1" />
            {fileName || "Attached file"}
          </a>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="mt-16 flex-grow flex">
        <div className="w-64 bg-gray-800 text-white flex flex-col">
          <div className="p-4 flex-1">
            <h2 className="text-xl font-semibold mb-4">Online Users</h2>
            <div className="space-y-3">
              {users.map((user, index) => (
                <div key={user._id} className={`flex items-center space-x-3 p-2 rounded ${userColors[index % userColors.length]} mb-2`}>
                  <div className="relative">
                    <Avatar 
                      src={user.image || "/default-avatar.png"} 
                      alt={user.name} 
                      name={user.name} 
                    />
                    <span
                      className={`absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full ring-2 ${
                        user.online ? "bg-green-500 ring-gray-800" : "bg-red-500 ring-gray-800"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-grow flex flex-col bg-white">
          <div className="bg-black p-4 border-b">
            <h2 className="text-xl text-white font-semibold">#{activeChannel.name}</h2>
          </div>
          <div 
            className="flex-grow p-4 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            {messages.map((message) => (
              <div key={message._id} className={`mb-4 ${message.sender.name === (currentUser?.name || currentUser?.username) ? "text-right" : "text-left"}`}>
                <div className={`flex items-baseline ${message.sender.name === (currentUser?.name || currentUser?.username) ? "justify-end" : ""}`}>
                  <span className={`font-semibold mr-2 ${message.sender.name === (currentUser?.name || currentUser?.username) ? "text-blue-600" : "text-black"}`}>
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className={`mt-1 p-2 rounded inline-block ${message.sender.name === (currentUser?.name || currentUser?.username) ? "bg-blue-100" : "bg-gray-200"}`}>
                  {message.content && <p className="mb-2">{message.content}</p>}
                  {renderAttachment(message)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            {selectedFile && (
              <div className="mb-2 flex items-center bg-blue-50 p-2 rounded">
                <span className="text-sm text-gray-700 flex-grow truncate">
                  {selectedFile.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 py-2 mr-1 rounded-l-md focus:outline-none ${
                  currentUser
                    ? "text-gray-600 hover:text-blue-600"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                disabled={!currentUser}
              >
                <FaPaperclip />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={!currentUser}
              />
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={currentUser ? "Type your message..." : "Please login to chat..."}
                className="flex-grow px-3 py-2 border-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!currentUser}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  currentUser 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-gray-400 cursor-not-allowed text-gray-200"
                }`}
                disabled={!currentUser}
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}