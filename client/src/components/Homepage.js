import React from "react";

import { useState,useEffect} from "react";

import { useSelector,useDispatch } from "react-redux";

import { Container,Row,Col,Button,Stack,Form,ListGroup,Image, ListGroupItem} from "react-bootstrap";

import { FaSearch,FaCircle,FaPaperPlane,FaCheckSquare } from "react-icons/fa";

import { fetchUsers,toggleUserSelection } from "../store/userStore";

import { getAllGroups,setGroupDetails,setGroupIsClicked,setIsToggle,setChatScreenIsClicked} from "../store/groupStore";


import chatImg from "../components/assets/chat-2389223_1920.png";

import "./Homepage.css";

import ChatScreen from "./ChatScreen"

import GroupChatScreen from "./GroupChatScreen";






const Homepage = () => {

  const dispatch = useDispatch();

  const allUsers = useSelector((state)=>state.userGroup.users);

  const selectedUsers = useSelector((state)=>state.userGroup.selectedUsers);

  const groups = useSelector((state)=>state.userGroupCreation.allGroups);

  //const groupDetails = useSelector((state)=>state.userGroupCreation.groupDetails);

  const groupIsClicked = useSelector((state)=>state.userGroupCreation.groupIsClicked);

  const isToggle = useSelector((state)=>state.userGroupCreation.isToggle);

  const chatScreenIsClicked = useSelector((state)=>state.userGroupCreation.chatScreenIsClicked);






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
            <Form.Control type="text" placeholder="Find Someone"></Form.Control>
            <Button className="search-btn-user">
            <FaSearch className="search-icon-user"/>
            </Button>
            </Stack>

            <ListGroup className="user-list-allGroups">
              {groups.map((group) => (
                <ListGroupItem key={group.id} onClick={()=>groupHandler(group)}>
                  <Stack direction="horizontal" >
                    <div className="me-auto">{group.name}</div>
                    <div className="ms-auto">{group.updatedAt}</div>
                  </Stack>
                </ListGroupItem>
              ))}
            </ListGroup>

            <ListGroup className="user-list-group">
              
            {allUsers.map((user)=>(
            <ListGroup.Item key={user.id}>
            <Stack direction="horizontal" gap={1}>
                <Stack direction="vertical">
                <div>{user.name}</div>
                <div>{user.updatedAt}</div>
                </Stack>
              <FaCircle/>
              <input
               type="checkbox"
               checked={selectedUsers.includes(user.id)}
               onChange={()=>handleUserSelection(user.id)}
              />
            </Stack>
            </ListGroup.Item>
            ))}

            </ListGroup>
                
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