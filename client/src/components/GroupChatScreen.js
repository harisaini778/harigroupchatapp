import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Row,
  Stack,
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import {
  AiOutlineMinus,
  AiOutlineMore,
  AiOutlinePaperClip,
  AiOutlinePlus,
} from "react-icons/ai";
import { FaPaperPlane } from "react-icons/fa";
import AddUserToGroup from "./AddUserToGroup";
import "./ChatScreen.css";
import "./GroupChatScreen.css";
import RemoveUserFromGroup from "./RemoveUserFromGroup";
import { socket } from "../socket";

const GroupChatScreen = () => {


  const [isAdmin, setIsAdmin] = useState(false);

  const groupData = JSON.parse(localStorage.getItem("group"));

  const groupId = groupData.id || null;

  const groupName = groupData.name;

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user.userId;

  useEffect(() => {
    const getAdminInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/userGroups/getAdminInfo?userId=${userId}&groupId=${groupId}`
        );

        const data = res.data.adminData[0];

        console.log(data);

        setIsAdmin(data.isAdmin);

        console.log("isAdmin : ", isAdmin);
      } catch (err) {
        console.log("Err occured while fetching the admin info : ", err);
      }
    };
    getAdminInfo();
  }, []);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showListGroup, setShowListGroup] = useState(false);

  const [addToGroupToggle, setAddToGroupToggle] = useState(false);

  const [removeFromGroupToggle, setRemoveFromGroupToggle] = useState(false);

  const listGroupHandler = () => {
    setShowListGroup(!showListGroup);
  };

  const toggleAddToGroupHandler = () => {
    if (isAdmin) {
      setAddToGroupToggle(!addToGroupToggle);
    } else {
      alert("You are not the admin  of this group.");
    }
  };

  const removeFromGroupHandler = () => {
    if (isAdmin) {
      setRemoveFromGroupToggle(!removeFromGroupToggle);
    } else {
      alert("You are not the admin  of this group.");
    }
  };

  const getChat = () => {
    try {

      const groupId = JSON.parse(localStorage.getItem("group")).id;

      const groupName = JSON.parse(localStorage.getItem("group")).name;

      console.log("group id is : ", groupId);

      socket.emit("getGroupMessage", { groupId, groupName });

       socket.on("groupmessages", (chats) => {

        try {

          const limitedMessages = chats.slice(-10);

          // Update state with the recent chats
          setMessages(limitedMessages);


          // Save updated messages in local storage
          localStorage.setItem("groupChatMessages", JSON.stringify(limitedMessages));

          
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
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
      const name = user.userName;

      if (newMessage.trim() !== "") {
        const headers = {
          "Content-Type": "application/json",
          Authorization: token,
        };

        const sentMessage = await axios.post(
          "http://localhost:5000/chat/sendGroupMessages",
          {
            message: newMessage,
            groupId: groupId,
            global: false,
            userId: user.userId,
            name:name,
            
          },
          { headers }
        );

        console.log("Message has been sent successfully!", sentMessage.data.groupChat);

        const newMsg = sentMessage.data.groupChat;

        // Update local storage with the new message
        // const updatedMessages = [newMsg,...messages];

        // console.log("updated messages are : ",updatedMessages);

        // if (updatedMessages.length > 10) {
        //   updatedMessages.splice(0, updatedMessages.length - 10);
        // }
        // localStorage.setItem(
        //   "groupChatMessages",
        //   JSON.stringify(updatedMessages)
        // );

        // Update state with the recent chats
        setMessages(prevMessages => {
          const updatedMessages = [newMsg, ...prevMessages];
          if (updatedMessages.length > 10) {
            updatedMessages.splice(10);
          }
          return updatedMessages;
        });
  

        console.log("set messages  : ",messages.slice(-10));

        setNewMessage("");

        getChat();
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
            <h3 className="border-bottom pb-3 group-name-title">
              {groupName.toUpperCase()}
            </h3>
            <Stack direction="horizontal" gap={5} className="ms-auto">
              {addToGroupToggle && <AddUserToGroup />}
              {removeFromGroupToggle && <RemoveUserFromGroup />}
              {showListGroup && (
                <ListGroup className="ms-auto m-0">
                  <ListGroup>
                    <ListGroupItem className="add-to-group m-1">
                      <Stack direction="horizontal" gap={2}>
                        <AiOutlinePlus />
                        <div onClick={toggleAddToGroupHandler}>
                          Add To Group
                        </div>
                      </Stack>
                    </ListGroupItem>
                    <ListGroupItem className="remove-from-group m-1">
                      <Stack direction="horizontal" gap={2}>
                        <AiOutlineMinus />
                        <div onClick={removeFromGroupHandler}>
                          Remove From Group
                        </div>
                      </Stack>
                    </ListGroupItem>
                  </ListGroup>
                  {/* <ListGroupItem>
                                    <Stack direction="horizontal" gap={2}>
                                        <AiOutlineUsergroupAdd />
                                        <div onClick={toggleGroupHandler}>Create A Group</div>
                                    </Stack>
                                </ListGroupItem> */}
                </ListGroup>
              )}
              <AiOutlineMore
                className="ms-auto more-icon"
                onClick={listGroupHandler}
              />
            </Stack>
          </Stack>
          <div className="chat-messages chat-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.user === "Me" ? "sent" : "received"}`}
              >
                <Stack>
                  {msg.user !== "Me" && (
                    <span className="message-user">{msg.userName}</span>
                  )}
                  <p className="message-text">{msg.message}</p>
                </Stack>
              </div>
            ))}
          </div>
          <InputGroup>
            <InputGroupText>
              <Button
                variant="primary"
                onClick={sendMessage}
                className="send-message-btn"
              >
                <FaPaperPlane />
              </Button>
            </InputGroupText>
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <InputGroupText>
              <Button className="media-attachment">
                <AiOutlinePaperClip />
              </Button>
            </InputGroupText>
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
};

export default GroupChatScreen;
