import {createSlice} from "@reduxjs/toolkit";

//import { createAsyncThunk } from "@reduxjs/toolkit";


import axios from "axios";



// defining the initial states 


const initialState = {

    users : [], 
    selectedUsers : [],
    groups : [],
    isOnline : {}
};


const userGroupSlice = createSlice({
    name: "userGroup",
    initialState,
    reducers: {
      setUsers: (state, action) => {
        state.users = action.payload;
      },
      toggleUserSelection: (state, action) => {
        const userId = action.payload;
        state.users = state.users.map((user) =>
          user.id === userId ? { ...user, selected: !user.selected } : user
        );
        if (state.users.find((user) => user.id === userId)?.selected) {
          state.selectedUsers.push(userId);
        } else {
          state.selectedUsers = state.selectedUsers.filter((id) => id !== userId);
        }
      },
      addUserToGroup: (state, action) => {
        const { groupId, userId } = action.payload;
        const groupIndex = state.groups.findIndex((group) => group.id === groupId);
        if (groupIndex !== -1) {
          const userToAdd = state.users.find((user) => user.id === userId);
          if (userToAdd) {
            state.groups[groupIndex].members.push(userToAdd);
          }
        }
      },
      updateUserOnlineStatus: (state, action) => {
        const { userId, status } = action.payload;
        state.isOnline[userId] = status; // Update online status for the specified user
      },
    },
  });



export const fetchUsers = () => async (dispatch) => {

    try { 
    const response = await axios.get("http://localhost:5000/user/getAllUsers");
    dispatch(setUsers(response.data.users));
    } catch (err) {
     console.log("Error fetching the users : ",err);
    }
};


export const sendSelectedUsers = () => async(dispatch,getState) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;
    const headers = {
        "Content-Type" : "application/json",
        Authorization : token
    };
    const selectedUsers = getState().userGroup.selectedUsers; // Access selectedUsers from Redux state
    const response = await axios.post("http://example.com/endpoint",{selectedUsers}, {headers});
    console.log("Response from server in thunk : ",response);
  };
  
  export const {

    setUsers,
    toggleUserSelection,
    addUserToGroup,
    updateUserOnlineStatus

} = userGroupSlice.actions;

export default userGroupSlice.reducer;