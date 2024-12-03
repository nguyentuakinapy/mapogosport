import { decodeString, encodeJson } from '@/components/Utils/Format';
import { Stomp } from '@stomp/stompjs';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SockJS from 'sockjs-client';
import Cookies from 'js-cookie';

interface UserProviderProps {
    children: ReactNode;
}
interface UserProviderProps {
    children: ReactNode;
    refreshKey: number;
}


const UserContext = createContext<User | null>(null);

export function UserProvider({ children, refreshKey }: UserProviderProps) {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        const socket = new SockJS(`${BASE_URL}ws`); // Địa chỉ endpoint WebSocket
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/wallet/username`, (message) => {
                getUser(message.body)
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            getUser(decodeString(String(storedUsername)));
        }
    }, [refreshKey]);

    const getUser = async (username: string) => {
        const responseUser = await fetch(`${BASE_URL}rest/user/${username}`);
        if (!responseUser.ok) {
            throw new Error('Error fetching data');
        }
        const dataUser = await responseUser.json() as User;

        sessionStorage.setItem('user', JSON.stringify(encodeJson(dataUser)));
        Cookies.remove('sessionDataAuth'); // Dành cho cookie không có HttpOnly
        setUserData(dataUser)

        await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataUser),

        }).then(async (response) => {
            const payload = await response.json();
            const data = {
                status: response.status,
                payload
            }
            if (!response.ok) {
                throw data
            }
        })
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