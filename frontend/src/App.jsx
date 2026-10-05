import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import AddStudent from "./Pages/AddStudent";
import EditStudent from "./Pages/EditStudent";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />

                <Route
                    path="/add-student"
                    element={<AddStudent />}
                />

                <Route
                    path="/edit-student/:id"
                    element={<EditStudent />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;