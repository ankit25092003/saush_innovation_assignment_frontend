import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../api/services';

// ─── Async Thunks ───────────────────────────────────────────

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData);
      const { token, user } = response.data.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Signup failed'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Login failed'
      );
    }
  }
);

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.sendOTP(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to send OTP'
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOTP({ email, otp });
      const { token, user } = response.data.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'OTP verification failed'
      );
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      if (token && userStr) {
        // Verify token is still valid
        const response = await authAPI.getMe();
        return { token, user: response.data.data.user };
      }
      return null;
    } catch (error) {
      await AsyncStorage.multiRemove(['token', 'user']);
      return null;
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.multiRemove(['token', 'user']);
  return null;
});

// ─── Slice ──────────────────────────────────────────────────

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  initialLoading: true,
  error: null,
  otpSent: false,
  otpVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOTPState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.otpVerified = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.initialLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.initialLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadUser.rejected, (state) => {
        state.initialLoading = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.otpSent = false;
        state.otpVerified = false;
      });
  },
});

export const { clearError, resetOTPState } = authSlice.actions;
export default authSlice.reducer;
