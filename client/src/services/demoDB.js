/* ========================================
   DEMO DATABASE FOR MEETING MANAGEMENT SYSTEM
   Generated for deployment demo - March 2026
======================================== */

// Sample users for demo
export const users = [
  { user_id: 1, username: "test1", email: "test1@example.com" },
  { user_id: 2, username: "test2", email: "test2@example.com" },
  { user_id: 3, username: "test3", email: "test3@example.com" },
  { user_id: 4, username: "test4", email: "test4@example.com" },
  { user_id: 5, username: "test5", email: "test5@example.com" }
];

// Demo user (logged in)
export const demoUser = {
  user_id: 1,
  username: "test1",
  email: "test1@example.com"
};

/* ========================================
   MEETINGS
======================================== */
export const meetings = [
  {
    meetingid: 1,
    mid: 1,
    title: "Q1 Sprint Planning",
    description: "Plan tasks and deliverables for Q1 2026 sprint cycle",
    date: "2026-03-10",
    time: "10:00 AM",
    mode: "online",
    meet_link: "https://meet.example.com/q1-sprint",
    status: "ongoing",
    host: 1, // test1 is host
    host_name: "test1",
    minutetaker: 3,
    minutetaker_name: "test3",
    members: [1, 2, 3, 4],
    followup: "no",
    venue: ""
  },
  {
    meetingid: 2,
    mid: 2,
    title: "Project Kickoff Meeting",
    description: "Initial project discussion and team alignment",
    date: "2026-03-05",
    time: "02:00 PM",
    mode: "offline",
    venue: "Conference Room A",
    status: "completed",
    host: 2,
    host_name: "test2",
    minutetaker: 1, // test1 is minute taker
    minutetaker_name: "test1",
    members: [1, 2, 3, 4, 5],
    followup: "yes",
    meet_link: ""
  },
  {
    meetingid: 3,
    mid: 3,
    title: "Weekly Team Sync",
    description: "Regular weekly sync to discuss progress and blockers",
    date: "2026-03-12",
    time: "11:00 AM",
    mode: "online",
    meet_link: "https://meet.example.com/weekly-sync",
    status: "upcoming",
    host: 4,
    host_name: "test4",
    minutetaker: 5,
    minutetaker_name: "test5",
    members: [1, 3, 4, 5], // test1 is just a participant
    followup: "no",
    venue: ""
  },
  {
    meetingid: 4,
    mid: 4,
    title: "Budget Review & Approval",
    description: "Review Q1 budget allocation and approve department requests",
    date: "2026-03-03",
    time: "03:00 PM",
    mode: "offline",
    venue: "Board Room",
    status: "completed",
    host: 1, // test1 is host
    host_name: "test1",
    minutetaker: 2,
    minutetaker_name: "test2",
    members: [1, 2, 4],
    followup: "no",
    meet_link: ""
  },
  {
    meetingid: 5,
    mid: 2,
    title: "Project Kickoff - Follow-up",
    description: "Follow-up meeting to address pending items from kickoff",
    date: "2026-03-15",
    time: "02:00 PM",
    mode: "online",
    meet_link: "https://meet.example.com/kickoff-followup",
    status: "upcoming",
    host: 1,
    host_name: "test1",
    minutetaker: 1, // test1 is minute taker
    minutetaker_name: "test1",
    members: [1, 2, 3, 5],
    followup: "yes",
    venue: ""
  },
  {
    meetingid: 6,
    mid: 6,
    title: "Architecture Design Discussion",
    description: "Discuss system architecture and technical decisions",
    date: "2026-03-08",
    time: "09:30 AM",
    mode: "online",
    meet_link: "https://meet.example.com/architecture",
    status: "completed",
    host: 3,
    host_name: "test3",
    minutetaker: 4,
    minutetaker_name: "test4",
    members: [1, 2, 3, 4],
    followup: "no"
  }
];

