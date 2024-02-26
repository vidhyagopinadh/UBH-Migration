import React, { createContext } from "react";
import { UserContextType } from "../types/contexttypes";

export const UserContext = createContext<UserContextType>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    name: "",
    groups: "",
    role: "",
    id: "",
    emailVerified: false,
    profilePicId: "",
});
