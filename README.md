# Call Center Agenda

This is a calendar/agenda created with the [Full Calendar API](https://fullcalendar.io/).

## Purpose

This calendar interface is directed to a call center worker.
- In here, the user can insert multiple events with different attributes, on different time slots (always after the time indicator).
- The user can drag and resize the event or change the date manually, for not mandatory events. For mandatory events, the user is able to drag and drop the event to duplicate it.
- There is a list with new events to insert in the calendar, they can be inserted simply by dragging and dropping them in the calendar container. In this list there are also past but incomplete and mandatory events that are meant to be added again to the calendar.
- Clicking on an unblocked event gives the user the possibility to change the event's attributes by replacing them, duplicate the event or delete it.
- It is possible to search an event by name, sorted by categories.
- The agenda can be filtered by mandatory and categories.

When an event is duplicated or is dragged automatically to the waiting list , there is a text in the original event with that description and the background color changes.
When there are multiple events on a cell, they are sorted by mandatory first.
When in the waiting list, the past but incomplete mandatory event has a different color and a tooltip saying to reschedule the event.

### Requirements

- Node + npm
- React
- Full Calendar
- JSON server
- Material UI

### Installation

- Clone the repo: `git clone https://github.com/Sofia-Machado/full-calendar.git`
- Run `npm install --legacy-peer-deps` in your terminal
- Run `npm install -g json-server --legacy-peer-deps`
- Run `npm run serve-json`
- Open http://localhost:8080/events or http://localhost:8080/dragItemList to view the database. This will allow you to interact with the database. You may need to change the date manually to today
- Run `npm start` to run the app in developement mode
- Open http://localhost:3000 to view the app in your browser.
- Now you can organize your day!
