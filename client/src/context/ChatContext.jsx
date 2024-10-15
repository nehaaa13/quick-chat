import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);


    //----------------CONSOLE--------------
    // console.log("currentChat", currentChat);
    // console.log("Messages", messages);


    // -----------------getUsers----------------
    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/allusers`);

            if (response.error) {

                return console.log("Error fetching users", response);

            }
            const pChats = response.filter((u) => {
                let isChatCreated = false;

                if (user?._id === u._id) return false; // Skip the current user

                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                }

                return !isChatCreated;  // Return users who don't have chats created yet
            });

            // Now we'll have both _id and name in pChats
            setPotentialChats(pChats);

        };
        if (user) {
            getUsers();
        }
    }, [userChats]);

    //-------------------getUsersChat-------------
    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                setIsUserChatsLoading(false);

                if (response.error) {
                    return setUserChatsError(response);
                }
                setUserChats(Array.isArray(response) ? response : []);
            }
        };
        getUserChats();
    }, [user]);

    //-------------------getMessages-------------
    useEffect(() => {
        const getMessages = async () => {

            setIsMessagesLoading(true);
            setMessagesError(null);

            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
            setIsMessagesLoading(false);

            if (response.error) {
                return setMessagesError(response);
            }
            const formattedMessages = Array.isArray(response) ? response : [response];

            setMessages(formattedMessages);

        };
        if (currentChat?._id) {  // Only call if there's a valid current chat
            getMessages();
        }
    }, [currentChat]);

    const sendTextMessage = useCallback(
        async (textMessage, sender, currentChatId, setTextMessage) => {
            if (!textMessage) return console.log("You must type something...");

            const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
                chatId: currentChatId,
                senderId: sender._id,
                text: textMessage,
            }));            

            if (response.error) {
                return setSendTextMessageError(response);
            }

            setNewMessage(response);
            
            setMessages((prev) => [...prev, response])
            setTextMessage("");
            console.log("new message", newMessage);

        }, []);

    // -----------------updateCurrentChat--------------
    const updateCurrentChat = useCallback((chatId) => {
        setCurrentChat(chatId);
    }, []);

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({ firstId, secondId, }));

        if (response.error) {
            return console.log("Error in creating chats", response);
        }
        setUserChats((prev) => [...prev, response]);
    }, [])

    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatsLoading,
                userChatsError,
                potentialChats,
                createChat,
                updateCurrentChat,
                messages,
                currentChat,
                isMessagesLoading,
                messagesError,
                sendTextMessage,

            }}
        >
            {children}
        </ChatContext.Provider>
    )
}