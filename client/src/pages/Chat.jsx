import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
    const { userChats, isUserChatsLoading, userChatsError } = useContext(ChatContext);
    console.log("User Chats", userChats);
    return (
        <>
            Chat
        </>
    );
}

export default Chat;