/* ========================================
   MINUTES
======================================== */
export const minutes = [
  // Meeting 1 (Ongoing - Q1 Sprint Planning)
  { minuteid: 1, meetingid: 1, mid: 1, minute: "Discussed sprint goals and objectives", istask: 0, created_by: 3 },
  { minuteid: 2, meetingid: 1, mid: 1, minute: "Review and update project documentation", istask: 1, created_by: 3 },
  { minuteid: 3, meetingid: 1, mid: 1, minute: "Assign team members to sprint tasks", istask: 1, created_by: 3 },
  { minuteid: 4, meetingid: 1, mid: 1, minute: "Setup CI/CD pipeline for new repository", istask: 1, created_by: 3 },

  // Meeting 2 (Completed - Project Kickoff)
  { minuteid: 5, meetingid: 2, mid: 2, minute: "Agreed on project timeline and milestones", istask: 0, created_by: 1 },
  { minuteid: 6, meetingid: 2, mid: 2, minute: "Defined roles and responsibilities for team members", istask: 0, created_by: 1 },
  { minuteid: 7, meetingid: 2, mid: 2, minute: "Prepare initial requirements document", istask: 1, created_by: 1 },
  { minuteid: 8, meetingid: 2, mid: 2, minute: "Schedule follow-up meeting for pending items", istask: 1, created_by: 1 },
  { minuteid: 9, meetingid: 2, mid: 2, minute: "Setup project tracking dashboard", istask: 1, created_by: 1 },
  { minuteid: 18, meetingid: 5, mid: 2, minute: "Finalize dashboard KPI widgets and owner mapping", istask: 1, created_by: 1 },
  { minuteid: 19, meetingid: 5, mid: 2, minute: "Confirm dependency owners for API integration blockers", istask: 1, created_by: 1 },

  // Meeting 4 (Completed - Budget Review)
  { minuteid: 10, meetingid: 4, mid: 4, minute: "Approved Q1 budget allocation", istask: 0, created_by: 2 },
  { minuteid: 11, meetingid: 4, mid: 4, minute: "Marketing budget increased by 15%", istask: 0, created_by: 2 },
  { minuteid: 12, meetingid: 4, mid: 4, minute: "Prepare detailed expense breakdown report", istask: 1, created_by: 2 },
  { minuteid: 13, meetingid: 4, mid: 4, minute: "Review vendor contracts and negotiate better rates", istask: 1, created_by: 2 },

  // Meeting 6 (Completed - Architecture Discussion)
  { minuteid: 14, meetingid: 6, mid: 6, minute: "Decided to use microservices architecture", istask: 0, created_by: 4 },
  { minuteid: 15, meetingid: 6, mid: 6, minute: "Database schema to use PostgreSQL", istask: 0, created_by: 4 },
  { minuteid: 16, meetingid: 6, mid: 6, minute: "Create architecture diagram and share with team", istask: 1, created_by: 4 },
  { minuteid: 17, meetingid: 6, mid: 6, minute: "Research and evaluate message queue options", istask: 1, created_by: 4 }
];

