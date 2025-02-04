export function repeat(data) {
    const newData = {
        id: crypto.randomUUID(),
        created: data.completed || data.redeemed,
        name: data.name,
        description: data.description,
        points: data.points,
    };

    if (isNaN(data.repeatDuration)) {
        newData.repeat = true;
        newData.repeatFrequency = data.repeatFrequency;
    } else if (data.repeatDuration > 2) {
        newData.repeat = true;
        newData.repeatDuration = data.repeatDuration - 1;
        newData.repeatFrequency = data.repeatFrequency;
    }

    if (data.repeatFrequency) {
        newData.startDate = getNextStartDate(data.completed || data.redeemed, data.repeatFrequency);
    }

    return newData;
}

export function getNextRepeatStreak(data) {
    if (!data.repeatStreak) {
        return 1;
    }

    const streakEndDate = getNextStartDate(data.startDate || data.created, data.repeatFrequency);

    if (data.completed >= streakEndDate) {
        return 1;
    }

    return data.repeatStreak + 1;
}

export function getNextStartDate(date, frequency) {
    const nextDate = new Date(date);
    nextDate.setHours(0, 0, 0, 0);

    if (!frequency || frequency === 'daily') {
        nextDate.setDate(nextDate.getDate() + 1);
    } else if (frequency === 'weekly') {
        const daysTilNextWeek = 7 - nextDate.getDay();
        nextDate.setDate(nextDate.getDate() + daysTilNextWeek);
    } else if (frequency === 'monthly') {
        nextDate.setDate(1);
        nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (frequency === 'yearly') {
        nextDate.setDate(1);
        nextDate.setMonth(0);
        nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    return nextDate.getTime();
}
