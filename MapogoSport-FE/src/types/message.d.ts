interface Message{
    messageId: number;
    sender: User;
    receiver: User;
    content: string;
    createAt: Date;
    isDelete: boolean;
    // groupedMessage: GroupedMessage 
}

// interface GroupedMessage {
//     user: User;
//     content: string;
//     timestamp: string | Date;
//   }