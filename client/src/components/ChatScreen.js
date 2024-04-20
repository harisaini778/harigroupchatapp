import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button,Stack } from 'react-bootstrap';
import axios from "axios";
import "./ChatScreen.css";

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const getChat = async () => {
            try {
                // Fetch messages from local storage
                const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
                setMessages(storedMessages);

                // Fetch new messages from the backend
                const res = await axios.get("http://localhost:5000/chat/getMessage");
                const newMessages = res.data.messages;

                // Combine new messages with stored messages
                let updatedMessages = [...storedMessages, ...newMessages];

                // Save only the recent 10 chats in local storage
                if (updatedMessages.length > 10) {
                    updatedMessages = updatedMessages.slice(-10);
                }

                // Update state with the recent chats
                setMessages(updatedMessages);

                // Save updated messages in local storage
                localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
            } catch (err) {
                console.log("Error while fetching the chat:", err);
            }
        };

        getChat();
        const interval = setInterval(() => {
            getChat();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const sendMessage = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user.token;

            if (newMessage.trim() !== '') {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: token,
                };

                const sentMessage = await axios.post(
                    "http://localhost:5000/chat/sendMessage",
                    { message: newMessage },
                    { headers }
                );

                console.log("Message has been sent successfully!", sentMessage.data);

                // Update local storage with the new message
                const updatedMessages = [{ user: 'Me', message: newMessage }, ...messages];
                if (updatedMessages.length > 10) {
                    updatedMessages.splice(0, updatedMessages.length - 10);
                }
                localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

                // Update state with the recent chats
                setMessages(updatedMessages);

                setNewMessage('');
            }
        } catch (err) {
            console.log("Error while sending the message:", err);
        }
    };

    return (
        <div className="outer-chat-div p-4">
            <Row>
                <Col md={12}>
                    <h3 className="border-bottom pb-3">Group Chat</h3>
                    <div className="chat-messages chat-container">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.user === 'Me' ? 'sent' : 'received'}`}>
                                <Stack>
                                {msg.user !== 'Me' && (
                                    <span className="message-user">{msg.name}</span>
                                )}
                                <p className="message-text">{msg.message}</p>
                                </Stack>
                            </div>
                        ))}
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                        />
                        <Button variant="primary" onClick={sendMessage}>
                            Send
                        </Button>
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default ChatScreen;
