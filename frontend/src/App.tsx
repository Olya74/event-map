import { Routes, Route} from "react-router-dom";
import {EventEdit} from "./app/services/events/components/EventEdit.tsx";
import Layout from "./components/layout/Layout.tsx";
import Profile from "./pages/profile/Profile.tsx";
import RequireAuth from "./app/features/auth/RequireAuth.tsx";
import LoginPage from "./components/login/LoginPage.tsx";
import RegisterPage from "./components/register/RegisterPage.tsx";
import MapPage from "./components/map/MapPage.tsx";
import { useAppDispatch } from "./app/hooks/hooks.ts";
import { useEffect } from "react";
import { useRefreshQuery } from "./app/features/auth/authApiSlice.ts";
import { setCredentials} from "./app/features/auth/authSlice.ts";
import CreateEvent from "./app/services/events/components/CreateEvent.tsx";
import ActivateSuccess from "./pages/ActivateSuccess.tsx";
import EventsContainer from "./app/services/events/components/EventsContainer.tsx";
import WelcomePage from "./pages/WelcomePage.tsx";




const App = () => {
const dispatch = useAppDispatch();
const { refetch: refresh } = useRefreshQuery();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
      const data=  await refresh().unwrap();
      dispatch(setCredentials({
        user: data.userData.user,
        accessToken: data.userData.accessToken,
      }));
      } catch (error) {
        // Handle error if needed
      }
    };

    checkAuthentication();
  }, [dispatch]);
  
  return (
  <Routes>
    <Route path="/" element={<Layout />}>
    {/* public routes */}
    <Route index element={<WelcomePage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/activate-success" element={<ActivateSuccess />} />
    <Route path="/login" element={<LoginPage />} />
     <Route path="/map" element={<MapPage />} /> 
    <Route path="/events" element={<EventsContainer />} />
    
          <Route path="/events/:id/media" element={<h4>Media</h4>} />
          <Route path="/events/:id/media/:mediaId" element={<h4>Media Detail</h4>} />
          {/* protected routes */}
          <Route element={<RequireAuth />}>
         <Route path="profile" element={<Profile />} />
           <Route path="/events/:id/event-edit/" element={<EventEdit />} />
           <Route path="/events/create-event" element={<CreateEvent />} />
          </Route>
          <Route path="*" element={<h1>404 Not Found</h1>} />
          </Route>
        </Routes>
)
  
}

export default App



