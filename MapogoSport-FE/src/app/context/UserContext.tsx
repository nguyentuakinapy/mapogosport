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
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, [refreshKey]);

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error } = useSWR(
        username ? `http://localhost:8080/rest/user/${username}` : null, // Dùng null nếu username chưa có
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        if (data) {
            setUserData(data);
            sessionStorage.setItem('user', JSON.stringify(data));
        }
    }, [data]);

    if (error) {
        console.error("Error fetching user data:", error);
    }

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
}

export function useData() {
    const userData = useContext(UserContext);
    return userData;
}