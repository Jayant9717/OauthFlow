import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import DisplayData from "./components/DisplayData";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/contacts" element={<DisplayData />} />
      </Routes>
    </>
  );
}

export default App;
