const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');
const meetingsController = require('../controller/meetingsController');
const minuteController = require('../controller/minuteController');
const meetTaskController = require('../controller/meetTaskController');
const taskController = require('../controller/taskController');
const reportController = require('../controller/reportController');
const messageController = require('../controller/messageController');

const { authMiddleware } = require('../middleware/authMiddleware');

router.route('/login')
    .post(authController.login);

router.route('/register')
    .post(authController.register);

router.use(authMiddleware);

router.route('/user')
    .get(authController.getUser);

/***********Meeting services*************/

router.route('/nextmid')
    .get(meetingsController.getNextMid);

router.route('/newmeeting')
    .post(meetingsController.createMeeting);

router.route('/meetings/:slug')
    .post(meetingsController.getMeetings);

router.route('/meeting/:meetingid/details')
    .get(meetingsController.getMeetingById);

router.route('/updatemeetingdetails/:meetingid')
    .put(meetingsController.updateMeetingDetails);

router.route('/:meetingid/endMeeting')
    .put(meetingsController.endMeeting);

/************Minute services*************/

router.route('/:meetingid/minutes')
    .post(minuteController.addMinute)
    .get(minuteController.getMinutes);

router.route('/:meetingid/minutes/:minuteid')
    .delete(minuteController.deleteMinute)
    .get(minuteController.getSingleMinute)
    .put(minuteController.updateMinute);

router.route('/users')
    .get(authController.getAllUsers);

/********************MEET-TASK SERVICES*********************** */

router.route('/:meetingid/taskminutes')
    .get(meetTaskController.getTaskMinutes);

router.route('/:meetingid/tasks')
    .post(meetTaskController.addTask)
    .get(meetTaskController.getTasks);

router.route('/:meetingid/tasks/:taskid')
    .delete(meetTaskController.deleteTask);

/********************ATTENDANCE SERVICES*********************** */

router.route('/:meetingid/members')
    .get(meetingsController.getMembers);

router.route('/attendance/update')
    .post(meetingsController.updateAttendance);

/********************TASKS SERVICES*********************** */
router.route('/tasks/mytasks/:user_id')
    .get(taskController.getMyTasks);
router.route('/tasks/updatemytask')
    .put(taskController.updateMyTask);
router.route('/tasks/assignedtasks/:user_id')
    .get(taskController.getAssignedTasks);
router.route('/tasks/updateassignedtask')
    .put(taskController.updateAssignedTask);

/********************REPORT SERVICES*********************** */
router.route('/:meetingid/alltasks')
    .get(reportController.getAllTasks);
router.route('/:meetingid/notassigned')
    .get(reportController.getNotAssignedTasks);

router.route('/:mid/tobediscussed/alltasks')
    .get(reportController.getToBeDiscussed);
router.route('/:mid/tobediscussed/notassigned')
    .get(reportController.getToBeNotAssigned);


router.route('/meetings/:user_id')
    .get(meetingsController.getMeetingsByUser);


/********************MESSAGE SERVICES*********************** */

router.route('/getRoomByMeeting/:meetingId')
    .get(messageController.getRoomByMeeting);

router.route('/message/rooms')
    .get(messageController.getRoomsForUser);

router.route('/message/room/:roomId')
    .get(messageController.getRoomMessages);

module.exports = router;