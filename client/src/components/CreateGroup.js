import React, { useEffect } from "react";
import  { useState } from "react"
import { useDispatch,useSelector } from "react-redux";
import { fetchUsers } from "../store/userStore";
import {ListGroup,Form,Stack, ListGroupItem,Modal,Button} from "react-bootstrap";
import { setSelectedAdmins,setGroupName,toggleMemberSelection,clearGroupCreation,createGroup, deselectAdmin} from "../store/groupStore";
import "./CreateGroup.css";


const CreateGroup = () => {

    
    const [show,setShow] = useState(true);


    const dispatch = useDispatch();

    const users = useSelector((state)=>state.userGroup.users);

     useEffect(()=>{
     
     dispatch(fetchUsers());

     },[])


     const groupName = useSelector((state)=>state.userGroupCreation.groupName);

     const selectedAdmins = useSelector((state)=>state.userGroupCreation.selectedAdmins);

     const selectedMembers = useSelector((state)=>state.userGroupCreation.selectedMembers);

     const handleClose = () => {
        dispatch(clearGroupCreation());
        setShow(!show);
    }
    
    const createGroupHandler = async () => {
     
        try {

            const groupData = {
                name : groupName,
                admins : selectedAdmins,
                members : selectedMembers,
            };

            dispatch(createGroup(groupData));


            dispatch(clearGroupCreation());

        } catch(err) {
           console.log("error creating group  : ",err);
        }

    };

    return (

        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title>
                        Create Your Group
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
        <Form>
            <Form.Group>
                <Form.Control placeholder="Enter Group Name" type="text" 
                value={groupName}
                onChange={(e)=>dispatch(setGroupName(e.target.value))}
                required
                />
                </Form.Group>
                </Form>
                <Stack>
                <div className="m-1">Select Group Admin</div>
                <ListGroup className="select-admin-list">
                    {users.map((user)=>(
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
                <div className="m-1">Select Group Members</div>
                <ListGroup className="select-admin-list">
                    {users.map((user)=>(
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
                <Modal.Footer><Button onClick={createGroupHandler}>Create Group</Button></Modal.Footer>
                </Modal>
   
        </div>
    )


}
export default CreateGroup;