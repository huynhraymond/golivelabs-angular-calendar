# golivelabs-angular-calendar

The calendar display is consisted of 7 days per week, 6 weeks for the total of 42 days - including previous,
now, and next month. 

The getMonth(boolean) simply take the boolean false or undefined for previous ( << ) month and true for next ( >> ),
then call the Calendar object init() to calculate the start and end day to fill the calendar display. In addition,
each day will have an id using the UTC format (mm/dd/yyyy) excluding (hh/mm/ss/ms).

The internal events create using Google API events. The request is making to Google event API (15 minutes interval),
the results then map to the calendar display.

The current display of 42 days is in memory; thus, we know that the zero index [0] is present the first and [41] is
the last. We also know that day in microsecs = 24 hrs * 60 mins * 60 secs * 1000 microsecs.

In order to calculate the event that map to specific day on the calendar, we do the following:

var index = ( event.id - [0].id ) / day;

event.id => day of event in UTC format(mm/dd/yyyy);
[0].id => the first day in the current display calendar;
the difference will the divide by total ms of the day;
We then obtain the index position of the event day, using CSS set to active.

