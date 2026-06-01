import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useLoginMutation, useLogoutMutation, useRefreshMutation } from "../api/auth/authApi";
import { useAddUserMutation } from "../api/userApi";

const initialState = {
  loading: false,
  errorMessage: "",
  dbUser: null,
};

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await useLoginMutation({ email, password });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useLogoutMutation();
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Create user
export const createUser = createAsyncThunk(
  "auth/createUser",
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
      
      const { data } = await useAddUserMutation(userData);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Refresh access token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useRefreshMutation();
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = "";
    },
    setDbUser: (state, { payload }) => {
      state.dbUser = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { setErrorMessage, clearErrorMessage, setDbUser } = authSlice.actions;
export default authSlice.reducer;
