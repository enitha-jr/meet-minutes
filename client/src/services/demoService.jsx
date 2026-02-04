/* ========================================
   DEMO SERVICE (ONLY DATA HERE)
======================================== */

export const isDemo = () => localStorage.getItem("demo") === "true";


export const demoDB = {

  users: [
    { user_id: 1, username: "Demo Host", email: "demo@gmail.com" },
    { user_id: 2, username: "Alice", email: "alice@gmail.com" },
    { user_id: 3, username: "Bob", email: "bob@gmail.com" }
  ],

  meetings: [
    {
      meetingid: 1,
      mid: 1,
      title: "Project Planning",
      date: "2026-02-04",
      time: "10:00 AM",
      mode: "offline",
      venue: "Room 101",
      description: "Plan sprint tasks",
      status: "upcoming",
      host: 1,
      host_name: "Demo Host",
      minutetaker: 2,
      minutetaker_name: "Alice",
      members: [1, 2, 3]
    },
    {
      meetingid: 2,
      mid: 2,
      title: "Weekly Sync",
      date: "2026-02-05",
      time: "02:00 PM",
      mode: "online",
      meet_link: "https://meet.example.com/weekly-sync",
      description: "Weekly team sync",
      status: "upcoming",
      host: 2,
      host_name: "Demo Host",
      minutetaker: 3,
      minutetaker_name: "Bob",
      members: [1, 2, 3]
    }
  ],

  minutes: [
    { minuteid: 1, mid: 1, minute: "Discuss budget", istask: 0 },
    { minuteid: 2, mid: 1, minute: "Prepare slides", istask: 1 },
    { minuteid: 3, mid: 1, minute: "Review Q1 results", istask: 0 }
  ],

  tasks: [
    {
      taskid: 1,
      mid: 1,
      minuteid: 2,
      task: "Prepare slides",
      description: "Create PPT",
      assignby_id: 1,
      assignby_name: "Demo Host",
      assignto_id: 2,
      assignto_name: "Alice",
      date: "2026-02-05",
      status: "assigned"
    },
    {
      taskid: 2,
      mid: 1,
      minuteid: null,
      task: "Send report",
      description: "Email weekly report",
      assignby_id: 1,
      assignby_name: "Demo Host",
      assignto_id: 2,
      assignto_name: "Alice",
      date: "2026-02-06",
      status: "pending"
    },
    {
      taskid: 3,
      mid: 1,
      minuteid: null,
      task: "Fix bugs",
      description: "Resolve issues",
      assignby_id: 1,
      assignby_name: "Demo Host",
      assignto_id: 3,
      assignto_name: "Bob",
      date: "2026-02-07",
      status: "completed"
    }
  ],

  messages: [
    { msg_id: 1, sender_id: 2, sender: "Alice", content: "Hello everyone!", room_id: 1, timestamp: "2026-02-04T10:15:00" },
    { msg_id: 2, sender_id: 3, sender: "Bob", content: "Ready to start?", room_id: 1, timestamp: "2026-02-04T10:16:00" }
  ],

  nextMid: 3,
  
  attendance: [
    { user_id: 1, username: "Demo Host", attended: true, mid: 1 },
    { user_id: 2, username: "Alice", attended: true, mid: 1 },
    { user_id: 3, username: "Bob", attended: false, mid: 1 }
  ],

  reports: [
    {
      reportid: 1,
      mid: 1,
      title: "Project Planning - Final Report",
      summary: "Meeting focused on planning the next sprint with team alignment on deliverables and timelines.",
      keyDecisions: [
        "Approved Q1 budget allocation",
        "Set sprint duration to 2 weeks",
        "Designated Alice as technical lead"
      ],
      actionItems: [
        "Prepare detailed project slides",
        "Review Q1 results and compile metrics",
        "Schedule follow-up meeting with stakeholders"
      ],
      attendees: [
        { user_id: 1, username: "Demo Host", attended: true },
        { user_id: 2, username: "Alice", attended: true },
        { user_id: 3, username: "Bob", attended: false }
      ],
      date: "2026-02-04",
      generated_by: 1,
      generated_by_name: "Demo Host",
      created_at: "2026-02-04T15:30:00"
    }
  ]
};
