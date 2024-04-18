import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ChatScreen = () => {

    const [messages, setMessages] = useState([
        { user: 'User 1', text: 'Hello!' },
        { user: 'User 2', text: 'Hi there!' },
        { user: 'User 1', text: 'How are you?' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            setMessages([...messages, { user: 'Me', text: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <Container fluid className="p-4">
            <Row>
                <Col md={12}>
                    <h3 className="border-bottom pb-3">Group Chat</h3>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.user === 'Me' ? 'sent' : 'received'}`}>
                                <span className="message-user">{msg.user}</span>
                                <p className="message-text">{msg.text}</p>
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
