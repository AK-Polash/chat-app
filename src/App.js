import React from "react";
import Registration from "./pages/registration/Registration";
import Login from "./pages/login/Login";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

let router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Registration />} />
      <Route path="/login" element={<Login />} />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