/* ========================================
   TASKS (MeetTasks)
======================================== */
export const tasks = [
  // From Meeting 1 (Q1 Sprint Planning)
  {
    taskid: 1,
    meetingid: 1,
    mid: 1,
    minuteid: 2,
    task: "Review and update project documentation",
    description: "Update all project docs with latest information and guidelines",
    assignto_id: 2,
    assignto_name: "test2",
    assignby_id: 1,
    assignby_name: "test1",
    date: "2026-03-12",
    status: "assigned"
  },
  {
    taskid: 2,
    meetingid: 1,
    mid: 1,
    minuteid: 3,
    task: "Assign team members to sprint tasks",
    description: "Create sprint board and assign tasks to team members",
    assignto_id: 1,
    assignto_name: "test1",
    assignby_id: 3,
    assignby_name: "test3",
    date: "2026-03-11",
    status: "pending"
  },
  {
    taskid: 3,
    meetingid: 1,
    mid: 1,
    minuteid: 4,
    task: "Setup CI/CD pipeline for new repository",
    description: "Configure Jenkins pipeline for automated builds and deployments",
    assignto_id: 4,
    assignto_name: "test4",
    assignby_id: 1,
    assignby_name: "test1",
    date: "2026-03-14",
    status: "assigned"
  },

  // From Meeting 2 (Project Kickoff - Completed)
  {
    taskid: 4,
    meetingid: 2,
    mid: 2,
    minuteid: 7,
    task: "Prepare initial requirements document",
    description: "Draft comprehensive requirements document with all stakeholder inputs",
    assignto_id: 3,
    assignto_name: "test3",
    assignby_id: 2,
    assignby_name: "test2",
    date: "2026-03-08",
    status: "completed"
  },
  {
    taskid: 5,
    meetingid: 2,
    mid: 2,
    minuteid: 8,
    task: "Schedule follow-up meeting for pending items",
    description: "Coordinate with all attendees and schedule follow-up session",
    assignto_id: 1,
    assignto_name: "test1",
    assignby_id: 2,
    assignby_name: "test2",
    date: "2026-03-10",
    status: "completed"
  },
  {
    taskid: 6,
    meetingid: 2,
    mid: 2,
    minuteid: 9,
    task: "Setup project tracking dashboard",
    description: "Create Jira dashboard for project tracking and reporting",
    assignto_id: 5,
    assignto_name: "test5",
    assignby_id: 1,
    assignby_name: "test1",
    date: "2026-03-12",
    status: "pending"
  },
  {
    taskid: 11,
    meetingid: 5,
    mid: 2,
    minuteid: 18,
    task: "Finalize dashboard KPI widgets",
    description: "Lock KPI definitions and assign each widget owner before follow-up review",
    assignto_id: 2,
    assignto_name: "test2",
    assignby_id: 1,
    assignby_name: "test1",
    date: "2026-03-16",
    status: "pending"
  },

  // From Meeting 4 (Budget Review - Completed)
  {
    taskid: 7,
    meetingid: 4,
    mid: 4,
    minuteid: 12,
    task: "Prepare detailed expense breakdown report",
    description: "Create Excel report with all Q1 expenses categorized by department",
    assignto_id: 2,
    assignto_name: "test2",
    assignby_id: 1,
    assignby_name: "test1",
    date: "2026-03-10",
    status: "completed"
  },
  {
    taskid: 8,
    meetingid: 4,
    mid: 4,
    minuteid: 13,
    task: "Review vendor contracts and negotiate better rates",
    description: "Analyze current vendor contracts and identify cost-saving opportunities",
    assignto_id: 4,
    assignto_name: "test4",
    assignby_id: 1,
    assignby_name: "test1",
    date: "2026-03-15",
    status: "assigned"
  },

  // From Meeting 6 (Architecture Discussion - Completed)
  {
    taskid: 9,
    meetingid: 6,
    mid: 6,
    minuteid: 16,
    task: "Create architecture diagram and share with team",
    description: "Design comprehensive architecture diagram using draw.io",
    assignto_id: 3,
    assignto_name: "test3",
    assignby_id: 4,
    assignby_name: "test4",
    date: "2026-03-11",
    status: "completed"
  },
  {
    taskid: 10,
    meetingid: 6,
    mid: 6,
    minuteid: 17,
    task: "Research and evaluate message queue options",
    description: "Compare RabbitMQ, Kafka and AWS SQS for our use case",
    assignto_id: 1,
    assignto_name: "test1",
    assignby_id: 3,
    assignby_name: "test3",
    date: "2026-03-13",
    status: "pending"
  }
];

/* ========================================
   MY TASKS (Tasks assigned TO test1)
======================================== */
export const myTasks = [
  {
    taskid: 2,
    task: "Assign team members to sprint tasks",
    description: "Create sprint board and assign tasks to team members",
    assignby_id: 3,
    assignby_name: "test3",
    date: "2026-03-11",
    status: "pending"
  },
  {
    taskid: 5,
    task: "Schedule follow-up meeting for pending items",
    description: "Coordinate with all attendees and schedule follow-up session",
    assignby_id: 2,
    assignby_name: "test2",
    date: "2026-03-10",
    status: "completed"
  },
  {
    taskid: 10,
    task: "Research and evaluate message queue options",
    description: "Compare RabbitMQ, Kafka and AWS SQS for our use case",
    assignby_id: 3,
    assignby_name: "test3",
    date: "2026-03-13",
    status: "pending"
  }
];

