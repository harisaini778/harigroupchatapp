import React from "react";

import { useState } from "react";

import { Container,Row,Col,Button,Stack,Form,ListGroup,Image} from "react-bootstrap";

import { FaSearch,FaCircle,FaPaperPlane } from "react-icons/fa";


import chatImg from "../components/assets/chat-2389223_1920.png";

import "./Homepage.css";

import ChatScreen from "./ChatScreen"


const Homepage = () => {

  const [isToggle,setIsToggle] = useState(false);

  const startMessagingHandler = () => {
    setIsToggle(true);
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

            <ListGroup className="user-list-group">
              
            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item> 

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item>
                <Stack direction="horizontal" gap={1}>
                    <Stack direction="vertical">
                    <div>User 1</div>
                    <div>Last seen 7:00pm</div>
                    </Stack>
                  <FaCircle/>
                </Stack>
            </ListGroup.Item>
          
            </ListGroup>
                
                </Col>

                <Col md={8} lg={8}>

                {/* <Container className="mt-5 mb-5 brand-slogan-container">
                <div className="brand-slogan-homepage">ChatCircle - Connect with Friends and Family Anytime, Anywhere!</div>
                </Container>
                <div>
                <Image src={chatImg} className="brand-img" roundedCircle fluid/>
                </div>
                <div>
                  <Button>
                    Start Messaging
                  </Button>
                </div> */}

                { isToggle ? (<ChatScreen/>) 
                : 
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