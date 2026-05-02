import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskAPI } from '../../api/services';

// ─── Async Thunks ───────────────────────────────────────────

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async ({ projectId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getAll(projectId, params);
      return response.data.data.tasks;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch tasks'
      );
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.create(projectId, data);
      return response.data.data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create task'
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.update(id, data);
      return response.data.data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update task'
      );
    }
  }
);

export const toggleTask = createAsyncThunk(
  'tasks/toggle',
  async (id, { rejectWithValue }) => {
    try {
      const response = await taskAPI.toggle(id);
      return response.data.data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to toggle task'
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await taskAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete task'
      );
    }
  }
);

// ─── Slice ──────────────────────────────────────────────────

const initialState = {
  items: [],
  loading: false,
  error: null,
  filter: 'all', // all, pending, completed
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    setTaskFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearTasks: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle
      .addCase(toggleTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTaskError, setTaskFilter, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