/* ========================================
   ASSIGNED TASKS (Tasks assigned BY test1)
======================================== */
export const assignedTasks = [
  {
    taskid: 1,
    task: "Review and update project documentation",
    description: "Update all project docs with latest information and guidelines",
    assignto_id: 2,
    assignto_name: "test2",
    date: "2026-03-12",
    status: "assigned"
  },
  {
    taskid: 3,
    task: "Setup CI/CD pipeline for new repository",
    description: "Configure Jenkins pipeline for automated builds and deployments",
    assignto_id: 4,
    assignto_name: "test4",
    date: "2026-03-14",
    status: "assigned"
  },
  {
    taskid: 6,
    task: "Setup project tracking dashboard",
    description: "Create Jira dashboard for project tracking and reporting",
    assignto_id: 5,
    assignto_name: "test5",
    date: "2026-03-12",
    status: "pending"
  },
  {
    taskid: 7,
    task: "Prepare detailed expense breakdown report",
    description: "Create Excel report with all Q1 expenses categorized by department",
    assignto_id: 2,
    assignto_name: "test2",
    date: "2026-03-10",
    status: "completed"
  },
  {
    taskid: 8,
    task: "Review vendor contracts and negotiate better rates",
    description: "Analyze current vendor contracts and identify cost-saving opportunities",
    assignto_id: 4,
    assignto_name: "test4",
    date: "2026-03-15",
    status: "assigned"
  }
];

/* ========================================
   ATTENDANCE
======================================== */
export const attendance = [
  // Meeting 1 (Q1 Sprint Planning - Ongoing)
  { attendance_id: 1, meetingid: 1, mid: 1, user_id: 1, username: "test1", attended: true },
  { attendance_id: 2, meetingid: 1, mid: 1, user_id: 2, username: "test2", attended: true },
  { attendance_id: 3, meetingid: 1, mid: 1, user_id: 3, username: "test3", attended: true },
  { attendance_id: 4, meetingid: 1, mid: 1, user_id: 4, username: "test4", attended: false },

  // Meeting 2 (Project Kickoff - Completed)
  { attendance_id: 5, meetingid: 2, mid: 2, user_id: 1, username: "test1", attended: true },
  { attendance_id: 6, meetingid: 2, mid: 2, user_id: 2, username: "test2", attended: true },
  { attendance_id: 7, meetingid: 2, mid: 2, user_id: 3, username: "test3", attended: true },
  { attendance_id: 8, meetingid: 2, mid: 2, user_id: 4, username: "test4", attended: true },
  { attendance_id: 9, meetingid: 2, mid: 2, user_id: 5, username: "test5", attended: false },

  // Meeting 4 (Budget Review - Completed)
  { attendance_id: 10, meetingid: 4, mid: 4, user_id: 1, username: "test1", attended: true },
  { attendance_id: 11, meetingid: 4, mid: 4, user_id: 2, username: "test2", attended: true },
  { attendance_id: 12, meetingid: 4, mid: 4, user_id: 4, username: "test4", attended: true },

  // Meeting 6 (Architecture Discussion - Completed)
  { attendance_id: 13, meetingid: 6, mid: 6, user_id: 1, username: "test1", attended: true },
  { attendance_id: 14, meetingid: 6, mid: 6, user_id: 2, username: "test2", attended: false },
  { attendance_id: 15, meetingid: 6, mid: 6, user_id: 3, username: "test3", attended: true },
  { attendance_id: 16, meetingid: 6, mid: 6, user_id: 4, username: "test4", attended: true }
];

