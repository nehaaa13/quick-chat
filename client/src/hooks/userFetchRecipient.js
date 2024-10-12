import { useEffect, useState } from "react";
import { getRequest, baseUrl } from "../utils/services";
import { useContext } from "react";


export const useFetchRecipientUser =(chat, user)=>{
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

     const recipientId = chat?.members.find((id)=> id !==user?._id)

     console.log("Current UserID:", user?._id);
     console.log("Recipient", user);
    useEffect(()=>{
        const getUser = async()=>{
            if(!recipientId) return null;

            const response = await getRequest(`${baseUrl}/find/${recipientId}`);

            if(response.error){
                return setError(error);
            }

            setRecipientUser(response);
        };
        getUser();
    }, []);

    return {recipientUser, error};
}