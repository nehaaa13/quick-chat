import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import {AuthContext} from "../context/AuthContext";
const PotentialChats = () => {

    const [user] = useContext(AuthContext);
    const {potentialChats, createChat} = useContext(ChatContext);

    // console.log("potential", potentialChats);
    
    return ( <>
    <div className="all-users">
        {potentialChats?.length <1 ? null : (potentialChats.map((u,index)=>{
            return (
                <div className="single-user" key={index} onClick={()=>createChat(user?._id, u?._id)}>
                {u.name}
                <span className="user-online"></span>
            </div>
            );
        }))}
    </div>
    </> );
}
 
export default PotentialChats;