import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        name: 'Tester'
    },
    reducers: {
        setName: (state: any, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setSignupData: (state: any, action: PayloadAction<string>) => {
            state.name = action.payload;
        }
    }
});

export const { setName, setSignupData } = authSlice.actions;

export default authSlice.reducer;
