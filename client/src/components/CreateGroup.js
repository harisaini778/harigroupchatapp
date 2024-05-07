import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/userStore";
import {
  ListGroup,
  Form,
  Stack,
  ListGroupItem,
  Modal,
  Button,
} from "react-bootstrap";
import {
  setSelectedAdmins,
  setGroupName,
  toggleMemberSelection,
  clearGroupCreation,
  createGroup,
  deselectAdmin,
} from "../store/groupStore";
import "./CreateGroup.css";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

const CreateGroup = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const id = user.userId;

  const [show, setShow] = useState(true);

  const dispatch = useDispatch();

  const users = useSelector((state) => state.userGroup.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const groupName = useSelector((state) => state.userGroupCreation.groupName);

  const selectedAdmins = useSelector(
    (state) => state.userGroupCreation.selectedAdmins
  );

  const selectedMembers = useSelector(
    (state) => state.userGroupCreation.selectedMembers
  );


  const handleClose = () => {
    dispatch(clearGroupCreation());
    setShow(!show);
  };

  const createGroupHandler = async () => {
    try {
      const groupData = {
        name: groupName,
        admin: id,
        members: selectedMembers,
      };

      dispatch(createGroup(groupData));

      dispatch(clearGroupCreation());

      setShow(!show);
    } catch (err) {
      console.log("error creating group  : ", err);
    }
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title className="modal-title-group">
            Create Your Group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                placeholder={`Enter Your "Group Name"`}
                type="text"
                className="mb-2"
                value={groupName}
                onChange={(e) => dispatch(setGroupName(e.target.value))}
                required
              />
            </Form.Group>
          </Form>
          <Stack>
            {/* <div className="mb-2 select-admins">Select Group Admin</div>
                <ListGroup className="select-admin-list mb-2">
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
                </ListGroup> */}
            <div className="mb-2 select-members">Select Group Members</div>
            <ListGroup className="select-admin-list mb-2">
              {users.map(
                (user) =>
                  // Check if the user.id is not equal to id before rendering
                  user.id !== id && (
                    <ListGroupItem key={user.id}>
                      <Stack direction="horizontal">
                        <div className="me-auto">{user.name}</div>
                        <Form className="ms-auto">
                          <Form.Check
                            type="checkbox"
                            checked={selectedMembers.includes(user.id)}
                            onChange={() =>
                              dispatch(toggleMemberSelection(user.id))
                            }
                          />
                        </Form>
                      </Stack>
                    </ListGroupItem>
                  )
              )}
            </ListGroup>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createGroupHandler} className="create-group-btn">
            <Stack direction="horizontal" gap={1}>
              <AiOutlineUsergroupAdd />
              <div> Create Group</div>
            </Stack>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default CreateGroup;
