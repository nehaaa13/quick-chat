import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../chats/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../chats/PotentialChats";
import ChatBox from "../chats/ChatBox";

const Chat = () => {
    const [user] = useContext(AuthContext); // Access user from AuthContext
    const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);

    //-----------------CONSOLE----------------
    // console.log("user", user);

    return (
        <Container style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <PotentialChats />
            {userChats?.length < 1 ? null : (
                <Stack direction="horizontal" gap={4} className="align-items-start flex-grow-1">
                    <Stack className="message-box flex-grow-0 pe-3" gap={3}> {/* flex-grow-0 for shrinking the list */}
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div key={index} onClick={() => updateCurrentChat(chat)}>
                                    {/* Pass the chat and user to UserChat */}
                                    <UserChat chat={chat} user={user} />
                                </div>
                            );
                        })}
                    </Stack>
                    <ChatBox />
                </Stack>
            )}
        </Container>
    );
};

export default Chat;
