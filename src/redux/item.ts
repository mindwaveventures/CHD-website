import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const itemSlice = createSlice({
    name: 'item',
    initialState: {
        created: false
    },
    reducers: {
        itemCreated: (state: any, action: PayloadAction<boolean>) => {
            state.created = action.payload;
        }
    }
});

export const { itemCreated } = itemSlice.actions;

export default itemSlice.reducer;
