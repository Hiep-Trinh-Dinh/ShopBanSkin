import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slides/user-Slide";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
