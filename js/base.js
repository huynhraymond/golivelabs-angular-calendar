
var calendarApp = angular.module('calendarApp', []);

calendarApp.run(['EventsService', function(EventsService){
    var apikey = 'AIzaSyDnS-PyjZDwxvJrFzCD9BO0i6w3h-LWp5k';
    var url = 'https://www.googleapis.com/calendar/v3/calendars/nina2308%40gmail.com/events?key='+apikey;


    EventsService.makeAjaxCall(url).success( function(data) {
        EventsService.setEvents(data);
    });
}]);

calendarApp.controller('CalendarEventsCtrl', ['$scope', 'EventsService', function($scope, EventsService) {
    var calendar = new Calendar();

    $scope.currentUTC = +( new Date() );
    $scope.month = calendar.initCalendar($scope.currentUTC);
    $scope.monthTitle = monthToString($scope.currentUTC);

    $scope.getMonth = function(arg) {
        var date = new Date($scope.currentUTC);

        if ( !arg )   $scope.currentUTC = +(new Date(date.getFullYear(), date.getMonth(), 0));  // Previous month
        else $scope.currentUTC = +(new Date(date.getFullYear(), date.getMonth() + 1, 1));   // Next Month

        $scope.month = calendar.initCalendar($scope.currentUTC);
        $scope.monthTitle = monthToString($scope.currentUTC);

        updateCalendarEvents();
    };

    var allEvents = [];
    $scope.events = [];

    $scope.getEvent = function(start) {

        $scope.events = [];

        var date = +new Date();
        var id = start || date;         // Else display events from today on
        var maxDisplay = 5;             // Only display 5 events

        if ( id < date )  return;      // Do NOT want to display past events

        for ( var i = 0, len = allEvents.length; i < len; i++ ) {
            if ( $scope.events.length >= maxDisplay ) break;

            if ( allEvents[i].id >= id ) $scope.events.push(allEvents[i]);
        }
    };

    /*
    $scope.eventFilter = function(event) {
        if ( event.id >= date ) return true;
        return false;
    };
    */

    $scope.$watch( function() { return EventsService.getEvents(); },
        function(newValue) {

            allEvents = newValue;

            //console.log(allEvents);

            $scope.getEvent();
            updateCalendarEvents();
        }
    );

    function updateCalendarEvents() {
        var first = $scope.month[0].id;         // The very first day on the monthly calendar utc/id
        var last  = $scope.month[$scope.month.length - 1].id;

        var ms = 24 * 60 * 60 * 1000;           // total ms in one day

        for ( var i = 0, len = allEvents.length; i < len; i++ ) {

            // We do not want prior and past events that are not in current display calendar
            if ( allEvents[i].id < first || allEvents[i].id >= last) continue;

            // Find the index of event on calendar base upon id
            var index = (allEvents[i].id - first) / ms;

            $scope.month[index].active = true;

        }
    }
}]);

calendarApp.factory('EventsService', ['$http', function($http) {
    var events = [];

    /*
    var events = [
        {id: 1435474800000, date: (new Date(1435474800000)).toString().split(" ").slice(0, -2).join(" "),
            title: "Cuxi Birthday"},
        {id: 1433142000000, date: (new Date(1433142000000)).toString().split(" ").slice(0, -2).join(" "),
            title: "Rosy Birthday"},
        {id: 1435820400000, date: (new Date(1435820400000)).toString().split(" ").slice(0, -2).join(" "),
            title: "Steven Birthday"},
        {id: 1437548400000, date: (new Date(1437548400000)).toString().split(" ").slice(0, -2).join(" "),
            title: "Cuxi School"},
        {id: 1436511600000, date: (new Date(1436511600000)).toString().split(" ").slice(0, -2).join(" "),
            title: "Rosy Vacation"},
        {id: 1433055600000, date: (new Date(1433055600000)).toString().split(" ").slice(0, -2).join(" "),
            title: "Steven Dentist"},
        {id: 1435647600000, date: (new Date(1435647600000)).toString().split(" ").slice(0, -2).join(" "),
            title: "Raymond Interview"},
    ];      */

    return {
        getEvents: function() {
            return events;
        },

        setEvents: function(data) {

            var results = [];

            // only interest in events from today on
            var now = +new Date();

            results = data.items.filter( function(event) {
                if ( !event.start.dateTime || !event.end.dateTime)    return false;   // missing date time - discard

                if ( +new Date(event.start.dateTime) >= now )       return true;

                return false;
            });

            var temp = [];
            results.map( function(event) {
                temp.push(eventHelper(event));
            });

            events = temp;
        },

        makeAjaxCall: function(url) {
            return $http.get(url);
        }
    };

    function eventHelper(event) {

        var date = new Date(event.start.dateTime);      // Only interest in year, month and date
        var utc = +new Date(date.getFullYear(), date.getMonth(), date.getDate());

        var startStr = (new Date(event.start.dateTime)).toString();
        startStr = startStr.split(" ").slice(0, -2).join(" ");

        var endStr = (new Date(event.end.dateTime)).toString();
        endStr = endStr.split(" ").slice(0, -2).join(" ");

        return {id: utc, start: startStr, end: endStr, title: event.summary}
    }
}]);
