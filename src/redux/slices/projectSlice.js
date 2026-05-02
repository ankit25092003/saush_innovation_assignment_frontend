import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectAPI } from '../../api/services';

// ─── Async Thunks ───────────────────────────────────────────

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await projectAPI.getAll(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch projects'
      );
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectAPI.getOne(id);
      return response.data.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch project'
      );
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await projectAPI.create(data);
      return response.data.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create project'
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await projectAPI.update(id, data);
      return response.data.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update project'
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, { rejectWithValue }) => {
    try {
      await projectAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete project'
      );
    }
  }
);

// ─── Slice ──────────────────────────────────────────────────

const initialState = {
  items: [],
  selectedProject: null,
  pagination: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.projects;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch One
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
        if (state.selectedProject?.id === action.payload) {
          state.selectedProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectError, setSelectedProject, clearSelectedProject } =
  projectSlice.actions;
export default projectSlice.reducer;
