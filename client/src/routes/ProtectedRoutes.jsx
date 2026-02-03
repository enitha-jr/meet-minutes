import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from '../store/authSlice'

function ProtectedRoute({ children, users }) {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    // console.log("called");
    // console.log(auth);
    useEffect(() => {
        const isValid = (auth) => {
            const tokenValidity = new Date(auth.exp * 1000)
            const currTime = new Date();
            // console.log("Token Expiry Time:", tokenValidity);
            // console.log("Current Time:", currTime);
            return tokenValidity > currTime;
        }
        const checkAuth = async () => {
            if (auth && isValid(auth)) {
                // console.log("Token is valid");
                if (users && !users.includes(auth.role)) {
                    alert("Unauthorized Access")
                    navigate('/')
                }
            } else {
                // console.log("Token expired or not present");
                dispatch(clearAuth());
                navigate('/login')
            }
        }
        checkAuth();
    }, [auth, children, users, navigate])
    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute