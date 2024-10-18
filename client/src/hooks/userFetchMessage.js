import { useEffect, useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatesMessage = (chat) => {
    const [newMessage, notifications] = useState(null);
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

            if(response.error){
                return console.log("Error getting messages...", error);
            }

            const lastMessage = response[response?.length -1];
            
            setLatestMessage(lastMessage);
        };

        getMessages();
    }, [newMessage, notifications]);

    return { latestMessage };
};