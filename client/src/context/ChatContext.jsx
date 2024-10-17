import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

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
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);


    //----------------CONSOLE--------------
    // console.log("currentChat", currentChat);
    // console.log("Messages", messages);
    console.log("onlineUsers", onlineUsers);

    // Initialize Socket
    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);

    // Add Online Users
    useEffect(() => {
        if (!socket) return;
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        }
    }, [socket]);

    //Send message

    useEffect(() => {
        if (!socket || !newMessage || !currentChat) return;

        const recipientId = currentChat?.members.find((id) => id !== user?._id);

        if (recipientId) {
            socket.emit("sendMessage", { ...newMessage, recipientId });
            console.log("Message sent from client:", newMessage);
        }
    }, [newMessage, socket, currentChat, user]); // When the new message changes that is when we run the useEffect

    // Receive Message
    useEffect(() => {
        if (!socket) return;
    
        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;
            
            setMessages((prev) => [...prev, res]);  // This adds new incoming messages
        });
    
        return () => {
            socket.off("getMessage");
        };
    }, [socket, currentChat]);
    

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
    // getMessages useEffect
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
            setMessages(formattedMessages);  // This sets the initial fetched messages
        };
    
        if (currentChat?._id) {  // Only call if there's a valid current chat
            getMessages();
        }
    }, [currentChat]);
    



    // ------------- Send Messages ----------------
    const sendTextMessage = useCallback(
        async (textMessage, sender, currentChatId, setTextMessage) => {
            if (!textMessage) return console.log("You must type something...");

            const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
                chatId: currentChatId,
                senderId: sender._id,
                text: textMessage,
            }));

            if (!response.error) {
                setNewMessage(response);  // This will trigger the `sendMessage` event
                setMessages((prev) => [...prev, response]);
                setTextMessage("");
            }
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
                onlineUsers,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}