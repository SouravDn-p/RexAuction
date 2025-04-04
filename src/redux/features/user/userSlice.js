import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import auth from "../../../firebase/firebase.init";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

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
      const data = await createUserWithEmailAndPassword(auth, email, password);

      // Update user profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      // Fetch updated user data
      const updatedUser = auth.currentUser;

      return {
        uid: updatedUser.uid,
        email: updatedUser.email,
        name: updatedUser.displayName,
        photoURL: updatedUser.photoURL,
        role: "buyer",
      };
    } catch (err) {
      return rejectWithValue(err.message);
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
