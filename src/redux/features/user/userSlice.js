import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import auth from "../../../firebase/firebase.init";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const initialState = {
  uid: "",
  name: "",
  email: "",
  photoURL: "",
  role: "buyer", 
  isLoading: true,
  isError: false,
  error: "",
};

// create async thunk
export const createUser = createAsyncThunk(
  "userSlice/createUser",
  async ({ email, password, name, photoURL }) => {
    const data = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
    return {
      uid: data.user.uid,
      email: data.user.email,
      name: data.user.displayName,
      photoURL: data.user.photoURL,
      role: "buyer",
    };
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.uid = "";
        state.email = "";
        state.name = "";
        state.photoURL = "";
        state.role = "buyer";
        state.error = "";
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
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
        state.isLoading = false;
        state.isError = true;
        state.uid = "";
        state.email = "";
        state.name = "";
        state.photoURL = "";
        state.role = "buyer";
        state.error = action.error.message;
      });
  },
});

export const { setUser, toggleLoading, logout } = userSlice.actions;

export default userSlice.reducer;
