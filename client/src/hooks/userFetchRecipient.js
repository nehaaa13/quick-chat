import { useEffect, useState } from "react";
import { getRequest, baseUrl } from "../utils/services";
import { useContext } from "react";


export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members.find((id) => id !== user?._id)

    //----------------CONSOLE----------------
    //  console.log("Current UserID:", user?._id);
    //  console.log("Recipient", user);
    //  console.log("Recipient", recipientUser);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return;

            try {
                const response = await getRequest(`${baseUrl}/find/${recipientId}`);

                // Check if the response contains an error or is null
                if (!response || response.error) {
                    setError(response?.error || "Failed to fetch recipient user");
                    return;
                }

                setRecipientUser(response); // The response is the recipient user data
            } catch (err) {
                setError("An unexpected error occurred");
            }
        };

        getUser();
    }, [recipientId]);

    return { recipientUser, error };
}