import {
  concat,
  from,
  fromEvent,
  interval,
  Observable,
  Observer,
  of,
  pipe,
  Subject,
  throwError,
} from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  catchError,
  filter,
  map,
  mergeMap,
  multicast,
  publish,
  refCount,
  share,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { allBooks, Book } from "./data";
/*
//#region Creation of Observables

//-------------------------------------Creating an Observable using Constructor and Subscribe method-----------------------------------------
function subscribe(subscriber: Observer<Book>) {
  allBooks.forEach((book) => {
    subscriber.next(book);
  });
}

let firstSubscription$ = new Observable(subscribe);

let secondSubscription$ = new Observable((subscriber) => {
  if (document.title != "RxBookTracker")
    subscriber.error("incorrect page title");

  allBooks.forEach((book) => {
    subscriber.next(book);
  });

  setTimeout(() => {
    subscriber.complete();
  }, 2000);

  return () => console.log("teardown");
});

// allBooksObservable$.subscribe((e) => console.log(e));
// secondSubscription$.subscribe((e: Book) => console.log(e.title));

//-------------------------------------Creating an Observable using [of] function-----------------------------------------
let source1$ = of("hello", 1, true, { book: allBooks[0] });

let source2$ = of(allBooks); // this will fire only once and return the entire array

// source1$.subscribe((e) => console.log(e));

// source2$.subscribe((e) => console.log(e));

//-------------------------------------Creating an Observable using [from] function-----------------------------------------

let source3$ = from(allBooks); //each item of array will fire separately

// source3$.subscribe((e) => console.log(e));

//-------------------------------------Combining Observables using concat function -----------------------------------------

let source4$ = concat(source1$, source3$);

// source4$.subscribe((e) => console.log(e));

//-------------------------------------Observables from Events -----------------------------------------

let bookBtn = document.getElementById("showBooksBtn");

let booksList = document.getElementById("booksList");

fromEvent(bookBtn, "click").subscribe((event) => {
  console.log(event);
  booksList.innerHTML = allBooks
    .map((book) => `<li>${book.title}</li>`)
    .join("");
});

//-------------------------------------Observables from ajax request -----------------------------------------

ajax("/api/readers").subscribe((res) => {
  console.log(res.response);
});

//#endregion

//#region Multiple Subscriptions

source3$.subscribe((e) => {
  e.bookID = 0;
});
source3$.subscribe((e) => {
  console.log(e);
});

//#endregion

//#region cancelling subscription
let timer = new Observable((subscriber) => {
  let i = 0;
  let interval = setInterval(() => {
    subscriber.next(++i);
    console.log(i);
  }, 1000);

  return () => clearInterval(interval);
  //must clear interval or else console.log will keep running
  //even if we dont have a subscription
});

let subscription = timer.subscribe((e) => {
  booksList.innerHTML += `<li>${e}</li>`;
});

fromEvent(bookBtn, "click").subscribe((event) => {
  subscription.unsubscribe();
});
//#endregion

//#region Operators
let operatorsDiv = document.getElementById("operators");
ajax("/api/books")
  .pipe(
    mergeMap((response) => response.response),
    tap((e) => console.log(e))
  )
  .subscribe((e: any) => {
    operatorsDiv.innerHTML += `${e.title}<br>`;
  });

//take operator
let timerDiv = document.getElementById("timer");
timer.pipe(take(3)).subscribe((e) => {
  timerDiv.innerHTML += `${e}<br>`;
});
//takeUntil operator
//it only stops when that observable fires its first value
timer.pipe(takeUntil(fromEvent(bookBtn, "click"))).subscribe((e) => {
  timerDiv.innerHTML += `${e}<br>`;
});
//#endregion

//#region Custom Operators
function filterAndLogOperator(filterValue, logValues) {
  return (sourceObservable) => {
    return new Observable((subscriber) => {
      sourceObservable.subscribe(
        (book) => {
          if (book.publicationYear < filterValue) {
            subscriber.next(book);
            if (logValues) console.log(`Custom operator: ${book.title}`);
          }
        },
        (err) => subscriber.error(err),
        () => subscriber.complete()
      );
    });
  };
}

function filterAndLogPipeOperator(filterValue, logValues) {
  return (source) =>
    source.pipe(
      filter((e: any) => e.publicationYear < filterValue),
      tap((e: any) => {
        if (logValues) console.log(`Custom pipe operator: ${e.title}`);
      })
    );
}

from(allBooks)
  .pipe(filterAndLogOperator(1930, true))
  .pipe(filterAndLogPipeOperator(1930, true))
  .subscribe((res) => {});
//#endregion

//#region  Error Handling
let readersDiv = document.getElementById("readers");
let fallbackReader = { readerID: 0, name: "none" };
ajax("/api/readers")
  .pipe(
    mergeMap((response) => response.response),
    map((e: any) => {
      if (e.readerID == 2) throw "error in second stream";
      else return e;
    }),
    catchError((err) => {
      console.log(err);
      return of(fallbackReader);
    })
  )
  .subscribe(
    (e: any) => {
      readersDiv.innerHTML += `${e.readerID}: ${e.name}<br>`;
    },
    (err) => {
      alert(err);
    }
  );
//#endregion

//#region Subjects

//Subjects vs Observables (Multicasting)
let observable = from(allBooks);
observable.subscribe((res) => console.log(`observer 1 ${res.title}`));
observable.subscribe((res) => console.log(`observer 2 ${res.title}`));

let s = new Subject();

s.subscribe((res) => console.log(`subject observer 1 ${res}`));
s.subscribe((res) => console.log(`subject observer 2 ${res}`));

observable.subscribe((res) => s.next(res.title));

//Cold (Observables):

let intervalObservable = interval(1000).pipe(take(4));

intervalObservable.subscribe((res) => console.log(`first observer: ${res}`));
setTimeout(() => {
  intervalObservable.subscribe((res) => console.log(`second observer: ${res}`));
}, 1000);
setTimeout(() => {
  intervalObservable.subscribe((res) => console.log(`third observer: ${res}`));
}, 2000);

//notice that all observables will get all the values [0,1,2,3]

//Hot (Subjects):

let subject$ = new Subject();

subject$.subscribe((res) => console.log(`first observer: ${res}`));

setTimeout(() => {
  subject$.subscribe((res) => console.log(`second observer: ${res}`));
}, 1000);
setTimeout(() => {
  subject$.subscribe((res) => console.log(`third observer: ${res}`));
}, 2000);

intervalObservable.subscribe((res) => subject$.next(res));

//notice that the first two observers recieve 0, and all three recieve 1, and so on..
*/

//Operators

//publish()
let publishObs = interval(500).pipe(take(5), publish(), refCount());
publishObs.subscribe((res) => console.log(`publish() observer: ${res}`));

setTimeout(() => {
  publishObs.subscribe((res) => console.log(`publish() late observer: ${res}`));
}, 4000);

//share()
let shareObs = interval(500).pipe(take(5), share());
shareObs.subscribe((res) => console.log(`share() observer: ${res}`));

setTimeout(() => {
  shareObs.subscribe((res) => console.log(`share() late observer: ${res}`));
}, 4000);

//#endregion
