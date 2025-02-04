import assert from 'node:assert/strict';
import {test} from 'node:test';

import repeat from './repeat.js';

test('No duration, no frequency, repeats indefinitely, starts immediately', _ => {
    const item = {
        name: 'Test',
        description: 'This is a test',
        points: 3,
        repeat: true,
    };

    const newItem = repeat(item);

    assert(newItem.id.length === 36);
    assert(newItem.created > 0);
    assert(newItem.name === item.name);
    assert(newItem.description === item.description);
    assert(newItem.points === item.points);
    assert(newItem.repeat === item.repeat);
    assert(newItem.repeatDuration === undefined);
    assert(newItem.repeatFrequency === undefined);
    assert(newItem.startDate === undefined);
});

test('Duration = 3, no frequency, repeats 2 more times, starts immediately', _ => {
    const item = {
        name: 'Test',
        description: 'This is a test',
        points: 3,
        repeat: true,
        repeatDuration: 3,
    };

    const newItem = repeat(item);

    assert(newItem.id.length === 36);
    assert(newItem.created > 0);
    assert(newItem.name === item.name);
    assert(newItem.description === item.description);
    assert(newItem.points === item.points);
    assert(newItem.repeat === item.repeat);
    assert(newItem.repeatDuration === 2);
    assert(newItem.repeatFrequency === undefined);
    assert(newItem.startDate === undefined);
});

test('Duration = 2, no frequency, does not repeat, starts immediately', _ => {
    const item = {
        name: 'Test',
        description: 'This is a test',
        points: 3,
        repeat: true,
        repeatDuration: 2,
    };

    const newItem = repeat(item);

    assert(newItem.id.length === 36);
    assert(newItem.created > 0);
    assert(newItem.name === item.name);
    assert(newItem.description === item.description);
    assert(newItem.points === item.points);
    assert(newItem.repeat === undefined);
    assert(newItem.repeatDuration === undefined);
    assert(newItem.repeatFrequency === undefined);
    assert(newItem.startDate === undefined);
});

test('No duration, frequency = daily, repeats indefinitely, starts tomorrow', context => {
    const item = {
        name: 'Test',
        description: 'This is a test',
        points: 3,
        repeat: true,
        repeatFrequency: 'daily',
    };

    context.mock.timers.enable({
        apis: ['Date'],
        now: Date.parse('1/20/2025, 11:59:59 PM MST'),
    });

    const newItem = repeat(item);

    assert(newItem.id.length === 36);
    assert(newItem.created > 0);
    assert(newItem.name === item.name);
    assert(newItem.description === item.description);
    assert(newItem.points === item.points);
    assert(newItem.repeat === item.repeat);
    assert(newItem.repeatDuration === undefined);
    assert(newItem.repeatFrequency === 'daily');
    assert(newItem.startDate === Date.parse('1/21/2025, 12:00:00 AM MST'));
});

test('Duration = 3, frequency = daily, repeats 2 more times, starts tomorrow', context => {
    const item = {
        name: 'Test',
        description: 'This is a test',
        points: 3,
        repeat: true,
        repeatDuration: 3,
        repeatFrequency: 'daily',
    };

    context.mock.timers.enable({
        apis: ['Date'],
        now: Date.parse('1/20/2025, 11:59:59 PM MST'),
    });

    const newItem = repeat(item);

    assert(newItem.id.length === 36);
    assert(newItem.created > 0);
    assert(newItem.name === item.name);
    assert(newItem.description === item.description);
    assert(newItem.points === item.points);
    assert(newItem.repeat === item.repeat);
    assert(newItem.repeatDuration === 2);
    assert(newItem.repeatFrequency === 'daily');
    assert(newItem.startDate === Date.parse('1/21/2025, 12:00:00 AM MST'));
});

test('Duration = 2, frequency = daily, does not repeat, starts tomorrow', context => {
    const item = {
        name: 'Test',
        description: 'This is a test',
        points: 3,
        repeat: true,
        repeatDuration: 2,
        repeatFrequency: 'daily',
    };

    context.mock.timers.enable({
        apis: ['Date'],
        now: Date.parse('1/20/2025, 11:59:59 PM MST'),
    });

    const newItem = repeat(item);

    assert(newItem.id.length === 36);
    assert(newItem.created > 0);
    assert(newItem.name === item.name);
    assert(newItem.description === item.description);
    assert(newItem.points === item.points);
    assert(newItem.repeat === undefined);
    assert(newItem.repeatDuration === undefined);
    assert(newItem.repeatFrequency === undefined);
    assert(newItem.startDate === Date.parse('1/21/2025, 12:00:00 AM MST'));
});

test('No duration, frequency = weekly, repeats indefinitely, starts next week', context => {
    const item = {
        name: 'Test',
        description: 'This is a test',
        points: 3,
        repeat: true,
        repeatFrequency: 'weekly',
    };

    context.mock.timers.enable({
        apis: ['Date'],
        now: Date.parse('1/20/2025, 11:59:59 PM MST'),
    });

    const newItem = repeat(item);

    assert(newItem.id.length === 36);
    assert(newItem.created > 0);
    assert(newItem.name === item.name);
    assert(newItem.description === item.description);
    assert(newItem.points === item.points);
    assert(newItem.repeat === item.repeat);
    assert(newItem.repeatDuration === undefined);
    assert(newItem.repeatFrequency === 'weekly');
    assert(newItem.startDate === Date.parse('1/26/2025, 12:00:00 AM MST'));
});

test('No duration, frequency = monthly, repeats indefinitely, starts next month', context => {
    const item = {
        name: 'Test',
        description: 'This is a test',
        points: 3,
        repeat: true,
        repeatFrequency: 'monthly',
    };

    context.mock.timers.enable({
        apis: ['Date'],
        now: Date.parse('1/20/2025, 11:59:59 PM MST'),
    });

    const newItem = repeat(item);

    assert(newItem.id.length === 36);
    assert(newItem.created > 0);
    assert(newItem.name === item.name);
    assert(newItem.description === item.description);
    assert(newItem.points === item.points);
    assert(newItem.repeat === item.repeat);
    assert(newItem.repeatDuration === undefined);
    assert(newItem.repeatFrequency === 'monthly');
    assert(newItem.startDate === Date.parse('2/1/2025, 12:00:00 AM MST'));
});

test('No duration, frequency = yearly, repeats indefinitely, starts next year', context => {
    const item = {
        name: 'Test',
        description: 'This is a test',
        points: 3,
        repeat: true,
        repeatFrequency: 'yearly',
    };

    context.mock.timers.enable({
        apis: ['Date'],
        now: Date.parse('1/20/2025, 11:59:59 PM MST'),
    });

    const newItem = repeat(item);

    assert(newItem.id.length === 36);
    assert(newItem.created > 0);
    assert(newItem.name === item.name);
    assert(newItem.description === item.description);
    assert(newItem.points === item.points);
    assert(newItem.repeat === item.repeat);
    assert(newItem.repeatDuration === undefined);
    assert(newItem.repeatFrequency === 'yearly');
    assert(newItem.startDate === Date.parse('1/1/2026, 12:00:00 AM MST'));
});
