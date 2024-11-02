import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useSWR from 'swr';

interface UserProviderProps {
    children: ReactNode;
}

const UserContext = createContext<User | null>(null);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [userData, setUserData] = useState<User | null>(null);
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUserData = JSON.parse(user) as User;
            setUsername(parsedUserData.username);
        }
    }, []);

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error, isLoading } = useSWR(
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
            console.error("Error fetching data:", error);
        }
        if (data) {
            console.log("Data fetched:", data);
            setUserData(data);
        }
    }, [data, error]);

    console.log("Username:", username);
    console.log("UserData in context:", userData);

    return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
}

export function useData() {
    return useContext(UserContext);
}