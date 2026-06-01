import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAddUserMutation } from "../api/userApi";

const initialState = {
  uid: "",
  name: "",
  email: "",
  photoURL: "",
  role: "buyer",
  isLoading: false,
  isError: false,
  error: "",
};

// Create User with Firebase Authentication
export const createUser = createAsyncThunk(
  "userSlice/createUser",
  async ({ email, password, name, photoURL }, { rejectWithValue }) => {
    try {
      const userData = {
        email,
        password,
        name,
        photoURL,
        role: "buyer",
        AuctionsWon: 0,
        ActiveBids: 0,
        TotalSpent: 0,
        accountBalance: 0,
        BiddingHistory: [],
        onGoingBid: 0,
        Location: "",
        memberSince: new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        recentActivity: [],
        watchingNow: [],
        cover: "",
      };
      
      const { data } = await addUser(userData);
      
      return {
        uid: data._id,
        email: data.email,
        name: data.name,
        photoURL: data.photoURL,
        role: data.role || "buyer",
      };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.uid = payload.uid;
      state.name = payload.name;
      state.email = payload.email;
      state.photoURL = payload.photoURL;
      state.role = payload.role;
    },
    toggleLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    logout: (state) => {
      state.uid = "";
      state.name = "";
      state.email = "";
      state.photoURL = "";
      state.role = "buyer";
    },
    setErrorMessage: (state, { payload }) => {
      state.isError = true;
      state.error = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        console.log("Creating user...");
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        console.log("User created successfully:", payload);
        state.isLoading = false;
        state.isError = false;
        state.uid = payload.uid;
        state.email = payload.email;
        state.name = payload.name;
        state.photoURL = payload.photoURL;
        state.role = payload.role;
        state.error = "";
      })
      .addCase(createUser.rejected, (state, action) => {
        console.log("Registration failed:", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const { setUser, toggleLoading, logout, setErrorMessage } =
  userSlice.actions;
export default userSlice.reducer;
