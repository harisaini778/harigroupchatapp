import React, { useState, useEffect,memo } from "react";
import { Container, Row, Col, Form, Button, Stack, ListGroup, ListGroupItem, InputGroup } from 'react-bootstrap';
import { AiOutlineMore, AiOutlinePlus, AiOutlineUsergroupAdd,AiOutlinePaperClip } from "react-icons/ai";
import {FaPaperPlane} from "react-icons/fa"
import axios from "axios";
import "./ChatScreen.css";
import CreateGroup from "./CreateGroup";
import {socket} from "../socket";

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

    const getChat = async () => {
        try {
            // Fetch messages from local storage
            const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
            setMessages(storedMessages);

            // Fetch new messages from the backend
            socket.emit("getMessage");
        
            socket.on("messages",async(chats)=> {
             try{
                // Fetch user names for each message
            // const userIds = chats.map(message => message.userId);
            // const userDetailsPromises = userIds.map(async userId => {
            //     const userDetailsRes = await axios.get(`http://localhost:5000/user/${userId}`);
            //     return userDetailsRes.data.user.name; // Assuming user object has a userName property
            // });
            // const userNames = await Promise.all(userDetailsPromises);

            // Combine new messages with stored messages and add user names
            // const updatedMessages = chats.map((message, index) => ({
            //     ...message,
            //     userName: userNames[index],
            // }));

            // Save only the recent 10 chats in local storage
             const limitedMessages = chats.slice(-10);

            // Update state with the recent chats
            setMessages(limitedMessages);
            
            // console.log(limitedMessages);
            // Save updated messages in local storage
            localStorage.setItem("chatMessages", JSON.stringify(limitedMessages));

             }catch(err) {
                console.log(err);
             }
        });
        } catch (err) {
            console.log("Error while fetching the chat:", err);
        }
    };
    
    useEffect(() => {

      
    
        getChat();

        // Listen for new messages from the server


    }, [newMessage]);

    const sendMessage = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user.token;
            const name = user.userName;

            console.log("name is : ",name);


            if (newMessage.trim() !== '') {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: token,
                };

                const sentMessage = await axios.post(
                    "http://localhost:5000/chat/sendMessage",
                    { message: newMessage,name },
                    { headers }
                );

                console.log("Message has been sent successfully!", sentMessage.data);

                // Update local storage with the new message
                const updatedMessages = [{message: newMessage }, ...messages];
                if (updatedMessages.length > 10) {
                    updatedMessages.splice(0, updatedMessages.length - 10);
                }
                localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

                // Update state with the recent chats
                setMessages(updatedMessages);

                setNewMessage('');

                getChat();
            };
        } catch (err) {
            console.log("Error while sending the message:", err);
        }
    };


    return (
        <div className="outer-chat-div p-4">
            <Row>
                <Col md={12}>
                    <Stack direction="horizontal">
                        <h3 className="border-bottom pb-3 group-title">Group Chat</h3>
                        <Stack direction="horizontal" gap={5} className="ms-auto">
                            {createGroupToggle && <CreateGroup />}
                            {showListGroup && <ListGroup className="ms-auto m-0">
                                <ListGroupItem  className="create-group-stack">
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
                            <div key={index} >
                                <Stack>
                                  <span className="message-user">{msg.userName}</span>         
                                    <p className="message-text">{msg.message}</p>
                                </Stack>
                            </div>
                        ))}
                    </div>
                    <InputGroup>
                        <InputGroup.Text>
                        <Button variant="primary" onClick={sendMessage} className="send-message-btn">
                            <FaPaperPlane/>
                        </Button>
                        </InputGroup.Text>
                       
                        <Form.Control
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                        />
                    
                    <InputGroup.Text>
                        <Button className="media-attachment"><AiOutlinePaperClip/></Button>
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>
        </div>
    );
};

export default ChatScreen;