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

## BUGS

* Moving any custom element with `append`, `before`, `after`, etc. causes it to
  be re-rendered, duplicating its contents

## TODO

* Analytics
* Android app
* Cloud sync
* Better favicon
* More unit tests
* Recalculate repeat streak/repeated items when completed date is updated
* User defined sorting
