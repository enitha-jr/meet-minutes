import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import "../styles/Calendar.css";
import { useSelector } from "react-redux";
import services from "../services/services";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

function MyCalendar() {
    const [events, setEvents] = useState([]);
    const userData = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                if (!userData?.user_id) return;

                const meetings = await services.getMeetingsByUser(userData.user_id);

                if (!Array.isArray(meetings)) return;

                const mappedEvents = meetings.map((meeting) => {
                    if (!meeting.date || !meeting.time) return null;

                    const [year, month, day] = meeting.date.split("T")[0].split("-");
                    const [hours, minutes, seconds] = meeting.time.split(":");

                    const start = new Date(
                        year,
                        month - 1,
                        day,
                        hours,
                        minutes,
                        seconds
                    );

                    const end = new Date(start);
                    end.setHours(start.getHours() + 1);

                    return {
                        meetingid: meeting.meetingid,
                        title: meeting.title,
                        start,
                        end,
                        host: meeting.host, // or meeting.host_name
                        className:
                            userData.user_id === meeting.host
                                ? "event-host"
                                : "event-default",
                    };
                }).filter(Boolean);

                setEvents(mappedEvents);
            } catch (error) {
                console.error("Error fetching meeting details:", error);
            }
        };

        fetchMeetings();
    }, [userData.user_id]);

    const handleSelectEvent = (event) => {
        console.log("Selected Event:", event);
    };

    const eventPropGetter = (event) => {
        return {
            className:
                userData.user_id === event.host
                    ? "event-host"
                    : "event-default",
        };
    };

    return (
        <div className="calendar-content">
            <Calendar
                views={["day", "month", "agenda"]}
                selectable
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                events={events}
                style={{ height: "90vh" }}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventPropGetter}
            />
        </div>
    );
}

export default MyCalendar;
