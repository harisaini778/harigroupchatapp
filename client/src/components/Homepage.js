import React from "react";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Button, Col, Container, Form, Image, InputGroup, ListGroup, ListGroupItem, Row, Stack } from "react-bootstrap";

import { FaCircle, FaPaperPlane, FaSearch } from "react-icons/fa";

import { fetchUsers, toggleUserSelection } from "../store/userStore";

import { getAllGroups, setChatScreenIsClicked, setGroupDetails, setGroupIsClicked } from "../store/groupStore";



import chatImg from "../components/assets/chat-2389223_1920.png";

import "./Homepage.css";

import ChatScreen from "./ChatScreen";

import InputGroupText from "react-bootstrap/esm/InputGroupText";
import GroupChatScreen from "./GroupChatScreen";






const Homepage = () => {

  const [lastSeen,setLastSeen] = useState([]);

  const dispatch = useDispatch();

  const allUsers = useSelector((state)=>state.userGroup.users);

  const selectedUsers = useSelector((state)=>state.userGroup.selectedUsers);

  const groups = useSelector((state)=>state.userGroupCreation.allGroups);

  const groupIsClicked = useSelector((state)=>state.userGroupCreation.groupIsClicked);

  const isToggle = useSelector((state)=>state.userGroupCreation.isToggle);

  const chatScreenIsClicked = useSelector((state)=>state.userGroupCreation.chatScreenIsClicked);

  


  function formatLastActiveTime(lastActiveTime) {
    const currentTime = new Date();
    const activityTime = new Date(lastActiveTime);
  
    const timeDifference = currentTime.getTime() - activityTime.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    }
  }
  






  const startMessagingHandler = () => {
   dispatch(setChatScreenIsClicked(!chatScreenIsClicked))
  }

  const handleUserSelection = (userId) =>{
    dispatch(toggleUserSelection(userId));
  }


  useEffect(()=>{
    dispatch(fetchUsers());
    dispatch(getAllGroups());
  },[]);

  




  const groupHandler = (group) => {
    
    dispatch(setGroupDetails(group));

    dispatch(setGroupIsClicked(!groupIsClicked));

  }

    return (
        <div className="outer-container">
         <Container className="inner-container">
            <Row >
                <Col md={4} lg={4} xs={12} className="user-list-col">
  
            <Stack direction="horizontal" className="m-3">
              <InputGroup>
              <Form.Control type="text" placeholder={`Find "Groups, "Users"`} ></Form.Control>
              <InputGroupText>
              <Button className="search-btn-user">
            <FaSearch/>
            </Button>
              </InputGroupText>
              </InputGroup>
            </Stack>
            <Stack direction="vertical" gap={5}>
            <ListGroup className="user-list-group">

              <Stack direction="vertical" gap={1}>
                <div className="mx-auto mt-3 mb-3 border-bottom" id="your-group-heading">Your Groups</div>
              {groups.map((group) => (
                <ListGroupItem key={group.id} onClick={()=>groupHandler(group)}>
                  <Stack direction="horizontal" >
                    <div className="me-auto group-name">{(group.name).toUpperCase()}</div>
                  </Stack>
                </ListGroupItem>
              ))}
              </Stack>
            </ListGroup>

            <ListGroup className="user-list-group">
            <Stack gap={1}>
            <div className="mx-auto mb-3 border-bottom" id="your-group-heading">All Users</div>
            {allUsers.map((user)=>(
            <ListGroup.Item key={user.id}>
            <Stack direction="horizontal">
                {/* <Stack direction="horizontal"> */}
                <div className="user-name me-auto">{user.name}</div>
                <div className="user-lastseen ms-auto">joined {formatLastActiveTime(user.updatedAt)}</div>
                {/* </Stack> */}
                {/* <FaCircle style={{ color:  "black" }} /> Display online status */}
            </Stack>
            </ListGroup.Item>
             
            ))}
                </Stack>
            </ListGroup>
            
            </Stack>
                
                </Col>

                <Col md={8} lg={8}>
                
                {groupIsClicked && <GroupChatScreen/>}
                { chatScreenIsClicked && (<ChatScreen/>) }
                { isToggle &&
                (<Stack direction="vertical" gap={2} className="mt-5">

                <div className="brand-slogan-homepage">ChatCircle - Connect with Friends and Family Anytime, Anywhere!</div>

                <div className="brand-img-div">
                <Image src={chatImg} roundedCircle fluid className="brand-img"/>
                </div>

                <div className="start-messaging-div">
                  <Button className="start-messaging-btn" onClick={startMessagingHandler}>
                    <Stack direction="horizontal" gap={2}>
                    <div className="start-messaging-txt">Start Messaging</div>
                    <div className="start-messaging-icon"><FaPaperPlane/></div>
                    </Stack>
                  </Button>
                </div>

                </Stack>)}

                </Col>
            </Row>
         </Container>
        </div>
    );

}

export default Homepage;