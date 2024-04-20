import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from "axios";
import "./ChatScreen.css";

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const getChat = async () => {
            try {
                const res = await axios.get("http://localhost:5000/chat/getMessage");
                const chatData = res.data.messages; 
                setMessages(chatData);
            } catch (err) {
                console.log("Error while fetching the chat:", err);
            }
        };

        getChat();
        const interval = setInterval(()=>{
            getChat();
        },1000);
        
        return ()=>clearInterval(interval);
    }, []);

    const sendMessage = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user.token;

            if (newMessage.trim() !== '') {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: token, // Include the JWT token in the Authorization header
                };

                const sentMessage = await axios.post(
                    "http://localhost:5000/chat/sendMessage",
                    { message: newMessage },
                    { headers }
                );

                console.log("Message has been sent successfully!", sentMessage.data);
                setMessages([{ user: 'Me', text: newMessage }, ...messages]);
                setNewMessage('');
            }
        } catch (err) {
            console.log("Error while sending the message:", err);
        }
    };

    return (
        <Container fluid className="p-4 ">
            <Row>
                <Col md={12}>
                    <h3 className="border-bottom pb-3">Group Chat</h3>
                    <div className="chat-messages chat-container">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.user === 'Me' ? 'sent' : 'received'}`}>
                                {msg.user !== 'Me' && (
                                    <span className="message-user">{msg.name}</span>
                                )}
                                <p className="message-text">{msg.message}</p>
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
        </Container>
    );
};

export default ChatScreen;