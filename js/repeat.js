export default function repeat({name, description, points, repeatDuration, repeatFrequency}) {
    const item = {
        id: crypto.randomUUID(),
        created: Date.now(),
        name: name,
        description: description,
        points: points,
    };

    if (isNaN(repeatDuration)) {
        item.repeat = true;
        item.repeatFrequency = repeatFrequency;
    } else if (repeatDuration > 2) {
        item.repeat = true;
        item.repeatDuration = repeatDuration - 1;
        item.repeatFrequency = repeatFrequency;
    }

    if (!repeatFrequency) {
        return item;
    }

    const startDate = new Date(item.created);
    startDate.setHours(0, 0, 0, 0);

    if (repeatFrequency === 'daily') {
        startDate.setDate(startDate.getDate() + 1);
    } else if (repeatFrequency === 'weekly') {
        const daysTilNextWeek = 7 - startDate.getDay();
        startDate.setDate(startDate.getDate() + daysTilNextWeek);
    } else if (repeatFrequency === 'monthly') {
        startDate.setDate(1);
        startDate.setMonth(startDate.getMonth() + 1);
    } else if (repeatFrequency === 'yearly') {
        startDate.setDate(1);
        startDate.setMonth(0);
        startDate.setFullYear(startDate.getFullYear() + 1);
    }

    item.startDate = startDate.getTime();
    return item;
}
