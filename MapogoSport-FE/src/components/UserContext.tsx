'use client'
import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
    userData: User | null;  // Dữ liệu user có thể là null ban đầu
    setUserData: (user: User | null) => void;  // Hàm để cập nhật dữ liệu
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};

// Provider cho context
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};
