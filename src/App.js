import React from "react";
import Registration from "./pages/registration/Registration";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Message from "./pages/message/Message";
import Notification from "./pages/notification/Notification";
import Settings from "./pages/settings/Settings";
import NoMatch from "./components/NoMatch";

let router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Registration />} />
      <Route path="login" element={<Login />} />
      <Route path="/" element={<RootLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="message" element={<Message />} />
        <Route path="notification" element={<Notification />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
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
