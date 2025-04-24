import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../../services/authService';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signupLoading: boolean;
  signupError: string | null;
  activationLoading: boolean;
  activationError: string | null;
  activationSuccess: boolean;
  resetPasswordLoading: boolean;
  resetPasswordError: string | null;
  resetPasswordSuccess: boolean;
}

const loadInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return {
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token,
    token: token,
    loading: false,
    error: null,
    signupLoading: false,
    signupError: null,
    activationLoading: false,
    activationError: null,
    activationSuccess: false,
    resetPasswordLoading: false,
    resetPasswordError: null,
    resetPasswordSuccess: false,
  };
};

const initialState: AuthState = loadInitialState();

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { dispatch }) => {
    try {
      dispatch(loginStart());
      const response = await authService.login({ email, password });
      dispatch(loginSuccess({ token: response.access }));
      
      // Fetch complete user profile
      const userData = await authService.getUserProfile(response.access);
      dispatch(setUser({
        ...userData,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&background=random`,
      }));
      
      return response.access;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Login failed';
      dispatch(loginFailure(message));
      throw new Error(message);
    }
  }
);

interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  re_password: string;
}

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: SignupData, { dispatch }) => {
    try {
      dispatch(signupStart());
      const response = await authService.signup({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        re_password: data.password,
      });
      dispatch(signupSuccess());
      return response;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Signup failed';
      dispatch(signupFailure(message));
      throw new Error(message);
    }
  }
);

// Activate user account
export const activate = createAsyncThunk(
  "auth/activate",
  async ({ uid, token }: { uid: string; token: string }, { dispatch }) => {
    try {
      dispatch(activationStart());
      const response = await authService.activate({ uid, token });
      dispatch(activationSuccess());
      return response;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Activation failed';
      dispatch(activationFailure(message));
      throw new Error(message);
    }
  }
);

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (token: string, { dispatch }) => {
    try {
      const userData = await authService.getUserProfile(token);
      dispatch(setUser(userData));
      return userData;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to fetch user profile';
      throw new Error(message);
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(resetPasswordStart());
      await authService.resetPassword({ email });
      dispatch(resetPasswordSuccess());
      return true;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to send reset password email';
      dispatch(resetPasswordFailure(message));
      return rejectWithValue(message);
    }
  }
);

interface ResetPasswordConfirmData {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
}

export const resetPasswordConfirm = createAsyncThunk(
  'auth/resetPasswordConfirm',
  async (data: ResetPasswordConfirmData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(resetPasswordStart());
      await authService.resetPasswordConfirm(data);
      dispatch(resetPasswordSuccess());
      return true;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to reset password';
      dispatch(resetPasswordFailure(message));
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    signupStart: (state) => {
      state.signupLoading = true;
      state.signupError = null;
    },
    signupSuccess: (state) => {
      state.signupLoading = false;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.signupLoading = false;
      state.signupError = action.payload;
    },
    activationStart: (state) => {
      state.activationLoading = true;
      state.activationError = null;
      state.activationSuccess = false;
    },
    activationSuccess: (state) => {
      state.activationLoading = false;
      state.activationSuccess = true;
    },
    activationFailure: (state, action: PayloadAction<string>) => {
      state.activationLoading = false;
      state.activationError = action.payload;
      state.activationSuccess = false;
    },
    resetPasswordStart: (state) => {
      state.resetPasswordLoading = true;
      state.resetPasswordError = null;
      state.resetPasswordSuccess = false;
    },
    resetPasswordSuccess: (state) => {
      state.resetPasswordLoading = false;
      state.resetPasswordSuccess = true;
    },
    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.resetPasswordLoading = false;
      state.resetPasswordError = action.payload;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  setUser, 
  logout, 
  signupStart, 
  signupSuccess, 
  signupFailure, 
  activationStart, 
  activationSuccess, 
  activationFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
} = authSlice.actions;
export default authSlice.reducer;
