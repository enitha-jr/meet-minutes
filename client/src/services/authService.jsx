import apiInstance from "./apiService";

const signup = async (data) => {
    try {
        console.log('Sending signup request');
        const response = await apiInstance.post('/register', data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const login = async (data) => {
    try {
        console.log('Sending login request',data);
        // console.log(apiInstance);
        const response = await apiInstance.post('/login', data);
        // console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const getUser = async (userId) => {
    try {
        // console.log('Fetching user data');
        const response = await apiInstance.get(`/user/${userId}`);
        // console.log('User data fetched:', response);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const authServices = {
    signup,
    login,
    getUser,
};

export default authServices;
