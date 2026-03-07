import axios from "axios";
import { isDemo, demoDB } from "./demoService";

const apiInstance = axios.create({
  baseURL: "http://localhost:8000/api"
});

const parseData = (raw) => {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
};

const normalizeMeetingDetails = (meeting) => {
  const host = demoDB.users.find((u) => u.user_id === meeting.host) || null;
  const minutetaker = demoDB.users.find((u) => u.user_id === meeting.minutetaker) || null;
  const memberIds = Array.isArray(meeting.members) ? meeting.members : [];
  const members = memberIds
    .map((id) => demoDB.users.find((u) => u.user_id === id))
    .filter(Boolean);

  return {
    ...meeting,
    host,
    minutetaker,
    members
  };
};

const isMeetingParticipant = (meeting, userId) => {
  const memberIds = Array.isArray(meeting.members) ? meeting.members : [];
  return meeting.host === userId || meeting.minutetaker === userId || memberIds.includes(userId);
};

const getTasksByMeeting = (meetingId) => {
  return demoDB.tasks.filter((t) => t.meetingid === meetingId);
};

/* ========================================
   DEMO MODE ADAPTER
   Returns mock data for standalone deployment
======================================== */

const demoAdapter = (config) => {
  return new Promise((resolve) => {
    const url = config.url || "";
    const method = config.method || "get";
    const payload = parseData(config.data);

    console.log("Demo mode:", method.toUpperCase(), url);

    let responseData = [];

    /* ========================================
       AUTHENTICATION
    ======================================== */
    if (url.includes("/login")) {
      responseData = {
        token: "test1-demo-token",
        user_id: demoDB.demoUser.user_id,
        username: demoDB.demoUser.username,
        email: demoDB.demoUser.email,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      };
    }
    else if (url.includes("/register")) {
      responseData = { message: "Demo mode: registration successful" };
    }
    else if (url.includes("/user/")) {
      const userId = parseInt(url.split("/user/")[1]);
      const user = demoDB.users.find(u => u.user_id === userId);
      responseData = user || demoDB.demoUser;
    }
    else if (url.includes("/users")) {
      responseData = demoDB.users;
    }

    /* ========================================
       MEETINGS
    ======================================== */
    else if (url.includes("/nextmid")) {
      responseData = { nextmid: demoDB.nextIds.nextMid };
    }
    else if (url.includes("/newmeeting")) {
      const newMeeting = {
        ...payload,
        meetingid: demoDB.nextIds.nextMeetingId,
        mid: payload.followup === "yes" ? payload.mid : demoDB.nextIds.nextMid,
        status: "ongoing",
        host_name: demoDB.users.find((u) => u.user_id === payload.host)?.username || "test1",
        minutetaker_name: demoDB.users.find((u) => u.user_id === payload.minutetaker)?.username || "test1"
      };
      demoDB.meetings.push(newMeeting);
      demoDB.nextIds.nextMeetingId++;
      if (payload.followup !== "yes") {
        demoDB.nextIds.nextMid++;
      }
      responseData = newMeeting;
    }
    else if (url.includes("/meetings/") && method === "post") {
      const slug = url.split("/meetings/")[1];
      const userId = payload?.userId || demoDB.demoUser.user_id;
      let filtered = demoDB.meetings.filter((m) => isMeetingParticipant(m, userId));

      if (slug === "upcoming") {
        filtered = filtered.filter((m) => m.status !== "completed");
      } else if (slug === "completed") {
        filtered = filtered.filter((m) => m.status === "completed");
      } else if (slug === "mymeeting") {
        filtered = demoDB.meetings.filter((m) => m.host === userId);
      }

      responseData = filtered;
    }
    else if (url.match(/\/meetings\/\d+$/) && method === "get") {
      const userId = parseInt(url.split("/meetings/")[1], 10);
      responseData = demoDB.meetings.filter((m) => isMeetingParticipant(m, userId));
    }
    else if (url.match(/\/meeting\/\d+\/details/)) {
      const meetingId = parseInt(url.split("/meeting/")[1].split("/")[0]);
      const meeting = demoDB.meetings.find(m => m.meetingid === meetingId);
      responseData = meeting ? normalizeMeetingDetails(meeting) : normalizeMeetingDetails(demoDB.meetings[0]);
    }
    else if (url.includes("/endMeeting")) {
      const meetingId = parseInt(url.split("/")[1]);
      const meeting = demoDB.meetings.find(m => m.meetingid === meetingId);
      if (meeting) meeting.status = "completed";
      responseData = { message: "Meeting ended" };
    }
    else if (url.includes("/updatemeetingdetails/")) {
      const meetingId = parseInt(url.split("/updatemeetingdetails/")[1], 10);
      const meeting = demoDB.meetings.find((m) => m.meetingid === meetingId);
      if (meeting) {
        const updated = {
          ...meeting,
          ...payload,
          host: payload.host?.user_id || meeting.host,
          minutetaker: payload.minutetaker?.user_id || meeting.minutetaker,
          members: Array.isArray(payload.members) ? payload.members.map((m) => m.user_id ?? m) : meeting.members
        };
        updated.host_name = demoDB.users.find((u) => u.user_id === updated.host)?.username || "test1";
        updated.minutetaker_name = demoDB.users.find((u) => u.user_id === updated.minutetaker)?.username || "test1";
        Object.assign(meeting, updated);
      }
      responseData = { message: "Meeting updated" };
    }

    /* ========================================
       MINUTES
    ======================================== */
    else if (url.includes("/taskminutes")) {
      const meetingId = parseInt(url.split("/")[1]);
      responseData = demoDB.minutes.filter(m => m.meetingid === meetingId && m.istask === 1);
    }
    else if (url.match(/\/\d+\/minutes$/)) {
      const meetingId = parseInt(url.split("/")[1]);
      if (method === "post") {
        const newMinute = {
          ...config.data,
          minuteid: demoDB.nextIds.nextMinuteId++,
          meetingid: meetingId
        };
        demoDB.minutes.push(newMinute);
        responseData = newMinute;
      } else {
        responseData = demoDB.minutes.filter(m => m.meetingid === meetingId);
      }
    }
    else if (url.match(/\/\d+\/minutes\/\d+/)) {
      const minuteId = parseInt(url.split("/minutes/")[1]);
      if (method === "delete") {
        const index = demoDB.minutes.findIndex(m => m.minuteid === minuteId);
        if (index > -1) demoDB.minutes.splice(index, 1);
        responseData = { message: "Minute deleted" };
      } else if (method === "put") {
        const minute = demoDB.minutes.find(m => m.minuteid === minuteId);
        if (minute) Object.assign(minute, config.data);
        responseData = { message: "Minute updated" };
      } else {
        responseData = demoDB.minutes.find(m => m.minuteid === minuteId) || {};
      }
    }

    /* ========================================
       TASKS
    ======================================== */
    else if (url.includes("/mytasks/")) {
      const userId = parseInt(url.split("/mytasks/")[1]);
      responseData = demoDB.tasks
        .filter((t) => t.assignto_id === userId)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    else if (url.includes("/assignedtasks/")) {
      const userId = parseInt(url.split("/assignedtasks/")[1]);
      responseData = demoDB.tasks
        .filter((t) => t.assignby_id === userId)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    else if (url.includes("/updatemytask")) {
      const taskId = payload?.taskid;
      const task = demoDB.tasks.find(t => t.taskid === taskId);
      if (task) {
        task.status = task.status === "assigned" ? "pending" : "assigned";
      }
      responseData = { message: "Task updated" };
    }
    else if (url.includes("/updateassignedtask")) {
      const taskId = payload?.taskid;
      const task = demoDB.tasks.find(t => t.taskid === taskId);
      if (task) {
        task.status = task.status === "pending" ? "completed" : "pending";
      }
      responseData = { message: "Task updated" };
    }
    else if (url.match(/\/\d+\/tasks$/)) {
      const meetingId = parseInt(url.split("/")[1]);
      if (method === "post") {
        const newTask = {
          ...payload,
          taskid: demoDB.nextIds.nextTaskId++,
          meetingid: meetingId,
          description: payload.desc || payload.description || "",
          assignby_id: payload.assignby,
          assignby_name: demoDB.users.find((u) => u.user_id === payload.assignby)?.username || "test1",
          assignto_id: payload.assignto,
          assignto_name: demoDB.users.find((u) => u.user_id === payload.assignto)?.username || "test1",
          status: payload.status || "assigned"
        };
        demoDB.tasks.push(newTask);
        responseData = newTask;
      } else {
        responseData = demoDB.tasks.filter(t => t.meetingid === meetingId);
      }
    }
    else if (url.match(/\/\d+\/tasks\/\d+/)) {
      const taskId = parseInt(url.split("/tasks/")[1]);
      if (method === "delete") {
        const index = demoDB.tasks.findIndex(t => t.taskid === taskId);
        if (index > -1) demoDB.tasks.splice(index, 1);
        responseData = { message: "Task deleted" };
      }
    }
    else if (url.includes("/alltasks")) {
      const meetingId = parseInt(url.split("/")[1]);
      responseData = getTasksByMeeting(meetingId);
    }
    else if (url.includes("/notassigned")) {
      const meetingId = parseInt(url.split("/")[1]);
      const assignedMinuteIds = new Set(getTasksByMeeting(meetingId).map((t) => t.minuteid));
      responseData = demoDB.minutes.filter(
        (m) => m.meetingid === meetingId && m.istask === 1 && !assignedMinuteIds.has(m.minuteid)
      );
    }
    else if (url.match(/\/\d+\/tobediscussed/)) {
      const mid = parseInt(url.split("/")[1]);
      if (url.includes("/alltasks")) {
        responseData = demoDB.tasks.filter((t) => t.mid === mid && t.status !== "completed");
      } else if (url.includes("/notassigned")) {
        const taskMinuteIds = new Set(demoDB.tasks.filter((t) => t.mid === mid).map((t) => t.minuteid));
        responseData = demoDB.minutes.filter((m) => m.mid === mid && m.istask === 1 && !taskMinuteIds.has(m.minuteid));
      } else {
        responseData = [];
      }
    }

    /* ========================================
       MEMBERS & ATTENDANCE
    ======================================== */
    else if (url.match(/\/\d+\/members/)) {
      const meetingId = parseInt(url.split("/")[1]);
      const meeting = demoDB.meetings.find(m => m.meetingid === meetingId);
      if (meeting && meeting.members) {
        responseData = meeting.members.map((userId) => {
          const user = demoDB.users.find((u) => u.user_id === userId);
          const attendanceRow = demoDB.attendance.find(
            (a) => a.meetingid === meetingId && a.user_id === userId
          );
          return {
            user_id: userId,
            username: user?.username || "Unknown",
            email: user?.email || "",
            attendanceid: attendanceRow?.attendance_id || null,
            status: attendanceRow ? (attendanceRow.attended ? 1 : 0) : 0
          };
        });
      } else {
        responseData = demoDB.users;
      }
    }
    else if (url.includes("/attendance/update")) {
      const { attendanceid, meetingid, user_id, status } = payload;
      const meetingIdNum = parseInt(meetingid, 10);
      const row = demoDB.attendance.find((a) => a.attendance_id === attendanceid);
      if (row) {
        row.attended = status === 1;
      } else {
        demoDB.attendance.push({
          attendance_id: demoDB.nextIds.nextAttendanceId++,
          meetingid: meetingIdNum,
          mid: demoDB.meetings.find((m) => m.meetingid === meetingIdNum)?.mid || meetingIdNum,
          user_id,
          username: demoDB.users.find((u) => u.user_id === user_id)?.username || "test1",
          attended: status === 1
        });
      }
      responseData = { message: "Attendance updated" };
    }

    /* ========================================
       MESSAGES
    ======================================== */
    else if (url.includes("/getRoomByMeeting/")) {
      const meetingId = parseInt(url.split("/getRoomByMeeting/")[1]);
      const meeting = demoDB.meetings.find(m => m.meetingid === meetingId);
      responseData = {
        roomId: meeting?.mid || meetingId,
        mid: meeting?.mid || meetingId,
        title: meeting?.title || "Demo Room"
      };
    }
    else if (url.match(/\/message\/room\/\d+/)) {
      const roomId = parseInt(url.split("/message/room/")[1]);
      responseData = demoDB.roomMessages
        .filter(m => m.room_id === roomId)
        .map((m) => ({
          msg_id: m.message_id,
          room_id: m.room_id,
          content: m.content,
          created_at: m.created_at,
          sender_id: m.sender_id,
          username: m.username
        }));
    }
    else if (url.includes("/message/rooms")) {
      const userId = demoDB.demoUser.user_id;
      const userMeetings = demoDB.meetings.filter(m => 
        m.members.includes(userId) || m.host === userId || m.minutetaker === userId
      );
      responseData = userMeetings.map(m => ({
        roomId: m.mid,
        title: m.title,
        followup: m.followup,
        host: m.host,
        minutetaker: m.minutetaker,
        members: m.members
      }));
    }

    /* ========================================
       REPORTS
    ======================================== */
    else if (url.match(/\/report\/\d+/) && method === "get") {
      const meetingId = parseInt(url.split("/report/")[1], 10);
      const report = demoDB.reports.find(r => r.meetingid === meetingId);
      responseData = report || { message: "No report found" };
    }
    else if (url.match(/\/report\/\d+/) && method === "post") {
      const meetingId = parseInt(url.split("/report/")[1], 10);
      const index = demoDB.reports.findIndex((r) => r.meetingid === meetingId);
      if (index >= 0) {
        demoDB.reports[index] = { ...demoDB.reports[index], ...payload };
        responseData = demoDB.reports[index];
      } else {
        const newReport = {
          reportid: demoDB.nextIds.nextReportId++,
          meetingid: meetingId,
          ...payload
        };
        demoDB.reports.push(newReport);
        responseData = newReport;
      }
    }

    /* ========================================
       DEFAULT
    ======================================== */
    else {
      responseData = { message: "Demo mode: endpoint not implemented", url };
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

// Intercept requests in demo mode
apiInstance.interceptors.request.use((config) => {
  if (isDemo()) {
    config.adapter = demoAdapter;
  }
  return config;
});

export default apiInstance;
