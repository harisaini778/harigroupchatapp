import {configureStore} from "@reduxjs/toolkit";

import userGroupReducer from "./userStore";

import groupSliceReducer from "./groupStore";



const store =  configureStore({
    reducer : {
        userGroup : userGroupReducer,
        userGroupCreation : groupSliceReducer,
    }
});

export default store;