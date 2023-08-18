import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootSlice';

export default configureStore({
    reducer: {
        root: rootReducer,
    },
});
