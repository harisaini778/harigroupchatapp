import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {

  groupName : "",
  selectedAdmins : [],
  selectedMembers:[],
  isLoading: false,
  creatingGroup :false,
  allGroups : [],
  groupDetails : {},
  groupIsClicked : false,
  chatScreenIsClicked : false,
  isToggle : true,

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
          setAllGroups : (state,action) => {
            state.allGroups = action.payload;
          },
          setGroupDetails: (state, action) => {
            localStorage.removeItem("group");
            localStorage.setItem("group", JSON.stringify(action.payload));
            state.groupDetails = localStorage.getItem("group");
          },
          setGroupIsClicked : (state,action) => {
            state.groupIsClicked = action.payload;
            state.isToggle = false;
            state.chatScreenIsClicked = false;
          },
          setIsToggle : (state,action) => {
            state.isToggle = action.payload;
            state.groupIsClicked = false;
            state.chatScreenIsClicked = false;
          },
          setChatScreenIsClicked : (state,action) => {
            state.chatScreenIsClicked = action.payload;
            state.isToggle = false;
            state.groupIsClicked = false;
            
          }

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
    setAllGroups,
    setGroupDetails,
    setGroupIsClicked,
    setIsToggle,
    setChatScreenIsClicked
}   = groupSlice.actions;


export const getAllGroups = () => async (dispatch) => {

    try  {
    
         const response = await axios.get("http://localhost:5000/groups/getAllGroups");

         dispatch(setAllGroups(response.data.groups));


    } catch(err) {

        console.log("Error fetching the users : ",err);


    }
}


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