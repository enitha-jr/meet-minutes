import { Navigate } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Template from "../pages/Template";
import ProtectedRoute from "./ProtectedRoutes";
/* ---------------------------------------------------- */
import NewMeeting from "../pages/NewMeeting";
import Meetings from "../pages/Meetings";
import Tasks from "../pages/Tasks";
import MyCalendar from "../pages/Calendar";
/* ---------------------------------------------------- */
import Meetinfo from "../pages/Meetinfo/Meetinfo";
import MeetDetails from "../pages/Meetinfo/MeetDetails";
import UpdateMeetDetails from "../pages/Meetinfo/UpdateMeetDetails";
import Minutes from "../pages/Meetinfo/Minutes";
import UpdateMinutes from "../pages/Meetinfo/UpdateMinutes";
import MeetTasks from "../pages/Meetinfo/MeetTasks";
import Attendance from "../pages/Meetinfo/Attendance";
import Report from "../pages/Meetinfo/Report";
import TobeDiscussed from "../pages/Meetinfo/ToBeDiscussed";
import ChatWindow from "../pages/Meetinfo/ChatWindow";

/* --------------------------------------------------- */
import MyTasks from "../pages/Tasks/MyTasks";
import AssignedTasks from "../pages/Tasks/AssignedTasks";
/* ---------------------------------------------------- */

const routes = [
    {
        path: '/',
        element:
            <ProtectedRoute>
                <Template />
            </ProtectedRoute>,
        children: [
            {
                path: '',
                element: <Navigate to="meetings" />
            },
            {
                path: 'newmeeting',
                element: <NewMeeting />
            },
            {
                path: 'meetings',
                children: [
                    { path: '', element: <Navigate to="upcoming" /> },
                    { path: ":slug", element: <Meetings /> },  // Upcoming, Completed, Mymeeting
                ]
            },
            {
                path: 'meeting/:meetingid',
                element: <Meetinfo />,
                children: [
                    { path: '', element: <Navigate to="details" /> },
                    { path: 'details', element: <MeetDetails/> },
                    { path: 'minutes', element: <Minutes/> },
                    { path: 'tasks', element: <MeetTasks/> },
                    { path: 'attendance', element: <Attendance/> },
                    { path: 'report', element: <Report/> },
                    { path: 'tobediscussed', element: <TobeDiscussed/> },
                ]
            },
            {
                path: 'updatemeetingdetails/:meetingid',
                element: <UpdateMeetDetails />,
            },
            {
                path: ':meetingid/updateminutes/:minuteid',
                element: <UpdateMinutes />,
            },
            {
                path: 'tasks',
                element: <Tasks />,
                children: [
                    { path: '', element: <Navigate to="mytasks" /> },
                    { path: 'mytasks', element: <MyTasks/> },
                    { path: 'assignedtasks', element: <AssignedTasks/> },

                ]
            },
            {
                path: 'meeting/:meetingid/chat',
                element: <ChatWindow />,
            },
            {
                path: 'calendar',
                element: <MyCalendar />
            },
        ]
    },
    {
        path: '/login',
        element: <Landing />
    },
    {
        path: '/signup',
        element: <Landing />
    }

]

export default routes;