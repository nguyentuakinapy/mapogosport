const createTimeStringH = (startTimeBooking: string, endTimeBooking: string): string[] => {
    const getTime = startTimeBooking && startTimeBooking.match(/(\d+)h(\d+)/);
    const startHours = getTime ? Number(getTime[1]) : 0;
    const startMinutes = getTime ? Number(getTime[2]) : 0;

    const timeSlots = [];

    let currentHours = startHours;
    let currentMinutes = startMinutes;

    if (startTimeBooking && endTimeBooking) {
        for (let i = 0; i <= calculateTimeDifference(startTimeBooking, endTimeBooking) / 30; i++) {
            timeSlots.push(`${currentHours}h${currentMinutes === 0 ? '00' : currentMinutes}`);
            currentMinutes += 30;

            if (currentMinutes >= 60) {
                currentHours += Math.floor(currentMinutes / 60);
                currentMinutes = currentMinutes % 60;
            }
        }
    }
    // timeSlots.shift();
    timeSlots.pop();
    return timeSlots;
}

const calculateTimeDifference = (start: string, end: string) => {
    const startTotalMinutes = convertToMinutes(start);
    const endTotalMinutes = convertToMinutes(end);

    return endTotalMinutes - startTotalMinutes;
};

const convertToMinutes = (time: string) => {
    const [hours, minutes] = time.split('h').map(Number);
    return (hours * 60) + minutes;
};

const isDateInRange = (dateToCheck: string, startDate: Date, endDate?: Date): boolean => {
    const date = new Date(new Date(dateToCheck).setHours(0, 0, 0, 0));
    const start = new Date(new Date(startDate).setHours(0, 0, 0, 0));

    if (!endDate) {
        return date >= start;
    }

    const end = new Date(new Date(endDate).setHours(0, 0, 0, 0));

    return date >= start && date <= end;
};


const getSport = async (owner: Owner): Promise<SportField[]> => {
    const responseSport = await fetch(`http://localhost:8080/rest/sport_field_by_owner/${owner.ownerId}`);
    if (!responseSport.ok) {
        throw new Error("Error fetching data");
    }
    const dataSport = (await responseSport.json()) as SportField[];
    return dataSport || [];
};

export { createTimeStringH, calculateTimeDifference, convertToMinutes, isDateInRange, getSport };
