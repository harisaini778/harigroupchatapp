import {configureStore} from "@reduxjs/toolkit";

import userGroupReducer from "./userStore";

const store =  configureStore({
    reducer : {
        userGroup : userGroupReducer,
    }
});

export default store;