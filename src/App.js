import React from "react";
import "./App.css";
import ImageCompressor from "./components/ImageCompressor";
import Navbar from "./components/Navbar/index";


function App() {
  return (
    <div >
      <Navbar />
      {/* <div className="main_container"> */}
        <ImageCompressor />
      {/* </div> */}
    </div>
  );
}

export default App;
