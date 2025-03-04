![Motivator](img/logo.png)

Motivator makes it easy to keep track of your goals and reward yourself when
you meet them.

The idea is simple: you're more likely to meet your goals when you feel good,
so go ahead and reward yourself for little victories.

No more beating yourself up with "shouldy thinking." Celebrate your
accomplishments, no matter how small, and you might start to love that early
morning jog or whatever it is you've been dreading.

Check it out [here](https://dkennedy.io/motivator).

> [!NOTE]
> The web app relies solely on local storage for persistence, which means all
> your data will be lost if you clear your browser cache. Consider using the
> [Android app](https://github.com/dave-kennedy/motivator-android) if this is a
> concern.

## Running

1. Run `python -m http.server` from the project root directory.
2. Navigate to [http://localhost:8000](http://localhost:8000) in your browser.

Feel free to use another server. I like Python's because it's easier to use than
anything I've found in the Node ecosystem.

## Testing

1. Run `node --test` from the project root directory.

## BUGS

* Moving any custom element with `append`, `before`, `after`, etc. causes it to
  be re-rendered, duplicating its contents

## TODO

* Analytics
* Cloud sync
* Hints on editor/history
* More unit tests
* Recalculate repeat streak/repeated items when completed date is updated
* User defined sorting
