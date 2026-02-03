import React, { useEffect, useState, useRef } from "react";
import { joinRoom, sendMessage, listenMessages, removeMessageListener } from "../../socketio/socketServices";
import messageServices from "../../services/messageServices";
import { useSelector } from "react-redux";
import "../../styles/Message.css";
import { VscSend } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const ChatWindow = () => {

  const { meetingid } = useParams();
  const [roomId, setRoomId] = useState(null);
  const [mid, setMid] = useState(null);
  const [roomTitle, setRoomTitle] = useState("");

  const [messages, setMessages] = useState([]);
  const [msgContent, setMsgContent] = useState("");
  const chatEndRef = useRef(null);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRoomId = async () => {
      try {
        const res = await messageServices.getRoomByMeeting(meetingid);
        setRoomId(res.roomId);
        setMid(res.mid);
        setRoomTitle(res.title);
      } catch (err) {
        console.error("Failed to fetch roomId", err);
      }
    };

    fetchRoomId();
  }, [meetingid]);

  // ------------------ JOIN ROOM ------------------
  useEffect(() => {
    if (!roomId) return;
    joinRoom(roomId); 
    return () => {
      removeMessageListener(); 
    };
  }, [roomId]);

  // ------------------ LISTEN MESSAGES ------------------
  useEffect(() => {
    listenMessages((msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.msg_id === msg.msg_id)) return prev;
        return [...prev, msg];
      });
    });
  }, []);

  // ------------------ SCROLL TO BOTTOM ------------------
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ------------------ FETCH ROOM HISTORY ------------------
  useEffect(() => {
    const fetchHistory = async () => {
      if (!roomId) return;
      try {
        const data = await messageServices.getRoomMessages(roomId);
        setMessages(data);
      } catch (err) {
        console.error("Error fetching room messages:", err);
      }
    };

    fetchHistory();
  }, [roomId]);

  // ------------------ SEND MESSAGE ------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId || !msgContent.trim()) return alert("Room ID and message are required");
    sendMessage({ room_id: roomId, content: msgContent });
    setMsgContent("");
  };


  return (
    <div className="chat-container">
      {/* ROOM TITLE */}
      <div className="chat-header">{`${mid} - ${roomTitle}`}</div>

      {/* MESSAGE HISTORY */}
      <div className="message-history">
        {messages.length === 0 && <div className="no-messages">Start the conversation</div>}
        {messages.map((msg, idx) => {
          const isSentByMe = msg.sender_id === auth.user_id;
          const username = isSentByMe ? "You" : msg.username || "Anonymous";
          return (
            <div
              key={msg.msg_id || `${msg.sender_id}-${msg.receiver_id}-${idx}`}
              className={`message-item ${isSentByMe ? "sent" : "received"}`}
            >
              <div className="sender-name">{username}</div>
              <div className="message-content">{msg.content}</div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* MESSAGE INPUT */}
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={msgContent}
          onChange={(e) => setMsgContent(e.target.value)}
          required
          className="message-input"
        />
        <button type="submit" className="send-button">
          <VscSend />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;