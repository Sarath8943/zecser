
import "../src/styles/App.css";
import {BrowserRouter } from  "react-router-dom";
import AppRoutes from "./router/Router";
import { ToastContainer } from "react-toastify";


function App() {

  return (
  <>
  <ToastContainer autoClose={1500}/>
<BrowserRouter>
    <AppRoutes/>
</BrowserRouter>
  
  
  </>
  )
}

export default App
