# Motivator

## Demo

Right [here](https://dkennedy.io/motivator).

## Development

1. Run the following command from the project root directory:

    ```
    $ python -m http.server
    ```

2. Open [this](http://localhost:8000) in your browser.

## Disclaimer

This is still very much in development and subject to breaking changes. If you
want to use it before I've announced a release, please let me know so I can be
careful not to destroy your data.

## TODO

* Analytics
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
