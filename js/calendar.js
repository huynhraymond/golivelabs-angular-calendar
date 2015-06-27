
function CustomDate(id, date, monthType) {
    this.id = id;
    this.date = date;
    this.monthType = monthType;
    this.active = false;
}

function utcToString( utc ) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    utc = parseInt(utc);
    var date = new Date(utc);

    var str = days[date.getDay()] + ' ';

    str += monthToString(utc, true);

    return str;
}

function monthToString( utc, isDayInclude ) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    var date = new Date(utc);

    var day = isDayInclude ? ' ' + date.getDate() + ', ' : ' ';

    return (months[date.getMonth()] + day + date.getFullYear());
}

function timeToString(hr, mn) {
    var str = ( hr < 10 ) ? "0" + hr : hr;

    str += ":";

    str += (mn < 10) ? "0" + mn : mn;

    return str;
}

function Calendar() {}

Calendar.prototype.initCalendar = function(utc) {

    var month = [];                 // Array to hold days from previous, current, next months to make 6 weeks
    var now = new Date(utc);        // Create current date

    this.addDaysOfPrevMonth(now, month);
    this.addDaysOfCurrentMonth(now, month);
    this.addDaysOfNextMonth(now, month);

    return month;
};

Calendar.prototype.addDaysOfPrevMonth = function(now, month) {
    // 0 for Sunday - 6 for Saturday
    var firstDay = ( new Date(now.getFullYear(), now.getMonth(), 1) ).getDay();    // Sunday - Saturday
    var lastDay = (new Date(now.getFullYear(), now.getMonth(), 0)).getDate();

    // If current first day is Thursday, then prev month day is Wed and go back to fill the week
    for ( var i = 0, len = firstDay; i < len; i++ ) {
        var day = lastDay - i;
        var utc = +(new Date(now.getFullYear(), now.getMonth() - 1, day));
        month.unshift( new CustomDate(utc, day, "prev-month") );        // 0 -> prev month
    }
};

Calendar.prototype.addDaysOfCurrentMonth = function(now, month) {
    // Get current month last date
    var lastDate = (new Date(now.getFullYear(), now.getMonth() + 1, 0)).getDate();

    for ( var i = 1, len = lastDate; i <= len; i++ ) {
        var utc = +(new Date(now.getFullYear(), now.getMonth(), i));
        month.push( new CustomDate(utc, i, "current") );            // 1 -> current month
    }
};

Calendar.prototype.addDaysOfNextMonth = function(now, month) {
    // Fill the rest of calendar month with next month days -> 6 weeks calendar month = 42 days
    var daysLeft = 42 - month.length;
    for ( var i = 0; i < daysLeft; i++ ) {
        var utc = +( new Date( now.getFullYear(), now.getMonth() + 1, i + 1 ));
        month.push( new CustomDate(utc, i + 1, 'next-month') );        // 2 -> next month
    }
};



