import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    // REGISTER 
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: '',
        email: '',
        password: '',
    });

    // LOGIN
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });

    // -----------------CONSOLE------------------
    console.log("RegisterInfo", registerInfo); // To show register info
    console.log("Userr", user); // To show the User Object after refresh also instead of the Null state
    console.log("Login", loginInfo); // To show login info

    // USER INFO
    useEffect(() => {
        const user = localStorage.getItem("User");

        setUser(JSON.parse(user));
    }, []);

    // UPDATING REGISTER INFO
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    // SENDING HTTP REQUEST
    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(`${baseUrl}/register`, JSON.stringify(registerInfo));

        setIsRegisterLoading(false);

        if (response.error) {
            return setRegisterError(response);
        }
        localStorage.setItem("User", JSON.stringify(response)); // Storing data in localstorage in the form of json
        setUser(response);
    }, [registerInfo]);

    // UPDATING REGISTER INFO
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, []);

    // SENDING HTTP REQUEST
    const loginUser = useCallback(async (e) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);

        const response = await postRequest(`${baseUrl}/login`, JSON.stringify(loginInfo));

        setIsLoginLoading(false);

        if (response.error) {
            return setLoginError(response);
        }
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response);
    }, [loginInfo]);

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User"); // Clear user data from localStorage
        setUser(null); // Clear user state
    }, []);

    return (
        <AuthContext.Provider
            value={[
                user,
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
                logoutUser,
                loginUser,
                loginError,
                loginInfo,
                updateLoginInfo,
                isLoginLoading,
            ]}
        >
            {children}
        </AuthContext.Provider>
    );
}; 