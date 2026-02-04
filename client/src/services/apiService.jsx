import axios from "axios";
import { isDemo, demoDB } from "./demoService";


const apiInstance = axios.create({
  baseURL: "http://localhost:8000/api"
});


/* ========================================
   GLOBAL DEMO INTERCEPTOR
   Custom adapter for demo mode
======================================== */

const demoAdapter = (config) => {
  return new Promise((resolve) => {
    const url = config.url || "";
    const method = config.method || "get";

    console.log("Demo mode:", method.toUpperCase(), url);

    let responseData = [];

    /* ========================================
       AUTHENTICATION
    ======================================== */
    if (url.includes("/login")) {
      responseData = {
        token: "demo-token-123",
        user_id: 1,
        username: "Demo Host",
        email: "demo@gmail.com"
      };
    }
    else if (url.includes("/register")) {
      responseData = { message: "Registration successful (demo mode)" };
    }
    else if (url.includes("/user/")) {
      const userId = parseInt(url.split("/user/")[1]);
      const user = demoDB.users.find(u => u.user_id === userId);
      responseData = user || demoDB.users[0];
    }

    /* ========================================
       USERS
    ======================================== */
    else if (url.includes("/users")) {
      responseData = demoDB.users;
    }

    /* ========================================
       MEETINGS
    ======================================== */
    else if (url.includes("/nextmid")) {
      responseData = { nextMid: demoDB.nextMid };
    }
    else if (url.includes("/newmeeting")) {
      const newMeeting = { ...config.data, meetingid: demoDB.nextMid, mid: demoDB.nextMid };
      demoDB.meetings.push(newMeeting);
      demoDB.nextMid++;
      responseData = newMeeting;
    }
    else if (url.includes("/meetings/")) {
      // Handle POST /meetings/:slug to filter meetings
      const slug = url.split("/meetings/")[1];
      let filtered = demoDB.meetings;
      
      if (slug === "upcoming") {
        filtered = demoDB.meetings.filter(m => m.status === "upcoming");
      } else if (slug === "completed") {
        filtered = demoDB.meetings.filter(m => m.status === "completed");
      } else if (slug === "mymeeting") {
        const userId = config.data?.userId || 1;
        filtered = demoDB.meetings.filter(m => m.host === userId);
      }
      
      responseData = filtered;
    }
    else if (url.includes("/meeting/") && url.includes("/details")) {
      responseData = demoDB.meetings[0];
    }
    else if (url.includes("/endMeeting")) {
      responseData = { message: "Meeting completed" };
    }
    else if (url.includes("/updatemeetingdetails/")) {
      responseData = { message: "Meeting updated" };
    }

    /* ========================================
       MINUTES
    ======================================== */
    else if (url.includes("/taskminutes")) {
      responseData = demoDB.minutes.filter(m => m.istask === 1);
    }
    else if (url.includes("/minutes")) {
      if (method === "post") {
        const newMinute = { ...config.data, minuteid: demoDB.minutes.length + 1 };
        demoDB.minutes.push(newMinute);
        responseData = newMinute;
      }
      else if (method === "delete") {
        responseData = { message: "Minute deleted" };
      }
      else if (method === "put") {
        responseData = { message: "Minute updated" };
      }
      else if (url.includes("/minutes/") && url.split("/minutes/")[1]) {
        responseData = demoDB.minutes[0];
      }
      else {
        responseData = demoDB.minutes;
      }
    }

    /* ========================================
       TASKS
    ======================================== */
    else if (url.includes("/alltasks")) {
      responseData = demoDB.tasks;
    }
    else if (url.includes("/notassigned")) {
      responseData = demoDB.minutes.filter(m => m.istask === 1);
    }
    else if (url.includes("/tobediscussed")) {
      responseData = demoDB.tasks;
    }
    else if (url.includes("/mytasks/")) {
      const userId = parseInt(url.split("/mytasks/")[1]);
      responseData = demoDB.tasks.filter(t => t.assignto_id === userId);
    }
    else if (url.includes("/assignedtasks/")) {
      const userId = parseInt(url.split("/assignedtasks/")[1]);
      responseData = demoDB.tasks.filter(t => t.assignby_id === userId);
    }
    else if (url.includes("/updatemytask")) {
      responseData = { message: "Task updated" };
    }
    else if (url.includes("/updateassignedtask")) {
      responseData = { message: "Task updated" };
    }
    else if (url.includes("/tasks")) {
      if (method === "post") {
        const newTask = { ...config.data, taskid: demoDB.tasks.length + 1 };
        demoDB.tasks.push(newTask);
        responseData = newTask;
      }
      else if (method === "delete") {
        responseData = { message: "Task deleted" };
      }
      else if (method === "put") {
        responseData = { message: "Task updated" };
      }
      else {
        responseData = demoDB.tasks;
      }
    }

    /* ========================================
       MEMBERS & ATTENDANCE
    ======================================== */
    else if (url.includes("/members")) {
      responseData = demoDB.users;
    }
    else if (url.includes("/attendance")) {
      responseData = { message: "Attendance updated" };
    }

    /* ========================================
       MESSAGES
    ======================================== */
    else if (url.includes("/getRoomByMeeting/")) {
      const meetingId = parseInt(url.split("/getRoomByMeeting/")[1]);
      const meeting = demoDB.meetings.find(m => m.meetingid === meetingId);
      responseData = {
        roomId: meeting?.mid || 1,
        mid: meeting?.mid || 1,
        title: meeting?.title || "Demo Room"
      };
    }
    else if (url.includes("/message/room/")) {
      const roomId = parseInt(url.split("/message/room/")[1]);
      responseData = demoDB.messages.filter(m => m.room_id === roomId);
    }
    else if (url.includes("/message/rooms")) {
      responseData = demoDB.meetings.map(m => ({
        room_id: m.mid,
        title: m.title
      }));
    }
    else if (url.includes("/message")) {
      responseData = demoDB.messages;
    }

    /* ========================================
       GOOGLE MEET
    ======================================== */
    else if (url.includes("/google/generate-meet")) {
      responseData = { meetLink: "https://meet.google.com/demo-link" };
    }

    /* ========================================
       REPORTS
    ======================================== */
    else if (url.includes("/report/") && method === "post") {
      // Generate a new report
      const meetingId = parseInt(url.split("/report/")[1].split("/")[0]);
      const newReport = {
        reportid: demoDB.reports.length + 1,
        mid: meetingId,
        ...config.data,
        created_at: new Date().toISOString()
      };
      demoDB.reports.push(newReport);
      responseData = newReport;
    }
    else if (url.includes("/report/") && method === "get") {
      // Get report for a specific meeting
      const meetingId = parseInt(url.split("/report/")[1]);
      const report = demoDB.reports.find(r => r.mid === meetingId);
      responseData = report || { message: "No report found" };
    }
    else if (url.includes("/reports") && method === "get") {
      // Get all reports
      responseData = demoDB.reports;
    }
    else if (url.includes("/report/") && method === "put") {
      // Update a report
      responseData = { message: "Report updated" };
    }
    else if (url.includes("/report/") && method === "delete") {
      // Delete a report
      responseData = { message: "Report deleted" };
    }

    setTimeout(() => {
      resolve({
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      });
    }, 100); 
  });
};

// Use custom adapter in demo mode
apiInstance.interceptors.request.use((config) => {
  if (isDemo()) {
    config.adapter = demoAdapter;
  }
  return config;
});


export default apiInstance;
