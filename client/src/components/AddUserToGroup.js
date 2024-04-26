import React, { useEffect } from "react";
import  { useState } from "react"
import { useDispatch,useSelector } from "react-redux";
import {ListGroup,Form,Stack, ListGroupItem,Modal,Button} from "react-bootstrap";
import {toggleMemberSelection,clearGroupCreation,getAllNewMembersToAdd,toggleGroupSelection,getAllNewAdminsToAdd,addNewMembersToTheGroup,setSelectedAdmins } from "../store/groupStore";
import "./CreateGroup.css";
import "./AddUserToGroup.css"
import { AiOutlinePlus } from "react-icons/ai";



const AddUserToGroup = () => {


    const groupId = JSON.parse(localStorage.getItem("group")).id;
    
    const [show,setShow] = useState(true);

    const dispatch = useDispatch();


    const allNewMembers = useSelector((state)=>state.userGroupCreation.allNewMembers);

    const allNewAdmins = useSelector((state)=>state.userGroupCreation.allNewAdmins);

    console.log("All new members are : ",allNewMembers);

     useEffect(()=>{

     dispatch(getAllNewMembersToAdd());

     dispatch(getAllNewAdminsToAdd());

     },[])


     const selectedMembers = useSelector((state)=>state.userGroupCreation.selectedMembers);

     const selectedAdmins = useSelector((state)=>state.userGroupCreation.selectedAdmins);

     const deselectAdmin = useSelector((state)=>state.userGroupCreation.deselectAdmin);

     const handleClose = () => {
        dispatch(clearGroupCreation());
        setShow(!show);
    }
    
    const addToGroupHandler = () => {
         
        const newMembersData = {
            admins : selectedAdmins,
            members : selectedMembers,
            groupId : groupId,
            
        }

        dispatch(addNewMembersToTheGroup(newMembersData));
    }


    return (

        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title className="add-user-title mb-2">
                        Add Users To Group
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Stack>
                <div className="m-1 select-admins-title mb-2">Select New Admins</div>
                <ListGroup className="select-admin-list">
                    {allNewAdmins.map((user)=>(
                        <ListGroupItem key={user.id}>
                        <Stack direction="horizontal">
                        <div className="me-auto">{user.name}</div>
                        <Form className="ms-auto">
                        <Form.Check
                         type="checkbox"
                         checked={selectedAdmins.includes(user.id)}  // Check if the user is in selectedAdmins array
                         onChange={() => {
                         if (selectedAdmins.includes(user.id)) {
                         dispatch(deselectAdmin(user.id));  // If already selected, deselect
                          } else {
                         dispatch(setSelectedAdmins(user.id));  // If not selected, select
                         }
                        }}
                        /> 
                        </Form>
                        </Stack>
                        </ListGroupItem>
                    ))}
                </ListGroup>
                <div className="mb-2 mt-2 select-members-title">Select New Members</div>
                <ListGroup className="select-admin-list mb-2">
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
                <Modal.Footer><Button onClick={addToGroupHandler} className="add-members-btn">
                    <Stack direction="horizontal" gap={1}>
                        <AiOutlinePlus/>
                    <div>Add Members To Group</div>
                    </Stack>
                    </Button></Modal.Footer>
                </Modal>
   
        </div>
    )


}
export default AddUserToGroup;