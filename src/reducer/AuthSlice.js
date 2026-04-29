import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import api from "../Store/Api";
export const login = createAsyncThunk(
  "login",
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", userInput);
      console.log("response", response);
      
      if (response?.data?.status_code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response?.data || "Login failed");
      }

    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

const initialState={
    loading:false,
    error:false,    
}
const AuthSlice=createSlice(
    {
        name:"auth",
        reducers:{},
        initialState,
        extraReducers:(builder)=>{
            builder
            .addCase(login.pending,(state)=>{
                state.loading=true
            })
            .addCase(login.fulfilled,(state,{payload})=>{
                state.loading=false
                console.log("payload",payload);
                sessionStorage.setItem("tour_token",JSON.stringify({token:payload?.token}))
                
            })
            .addCase(login.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
        }
    }
)
export default AuthSlice.reducer;