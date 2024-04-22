import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Stack, ListGroup, ListGroupItem } from 'react-bootstrap';
import { AiOutlineMore, AiOutlinePlus, AiOutlineUsergroupAdd } from "react-icons/ai";
import axios from "axios";
import "./ChatScreen.css";
import CreateGroup from "./CreateGroup";

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showListGroup, setShowListGroup] = useState(false);
    const [createGroupToggle, setCreateGroupToggle] = useState(false);

    const listGroupHandler = () => {
        setShowListGroup(!showListGroup);
    };

    const toggleGroupHandler = () => {
        setCreateGroupToggle(!createGroupToggle);
    };

    useEffect(() => {
        const getChat = async () => {
            try {
                const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
                setMessages(storedMessages);
    
                const res = await axios.get('http://localhost:5000/chat/getMessage');
                const newMessages = res.data.messages;
    
                // Filter out duplicates from newMessages
                const filteredNewMessages = newMessages.filter((msg) => {
                    return !storedMessages.some((storedMsg) => storedMsg.id === msg.id);
                });
    
                let updatedMessages = [...storedMessages, ...filteredNewMessages];
                if (updatedMessages.length > 10) {
                    updatedMessages = updatedMessages.slice(-10);
                }
    
                // Fetch user details for each message
                const messagesWithUserDetails = await Promise.all(
                    updatedMessages.map(async (msg) => {
                        if (msg.userId) {
                            // Fetch user details from backend
                            const userRes = await axios.get(`http://localhost:5000/user/${msg.userId}`);
                            const userDetails = userRes.data.user; // Assuming the user details are returned under the 'user' key
                            return { ...msg, userName: userDetails.name };
                        }
                        return msg;
                    })
                );
    
                setMessages(messagesWithUserDetails);
                localStorage.setItem('chatMessages', JSON.stringify(messagesWithUserDetails));
            } catch (err) {
                console.log('Error while fetching the chat:', err);
            }
        };
    
        getChat();
    
        // const interval = setInterval(getChat, 1000); // Refresh chat every 1 second
        // return () => clearInterval(interval);
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
                    { message: newMessage, userName: user.name }, // Include the user's name in the message data
                    { headers }
                );
    
                console.log("Message has been sent successfully!", sentMessage.data);
    
                const updatedMessages = [{ userName: user.name, message: newMessage }, ...messages]; // Use user's name instead of 'Me'
                if (updatedMessages.length > 10) {
                    updatedMessages.splice(0, updatedMessages.length - 10);
                }
                localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    
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
                    <Stack direction="horizontal">
                        <h3 className="border-bottom pb-3">Group Chat</h3>
                        <Stack direction="horizontal" gap={5} className="ms-auto">
                            {createGroupToggle && <CreateGroup />}
                            {showListGroup && <ListGroup className="ms-auto m-0">
                                <ListGroupItem>
                                    <Stack direction="horizontal" gap={2}>
                                        <AiOutlinePlus />
                                        <div>Add To Group</div>
                                    </Stack>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Stack direction="horizontal" gap={2}>
                                        <AiOutlineUsergroupAdd />
                                        <div onClick={toggleGroupHandler}>Create A Group</div>
                                    </Stack>
                                </ListGroupItem>
                            </ListGroup>}
                            <AiOutlineMore className="ms-auto more-icon" onClick={listGroupHandler} />
                        </Stack>
                    </Stack>
                    <div className="chat-messages chat-container">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.user === 'Me' ? 'sent' : 'received'}`}>
                                <Stack>
                                    {msg.user !== 'Me' && (
                                        <span className="message-user">{msg.userName}</span>
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
