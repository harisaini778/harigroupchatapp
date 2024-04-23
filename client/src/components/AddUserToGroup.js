import React, { useEffect } from "react";
import  { useState } from "react"
import { useDispatch,useSelector } from "react-redux";
import { fetchUsers } from "../store/userStore";
import {ListGroup,Form,Stack, ListGroupItem,Modal,Button} from "react-bootstrap";
import {toggleMemberSelection,clearGroupCreation,getAllNewMembersToAdd} from "../store/groupStore";
import "./CreateGroup.css";


const AddUserToGroup = () => {

    
    const [show,setShow] = useState(true);


    const dispatch = useDispatch();


    const allNewMembers = useSelector((state)=>state.userGroupCreation.allNewMembers);

    console.log("All new members are : ",allNewMembers);

     useEffect(()=>{

     dispatch(getAllNewMembersToAdd());

     },[])


     const selectedMembers = useSelector((state)=>state.userGroupCreation.selectedMembers);

     const handleClose = () => {
        dispatch(clearGroupCreation());
        setShow(!show);
    }
    

    const addToGroupHandler = () => {

    }


    return (

        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title>
                        Add Users To Group
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Stack>
                <div className="m-1">Select New Members</div>
                <ListGroup className="select-admin-list">
                    {allNewMembers.map((user)=>(
                        <ListGroupItem key={user.id}>
                        <Stack direction="horizontal">
                        <div className="me-auto">{user.name}</div>
                        <Form className="ms-auto">
                         <Form.Check
                         type="checkbox"
                         checked = {
                             selectedMembers.includes(user.id)}
                            onChange = {()=>dispatch(toggleMemberSelection(user.id))}
                         />
                        </Form>
                        </Stack>
                        </ListGroupItem>
                    ))}
                </ListGroup>
                </Stack>
                </Modal.Body>
                <Modal.Footer><Button onClick={addToGroupHandler}>Add Members To Group</Button></Modal.Footer>
                </Modal>
   
        </div>
    )


}
export default AddUserToGroup;