/* ========================================
   REPORTS (For completed meetings)
======================================== */
export const reports = [
  {
    reportid: 1,
    meetingid: 2,
    mid: 2,
    title: "Project Kickoff Meeting - Final Report",
    summary: "Successfully completed project kickoff with all stakeholders. Defined clear project scope, timeline, and team responsibilities.",
    assigned_tasks: [
      "Prepare initial requirements document - Assigned to test3",
      "Schedule follow-up meeting for pending items - Assigned to test1",
      "Setup project tracking dashboard - Assigned to test5"
    ],
    pending_tasks: [
      "Setup project tracking dashboard - test5 (Due: Mar 12)"
    ],
    completed_tasks: [
      "Prepare initial requirements document - test3 (Completed: Mar 08)",
      "Schedule follow-up meeting for pending items - test1 (Completed: Mar 10)"
    ],
    notes: "Marketing team needs additional input on budget allocation. Follow-up meeting scheduled for March 15th to address remaining concerns.",
    generated_by: 1,
    generated_by_name: "test1",
    created_at: "2026-03-05T16:30:00"
  },
  {
    reportid: 2,
    meetingid: 4,
    mid: 4,
    title: "Budget Review & Approval - Summary Report",
    summary: "Q1 budget approved with modifications. Marketing budget increased by 15% as requested. All department heads agreed on resource allocation.",
    assigned_tasks: [
      "Prepare detailed expense breakdown report - Assigned to test2",
      "Review vendor contracts and negotiate better rates - Assigned to test4"
    ],
    pending_tasks: [
      "Review vendor contracts and negotiate better rates - test4 (Due: Mar 15)"
    ],
    completed_tasks: [
      "Prepare detailed expense breakdown report - test2 (Completed: Mar 10)"
    ],
    notes: "Need to monitor Q1 spending closely to ensure we stay within approved budget. Monthly reviews recommended.",
    generated_by: 1,
    generated_by_name: "test1",
    created_at: "2026-03-03T16:00:00"
  },
  {
    reportid: 3,
    meetingid: 6,
    mid: 6,
    title: "Architecture Design Discussion - Report",
    summary: "Team aligned on microservices architecture approach. PostgreSQL selected as primary database. Message queue evaluation in progress.",
    assigned_tasks: [
      "Create architecture diagram and share with team - Assigned to test3",
      "Research and evaluate message queue options - Assigned to test1"
    ],
    pending_tasks: [
      "Research and evaluate message queue options - test1 (Due: Mar 13)"
    ],
    completed_tasks: [
      "Create architecture diagram and share with team - test3 (Completed: Mar 11)"
    ],
    notes: "Architecture diagram has been shared in the team channel. Waiting for message queue evaluation before finalizing tech stack.",
    generated_by: 4,
    generated_by_name: "test4",
    created_at: "2026-03-08T11:30:00"
  }
];

/* ========================================
   TO BE DISCUSSED (Follow-up Meeting Items)
======================================== */
export const toBeDiscussed = [
  // From Meeting 2 report - for Meeting 5 (follow-up)
  {
    tbd_id: 1,
    meetingid: 5,
    mid: 2,
    description: "Setup project tracking dashboard",
    source: "task",
    source_meetingid: 2,
    assignto_id: 5,
    assignto_name: "test5",
    is_assigned: true,
    status: "pending"
  },
  {
    tbd_id: 2,
    meetingid: 5,
    mid: 2,
    description: "Marketing team budget allocation concerns",
    source: "report",
    source_meetingid: 2,
    assignto_id: null,
    assignto_name: null,
    is_assigned: false,
    status: "pending"
  },
  {
    tbd_id: 3,
    meetingid: 5,
    mid: 2,
    description: "Resource allocation for new project phases",
    source: "report",
    source_meetingid: 2,
    assignto_id: null,
    assignto_name: null,
    is_assigned: false,
    status: "pending"
  },
  {
    tbd_id: 4,
    meetingid: 5,
    mid: 2,
    description: "Stakeholder feedback on project timeline",
    source: "discussion",
    source_meetingid: 2,
    assignto_id: 2,
    assignto_name: "test2",
    is_assigned: true,
    status: "pending"
  }
];

