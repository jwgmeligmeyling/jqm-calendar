jqm-calendar
============

Simple iOS-style calendar plugin for jQuery Mobile for both showing activities or picking dates

```js
$("#calendar").jqmCalendar({
   events : [ { "summary" : "Test event", "begin" : new Date(), "end" : new Date() } ],
   months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
   days : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
   startOfWeek : 0
}); 
```
