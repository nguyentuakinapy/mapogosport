import { decodeString, encodeJson } from '@/components/Utils/Format';
import { Stomp } from '@stomp/stompjs';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SockJS from 'sockjs-client';
import useSWR, { mutate } from 'swr';

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
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const socket = new SockJS(`${BASE_URL}ws`); // Địa chỉ endpoint WebSocket
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/wallet/username`, (message) => {
                mutate(`${BASE_URL}rest/user/${message.body}`)
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(decodeString(storedUsername));
            mutate(`${BASE_URL}rest/user/${decodeString(storedUsername)}`)
        }
    }, [refreshKey]);

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error } = useSWR(
        username ? `${BASE_URL}rest/user/${username}` : null, // Dùng null nếu username chưa có
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
            sessionStorage.setItem('user', JSON.stringify(encodeJson(data)));
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