/* ========================================
   ROOM MESSAGES (Chat for meeting rooms)
======================================== */
export const roomMessages = [
  // Room 1 (Q1 Sprint Planning)
  {
    message_id: 1,
    room_id: 1,
    meetingid: 1,
    sender_id: 1,
    sender: "test1",
    username: "test1",
    content: "Good morning team! Meeting starts in 5 minutes.",
    timestamp: "2026-03-10T09:55:00",
    created_at: "2026-03-10T09:55:00"
  },
  {
    message_id: 2,
    room_id: 1,
    meetingid: 1,
    sender_id: 2,
    sender: "test2",
    username: "test2",
    content: "Joining now!",
    timestamp: "2026-03-10T09:57:00",
    created_at: "2026-03-10T09:57:00"
  },
  {
    message_id: 3,
    room_id: 1,
    meetingid: 1,
    sender_id: 3,
    sender: "test3",
    username: "test3",
    content: "I've prepared the sprint board. Will share screen during the meeting.",
    timestamp: "2026-03-10T10:02:00",
    created_at: "2026-03-10T10:02:00"
  },
  {
    message_id: 4,
    room_id: 1,
    meetingid: 1,
    sender_id: 1,
    sender: "test1",
    username: "test1",
    content: "Great! Let's review the documentation tasks first.",
    timestamp: "2026-03-10T10:15:00",
    created_at: "2026-03-10T10:15:00"
  },
  {
    message_id: 5,
    room_id: 1,
    meetingid: 1,
    sender_id: 4,
    sender: "test4",
    username: "test4",
    content: "Sorry, running late. Will join in 10 mins.",
    timestamp: "2026-03-10T10:18:00",
    created_at: "2026-03-10T10:18:00"
  },

  // Room 2 (Project Kickoff - Completed)
  {
    message_id: 6,
    room_id: 2,
    meetingid: 2,
    sender_id: 2,
    sender: "test2",
    username: "test2",
    content: "Welcome everyone to the project kickoff!",
    timestamp: "2026-03-05T14:00:00",
    created_at: "2026-03-05T14:00:00"
  },
  {
    message_id: 7,
    room_id: 2,
    meetingid: 2,
    sender_id: 1,
    sender: "test1",
    username: "test1",
    content: "Thanks for organizing this. Excited to get started!",
    timestamp: "2026-03-05T14:02:00",
    created_at: "2026-03-05T14:02:00"
  },
  {
    message_id: 8,
    room_id: 2,
    meetingid: 2,
    sender_id: 3,
    sender: "test3",
    username: "test3",
    content: "I can take the lead on requirements documentation.",
    timestamp: "2026-03-05T14:25:00",
    created_at: "2026-03-05T14:25:00"
  },
  {
    message_id: 9,
    room_id: 2,
    meetingid: 2,
    sender_id: 2,
    sender: "test2",
    username: "test2",
    content: "Perfect! test1, can you schedule the follow-up meeting?",
    timestamp: "2026-03-05T14:30:00",
    created_at: "2026-03-05T14:30:00"
  },
  {
    message_id: 10,
    room_id: 2,
    meetingid: 2,
    sender_id: 1,
    sender: "test1",
    username: "test1",
    content: "Sure, I'll send out calendar invites by end of day.",
    timestamp: "2026-03-05T14:32:00",
    created_at: "2026-03-05T14:32:00"
  },
  {
    message_id: 11,
    room_id: 2,
    meetingid: 2,
    sender_id: 4,
    sender: "test4",
    username: "test4",
    content: "Great meeting! Looking forward to the next steps.",
    timestamp: "2026-03-05T15:45:00",
    created_at: "2026-03-05T15:45:00"
  },

  // Room 4 (Budget Review)
  {
    message_id: 12,
    room_id: 4,
    meetingid: 4,
    sender_id: 1,
    sender: "test1",
    username: "test1",
    content: "Let's review the Q1 budget numbers.",
    timestamp: "2026-03-03T15:00:00",
    created_at: "2026-03-03T15:00:00"
  },
  {
    message_id: 13,
    room_id: 4,
    meetingid: 4,
    sender_id: 2,
    sender: "test2",
    username: "test2",
    content: "I've prepared the expense breakdown. Sharing now.",
    timestamp: "2026-03-03T15:10:00",
    created_at: "2026-03-03T15:10:00"
  },
  {
    message_id: 14,
    room_id: 4,
    meetingid: 4,
    sender_id: 4,
    sender: "test4",
    username: "test4",
    content: "The marketing budget increase looks reasonable.",
    timestamp: "2026-03-03T15:25:00",
    created_at: "2026-03-03T15:25:00"
  },
  {
    message_id: 15,
    room_id: 4,
    meetingid: 4,
    sender_id: 1,
    sender: "test1",
    username: "test1",
    content: "Approved. test4, please review vendor contracts for cost savings.",
    timestamp: "2026-03-03T15:40:00",
    created_at: "2026-03-03T15:40:00"
  },

  // Room 5 (Follow-up meeting discussion)
  {
    message_id: 16,
    room_id: 5,
    meetingid: 5,
    sender_id: 2,
    sender: "test2",
    username: "test2",
    content: "This is the follow-up for our kickoff meeting. Let's address pending items.",
    timestamp: "2026-03-15T13:50:00",
    created_at: "2026-03-15T13:50:00"
  },
  {
    message_id: 17,
    room_id: 5,
    meetingid: 5,
    sender_id: 1,
    sender: "test1",
    username: "test1",
    content: "I'll be taking minutes today. Ready when you are!",
    timestamp: "2026-03-15T13:55:00",
    created_at: "2026-03-15T13:55:00"
  },
  {
    message_id: 18,
    room_id: 5,
    meetingid: 5,
    sender_id: 5,
    sender: "test5",
    username: "test5",
    content: "Quick update: project dashboard is 80% complete.",
    timestamp: "2026-03-15T14:10:00",
    created_at: "2026-03-15T14:10:00"
  },

  // Room 6 (Architecture Discussion)
  {
    message_id: 19,
    room_id: 6,
    meetingid: 6,
    sender_id: 3,
    sender: "test3",
    username: "test3",
    content: "Good morning! Let's dive into the architecture discussion.",
    timestamp: "2026-03-08T09:30:00",
    created_at: "2026-03-08T09:30:00"
  },
  {
    message_id: 20,
    room_id: 6,
    meetingid: 6,
    sender_id: 1,
    sender: "test1",
    username: "test1",
    content: "I'm leaning towards microservices for better scalability.",
    timestamp: "2026-03-08T09:45:00",
    created_at: "2026-03-08T09:45:00"
  },
  {
    message_id: 21,
    room_id: 6,
    meetingid: 6,
    sender_id: 4,
    sender: "test4",
    username: "test4",
    content: "Agreed. I'll assign test3 to create the architecture diagram.",
    timestamp: "2026-03-08T10:05:00",
    created_at: "2026-03-08T10:05:00"
  },
  {
    message_id: 22,
    room_id: 6,
    meetingid: 6,
    sender_id: 3,
    sender: "test3",
    username: "test3",
    content: "On it! Will have it ready by Monday.",
    timestamp: "2026-03-08T10:08:00",
    created_at: "2026-03-08T10:08:00"
  },
  {
    message_id: 23,
    room_id: 6,
    meetingid: 6,
    sender_id: 1,
    sender: "test1",
    username: "test1",
    content: "I'll research message queue options and report back.",
    timestamp: "2026-03-08T10:20:00",
    created_at: "2026-03-08T10:20:00"
  }
];

/* ========================================
   NEXT AVAILABLE IDs
======================================== */
export const nextIds = {
  nextMeetingId: 7,
  nextMid: 7,
  nextMinuteId: 20,
  nextTaskId: 12,
  nextAttendanceId: 17,
  nextReportId: 4,
  nextTbdId: 5,
  nextMessageId: 24
};

/* ========================================
   EXPORT ALL DEMO DATA
======================================== */
export const demoDB = {
  users,
  demoUser,
  meetings,
  minutes,
  tasks,
  myTasks,
  assignedTasks,
  attendance,
  reports,
  toBeDiscussed,
  roomMessages,
  nextIds
};

export default demoDB;
