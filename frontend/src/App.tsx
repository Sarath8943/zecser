
import "../src/styles/App.css";
import {BrowserRouter } from  "react-router-dom";
import AppRoutes from "./router/Router";


function App() {

  return (
  <>
<BrowserRouter>
    <AppRoutes/>
</BrowserRouter>
  
  
  </>
  )
}

export default App
