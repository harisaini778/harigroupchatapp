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
  allNewMembers : [],
  allNewAdmins : [],

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

        toggleGroupSelection : (state,action) => {

            const groupId = action.payload;

            state.allGroups = state.allGroups.includes(groupId) ?  

            state.allGroups.filter((id)=> id!==groupId) : [...state.allGroups,groupId] ;
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
            
          },

          setAllNewMembers : (state,action) => {
            state.allNewMembers = action.payload
          },
          setAllNewAdmins : (state,action) => {
            state.allNewAdmins  = action.payload
          },

    }

});

export const {
    setGroupName,
    setSelectedAdmins,
    deselectAdmin,
    toggleMemberSelection,
    toggleGroupSelection,
    clearGroupCreation,
    createGroupRequest,
    createGroupSuccess,
    createGroupFailure,
    setAllGroups,
    setGroupDetails,
    setGroupIsClicked,
    setIsToggle,
    setChatScreenIsClicked,
    setAllNewMembers,
    setAllNewAdmins,
}   = groupSlice.actions;


export const getAllGroups = () => async (dispatch) => {

    try  {
    
         const response = await axios.get("http://localhost:5000/groups/getAllGroups");

         dispatch(setAllGroups(response.data.groups));


    } catch(err) {

        console.log("Error fetching the users : ",err);


    }
}

export const getAllNewMembersToAdd = () =>async (dispatch) => {

    try {

        const group = JSON.parse(localStorage.getItem("group"));
        
        const groupId = group.id;

        const response = await axios.get(`http://localhost:5000/userGroups/getAllNewMembers/${groupId}`);

        // console.log("Res from the getAllNewMembersToAdd fn : ",response.data);

        dispatch(setAllNewMembers((response.data.newMembersToAdd)));

        

    }catch(err) {
       
        console.log("Err occured while fetching new members : ",err);

    }
}

export const getAllNewAdminsToAdd = () => async(dispatch,getState) =>{

try {

  const group = JSON.parse(localStorage.getItem("group"));

  const groupId = group.id;

  const response = await axios.get(`http://localhost:5000/userGroups/getAllAdminsToAdd/${groupId}`);

   const arr1 = response.data.newAdminsToAdd;

   console.log("Arr1 is : ",arr1);

   const arr2 = getState().userGroupCreation.allNewMembers;

   console.log("Arr2 is : ",arr2);

   const arr = [...arr1,...arr2];

   console.log("arr is :",arr);

   dispatch(setAllNewAdmins(arr));





} catch(err) {

}

}


export const addNewMembersToTheGroup = (newMembersData) => async (dispatch) => {

try {

  
  const user = JSON.stringify(localStorage.getItem("user"));

  const token = user.token;

  const headers = {

      "Content-Type" : "application/json",
      Authorization : token,
  }

  const response = await axios.post("http://localhost:5000/userGroups/addNewUsersToUserGroups",{newMembersData},{headers});

  console.log("Group created successfully : ", response.data);


} catch (err) {
    
  console.log(err);
  console.log("Error creating group : ",err);

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