import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Stack, ListGroup, ListGroupItem } from 'react-bootstrap';
import { AiOutlineMore, AiOutlinePlus, AiOutlineUsergroupAdd } from "react-icons/ai";
import axios from "axios";
import "./ChatScreen.css";
import CreateGroup from "./CreateGroup";

const GroupChatScreen = () => {

    const groupData = JSON.parse(localStorage.getItem("group"));

    const groupId = groupData.id;

  
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

                // Fetch messages from local storage
                const storedMessages = JSON.parse(localStorage.getItem("groupChatMessages")) || [];
                setMessages(storedMessages);
    
                // Fetch new messages from the backend
                const res = await axios.get(`http://localhost:5000/chat/getGroupMessages/${groupId}`);
                const newMessages = res.data.messages;

                // Fetch user names for each message
                const userIds = newMessages.map(message => message.userId);
                const userDetailsPromises = userIds.map(async userId => {
                    const userDetailsRes = await axios.get(`http://localhost:5000/user/${userId}`);
                    return userDetailsRes.data.user.name; // Assuming user object has a userName property
                });
                const userNames = await Promise.all(userDetailsPromises);
    
                // Combine new messages with stored messages and add user names
                const updatedMessages = newMessages.map((message, index) => ({
                    ...message,
                    userName: userNames[index],
                }));
    
                // Save only the recent 10 chats in local storage
                const limitedMessages = updatedMessages.slice(-10);
    
                // Update state with the recent chats
                setMessages(limitedMessages);
                
                // console.log(limitedMessages);
                // Save updated messages in local storage
                localStorage.setItem("chatMessages", JSON.stringify(limitedMessages));
            } catch (err) {
                console.log("Error while fetching the chat:", err);
            }
        };
    
        getChat();
        // const interval = setInterval(() => {
        //     getChat();
        // }, 1000);

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
                    "http://localhost:5000/chat/sendGroupMessages",
                    { message: newMessage,groupId:groupId,global:false,userId:user.userId },
                    { headers }
                );

                console.log("Message has been sent successfully!", sentMessage.data);

                // Update local storage with the new message
                const updatedMessages = [{ user: 'Me', message: newMessage }, ...messages];
                if (updatedMessages.length > 10) {
                    updatedMessages.splice(0, updatedMessages.length - 10);
                }
                localStorage.setItem("groupChatMessages", JSON.stringify(updatedMessages));

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

export default GroupChatScreen;