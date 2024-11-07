import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useSWR from 'swr';

interface UserProviderProps {
    children: ReactNode;
}
interface UserProviderProps {
    children: ReactNode;
    refreshKey: number;
}

const UserContext = createContext<User | null>(null);

export function UserProvider({ children, refreshKey }: UserProviderProps) {
    const [userData, setUserData] = useState<User | null>(null);
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        const user = localStorage.getItem('username');

        if (user) {
            setUsername(user);
        }
    }, [refreshKey]);

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error } = useSWR(
        username === "" ? null : `http://localhost:8080/rest/user/${username}`,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    useEffect(() => {
        if (error) {
            // console.error("Error fetching data:", error);
        }
        if (data) {
            console.log("Data fetched:", data);
            setUserData(data);
        }
    }, [data, error]);

    // console.log("Username:", username);
    // console.log("UserData in context:", userData);

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
}

export function useData() {
    const userData = useContext(UserContext);
    // if (userData === null) {
    //     // console.warn("User data is null.");
    // }
    return userData;
}