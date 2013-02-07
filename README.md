jqm-calendar
============

Simple iOS-style calendar plugin for jQuery Mobile for both showing activities or picking dates.

```js
$("#calendar").jqmCalendar({
   events : [ { "summary" : "Test event", "begin" : new Date(), "end" : new Date() } ],
   months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
   days : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
   startOfWeek : 0
}); 
```

Listen to changes via the event:
```js
$("#calendar").bind('change', function(event, date) {
   console.log(date);
});
```

Change the current month by calling refresh:
```js
$("#calendar").trigger('refresh', new Date("2013-01-01"))
```
