# Motivator

## Demo

Right [here](https://dkennedy.io/motivator).

## Running

1. Run `python -m http.server` from the project root directory.
2. Navigate to [http://localhost:8000](http://localhost:8000) in your browser.

Feel free to use another server. I like Python's because it's easier to use than
anything I've found in the Node ecosystem.

## Testing

1. Run `node --test` from the project root directory.

## Disclaimer

This app relies solely on local storage for persistence, which means all your
data will be lost if you clear your browser cache. In fact, the whole data
layer is extremely naive. I may do something different in the future but only
if people are actually using it. So please give me your feedback!

## TODO

* Analytics
* Android app
* Better data
    * Cloud storage
    * Incremental loading
* Better favicon
* Better repeat animation
    * Flip instead of swipe?
* Goal repeat streaks
    * Repeats immediately: 3 times in a day
    * Repeats daily/weekly/etc.: 3 days/weeks/etc. in a row
    * Double streak: 6 times/days/etc. in a row
    * Triple streak: 12 times/days/etc. in a row
    * Do something neat when duration is met
        * Bonus points?
        * Fancy animation?
        * Only if duration > 3, or what?
* Import/export JSON
* More unit tests
* User defined sorting
