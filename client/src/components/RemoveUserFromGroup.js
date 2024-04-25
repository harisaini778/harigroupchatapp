import React, { useEffect } from "react";
import  { useState } from "react"
import { useDispatch,useSelector } from "react-redux";
import {ListGroup,Form,Stack, ListGroupItem,Modal,Button} from "react-bootstrap";
import {toggleAllMemberSelectionInGroup,getAllTheuSersInGroup,removeMembersFromTheGroup } from "../store/groupStore";
import "./CreateGroup.css";





const RemoveUserFromGroup = () => {


    const groupId = JSON.parse(localStorage.getItem("group")).id;
    
    const [show,setShow] = useState(true);

    const dispatch = useDispatch();


    const allTheUsersInGroup = useSelector((state)=>state.userGroupCreation.allTheUsersInGroup);

    const selectTheUsersFromGroup = useSelector((state)=>state.userGroupCreation.selectTheUsersFromGroup);


     useEffect(()=>{

     dispatch(getAllTheuSersInGroup());

     },[])


     const handleClose = () => {
        setShow(!show);
    }
    
    const removeFromGroupHandler = () => {
         
        const selectedUserDataFromGroup = {
            members : selectTheUsersFromGroup,
            groupId : groupId,     
        }

       dispatch(removeMembersFromTheGroup(selectedUserDataFromGroup));
    }


    return (

        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title>
                        Remove Members From The Group
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Stack>
                <div className="m-1">Select Members To Remove</div>
                <ListGroup className="select-admin-list">
                    {allTheUsersInGroup.map((user)=>(
                        <ListGroupItem key={user.id}>
                        <Stack direction="horizontal">
                        <div className="me-auto">{user.name}</div>
                        <Form className="ms-auto">
                         <Form.Check
                         type="checkbox"
                         checked = {
                             selectTheUsersFromGroup.includes(user.id)}
                            onChange = {()=>dispatch(toggleAllMemberSelectionInGroup(user.id))}
                         />
                        </Form>
                        </Stack>
                        </ListGroupItem>
                    ))}
                </ListGroup>
                </Stack>
                </Modal.Body>
                <Modal.Footer><Button onClick={removeFromGroupHandler}>Remove Members To Group</Button></Modal.Footer>
                </Modal>
   
        </div>
    )


}
export default RemoveUserFromGroup;