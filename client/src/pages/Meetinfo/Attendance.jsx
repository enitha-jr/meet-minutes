import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/Attendance.css";
import { FaSearch } from "react-icons/fa";
import meetServices from "../../services/meetServices";

function Attendance() {
    const { meetingid } = useParams();

    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await meetServices.fetchMembers(meetingid);
                setMembers(data);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        fetchMembers();
    }, [meetingid]);


    const filteredMembers = members.filter((m) =>
        m.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleCheck = async (attendanceid, currentStatus, user_id) => {
        const newStatus = currentStatus ? 0 : 1;
        setMembers((prev) =>
            prev.map((m) =>
                m.user_id === user_id ? { ...m, status: newStatus } : m
            )
        );
        const updateData = {
            attendanceid,
            meetingid: meetingid,
            user_id,
            status: newStatus,
        };
        try {
            await meetServices.updateAttendance(updateData);
        } catch (error) {
            console.error("Error updating attendance:", error);

            setMembers((prev) =>
                prev.map((m) =>
                    m.user_id === user_id ? { ...m, status: currentStatus } : m
                )
            );
        }
    };

    return (
        <div className="attendance-content">
            {/* Search Box */}
            <div className="search-container">
                <div className="search-input-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredMembers.length > 0 && (
                <div className="attendance-container">
                    <table className="attendance-table">
                        <tbody>
                            {filteredMembers.map((member, index) => (
                                <tr className="attendance-table-row" key={member.user_id}>
                                    <td>{index + 1}</td>

                                    <td>{member.username}</td>

                                    <td>
                                        <button
                                            className={`attendance-btn ${member.status === 1 ? "present" : "absent"
                                                }`}
                                            onClick={() =>
                                                handleCheck(
                                                    member.attendanceid,
                                                    member.status,
                                                    member.user_id
                                                )
                                            }
                                        >
                                            {member.status === 1 ? "PRESENT" : "ABSENT"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Attendance;
