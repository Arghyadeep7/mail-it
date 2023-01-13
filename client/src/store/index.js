import {configureStore, combineReducers} from '@reduxjs/toolkit';
import { persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER, } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import profileReducer from "./ProfileSlice";

const persistConfig = {
    key: 'root',
    storage,
};

const reducer=combineReducers({
    profile: profileReducer
})

const persistedReducer=persistReducer(persistConfig,reducer);

const store=configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          }
    }),
});

export default store;