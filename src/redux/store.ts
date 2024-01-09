import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import itemReducer from './item';

export default configureStore({
    reducer: {
        authReducer,
        itemReducer
    },
    devTools: false
});
