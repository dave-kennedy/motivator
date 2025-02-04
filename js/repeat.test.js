import assert from 'node:assert/strict';
import {test} from 'node:test';

import {getNextRepeatStreak, getNextStartDate, repeat} from './repeat.js';

function repeatTest(data) {
    data = {
        completed: Date.parse('1/20/2025, 11:59:59 PM MST'),
        name: 'Test',
        description: 'This is a test',
        points: 3,
        repeat: true,
        ...data
    };

    const newData = repeat(data);
    assert.equal(newData.id.length, 36);
    assert.equal(newData.created, data.completed);
    assert.equal(newData.name, data.name);
    assert.equal(newData.description, data.description);
    assert.equal(newData.points, data.points);
    return newData;
}

test('repeat goal repeats indefinitely', _ => {
    const newData = repeatTest();
    assert.equal(newData.repeat, true);
    assert.equal(newData.repeatDuration, undefined);
    assert.equal(newData.repeatFrequency, undefined);
    assert.equal(newData.startDate, undefined);
});

test('repeat goal decrements duration', _ => {
    const newData = repeatTest({repeatDuration: 3});
    assert.equal(newData.repeat, true);
    assert.equal(newData.repeatDuration, 2);
    assert.equal(newData.repeatFrequency, undefined);
    assert.equal(newData.startDate, undefined);
});

test('repeat goal does not repeat after duration', _ => {
    const newData = repeatTest({repeatDuration: 2});
    assert.equal(newData.repeat, undefined);
    assert.equal(newData.repeatDuration, undefined);
    assert.equal(newData.repeatFrequency, undefined);
    assert.equal(newData.startDate, undefined);
});

test('repeat daily goal repeats indefinitely, starts next day', _ => {
    const newData = repeatTest({repeatFrequency: 'daily'});
    assert.equal(newData.repeat, true);
    assert.equal(newData.repeatDuration, undefined);
    assert.equal(newData.repeatFrequency, 'daily');
    assert.equal(newData.startDate, Date.parse('1/21/2025, 12:00:00 AM MST'));
});

test('repeat daily goal decrements duration, starts next day', _ => {
    const newData = repeatTest({
        repeatDuration: 3,
        repeatFrequency: 'daily',
    });

    assert.equal(newData.repeat, true);
    assert.equal(newData.repeatDuration, 2);
    assert.equal(newData.repeatFrequency, 'daily');
    assert.equal(newData.startDate, Date.parse('1/21/2025, 12:00:00 AM MST'));
});

test('repeat daily goal does not repeat after duration, starts next day', _ => {
    const newData = repeatTest({
        repeatDuration: 2,
        repeatFrequency: 'daily',
    });

    assert.equal(newData.repeat, undefined);
    assert.equal(newData.repeatDuration, undefined);
    assert.equal(newData.repeatFrequency, undefined);
    assert.equal(newData.startDate, Date.parse('1/21/2025, 12:00:00 AM MST'));
});

test('getNextRepeatStreak starts new streak', _ => {
    const data = {
        created: Date.parse('1/20/2025, 12:00:00 PM MST'),
        completed: Date.parse('1/20/2025, 11:59:59 PM MST'),
    };

    const result = getNextRepeatStreak(data);
    assert.equal(result, 1);
});

test('getNextRepeatStreak completed after end date resets streak', _ => {
    const data = {
        created: Date.parse('1/20/2025, 12:00:00 PM MST'),
        completed: Date.parse('1/21/2025, 12:00:01 AM MST'),
        repeatStreak: 1,
    };

    const result = getNextRepeatStreak(data);
    assert.equal(result, 1);
});

test('getNextRepeatStreak completed before end date increments streak', _ => {
    const data = {
        created: Date.parse('1/20/2025, 12:00:00 PM MST'),
        completed: Date.parse('1/20/2025, 11:59:59 PM MST'),
        repeatStreak: 1,
    };

    const result = getNextRepeatStreak(data);
    assert.equal(result, 2);
});

test('getNextRepeatStreak weekly completed after end date resets streak', _ => {
    const data = {
        created: Date.parse('1/20/2025, 12:00:00 PM MST'),
        startDate: Date.parse('1/26/2025, 12:00:00 AM MST'),
        completed: Date.parse('2/2/2025, 12:00:01 AM MST'),
        repeatFrequency: 'weekly',
        repeatStreak: 1,
    };

    const result = getNextRepeatStreak(data);
    assert.equal(result, 1);
});

test('getNextRepeatStreak weekly completed before end date increments streak', _ => {
    const data = {
        created: Date.parse('1/20/2025, 12:00:00 PM MST'),
        startDate: Date.parse('1/26/2025, 12:00:00 AM MST'),
        completed: Date.parse('2/1/2025, 11:59:59 PM MST'),
        repeatFrequency: 'weekly',
        repeatStreak: 1,
    };

    const result = getNextRepeatStreak(data);
    assert.equal(result, 2);
});

test('getNextStartDate returns next day', _ => {
    const date = Date.parse('1/20/2025, 11:59:59 PM MST');
    const result = getNextStartDate(date);
    assert.equal(result, Date.parse('1/21/2025, 12:00:00 AM MST'));
});

test('getNextStartDate daily returns next day', _ => {
    const date = Date.parse('1/20/2025, 11:59:59 PM MST');
    const result = getNextStartDate(date, 'daily');
    assert.equal(result, Date.parse('1/21/2025, 12:00:00 AM MST'));
});

test('getNextStartDate weekly returns next week', _ => {
    const date = Date.parse('1/20/2025, 11:59:59 PM MST');
    const result = getNextStartDate(date, 'weekly');
    assert.equal(result, Date.parse('1/26/2025, 12:00:00 AM MST'));
});

test('getNextStartDate monthly returns next month', _ => {
    const date = Date.parse('1/20/2025, 11:59:59 PM MST');
    const result = getNextStartDate(date, 'monthly');
    assert.equal(result, Date.parse('2/1/2025, 12:00:00 AM MST'));
});

test('getNextStartDate yearly returns next year', _ => {
    const date = Date.parse('1/20/2025, 11:59:59 PM MST');
    const result = getNextStartDate(date, 'yearly');
    assert.equal(result, Date.parse('1/1/2026, 12:00:00 AM MST'));
});
