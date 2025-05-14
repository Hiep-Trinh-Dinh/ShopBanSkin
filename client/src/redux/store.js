import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slides/user-slide";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
