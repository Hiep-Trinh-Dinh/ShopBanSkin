import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.jsx';


const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
    <BrowserRouter>
      <App/> 
    </BrowserRouter>
  </Provider>
  </QueryClientProvider>
);