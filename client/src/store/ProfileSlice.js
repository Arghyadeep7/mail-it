import { createSlice } from "@reduxjs/toolkit";

const initialState={
    fname:"",
    lname:"",
    username:"",
    num:"",
    loggedIn:false,
};

const ProfileSlice=createSlice({
    name:'profile',
    initialState:initialState,
    reducers:{
        setLogin(state,action){
            state.loggedIn=true;
            state.fname=action.payload.fname;
            state.lname=action.payload.lname;
            state.num=action.payload.num;
            state.username=action.payload.username;
        },
        setLogout(state){
            state.loggedIn=false;
            state.fname=state.lname=state.num=state.username="";
        }
    }
});

export const {setLogin, setLogout}=ProfileSlice.actions;

export default ProfileSlice.reducer;