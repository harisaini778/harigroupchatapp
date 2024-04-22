import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {

  groupName : "",
  selectedAdmins : [],
  selectedMembers:[],
  isLoading: false,
  creatingGroup :false,

}


const groupSlice = createSlice({

    name : "userGroupCreation",
    initialState,
    reducers : {
        setGroupName : (state,action) => {
         state.groupName = action.payload;
        },
        setSelectedAdmins : (state,action) => {
            state.selectedAdmins.push(action.payload);
        },
        deselectAdmin : (state,action) => {
            state.selectedAdmins =  state.selectedAdmins.filter(
                (adminId) => adminId !== action.payload
            );
        },
        toggleMemberSelection : (state,action) => {
            const memberId = action.payload;
            state.selectedMembers = state.selectedMembers.includes(memberId)
            ? state.selectedMembers.filter((id)=>id !== memberId)
            : [...state.selectedMembers,memberId];
        },
        clearGroupCreation : (state) => {
            state.groupName = "";
            state.selectedAdmins = [];
            state.selectedMembers = [];
        },
        createGroupRequest: (state) => {
            state.creatingGroup = true;
          },
          createGroupSuccess: (state) => {
            state.creatingGroup = false;
          },
          createGroupFailure: (state) => {
            state.creatingGroup = false;
          },

    }

});

export const {
    setGroupName,
    setSelectedAdmins,
    deselectAdmin,
    toggleMemberSelection,
    clearGroupCreation,
    createGroupRequest,
    createGroupSuccess,
    createGroupFailure,
}   = groupSlice.actions;

export const createGroup = (groupData) =>  async (dispatch) => {

    try {
  
    dispatch(createGroupRequest());

    const user = JSON.stringify(localStorage.getItem("user"));

    const token = user.token;

    const headers = {

        "Content-Type" : "application/json",
        Authorization : token,
    }

    const response = await axios.post("http://localhost:5000/groups/createGroup",{groupData},{headers});

    console.log("Group created successfully : ", response.data);

    dispatch(createGroupSuccess());

    }catch(err) {
     
        console.log(err);
        console.log("Error creating group : ",err);
        dispatch(createGroupFailure());
    }
}

export default groupSlice.reducer;