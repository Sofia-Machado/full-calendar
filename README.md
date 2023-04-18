# Call Center Agenda

This is a calendar/agenda created with the [Full Calendar API](https://fullcalendar.io/).

## Purpose

This calendar interface is directed to a call center worker.
- In here, the user can insert multiple tasks with different attributes, on different time slots.
- The user can drag and resize the event or change the date manually.
- There is a list with new events to insert in the calendar, they can be inserted simply by dragging and dropping them in the calendar container. In this list there are also past but incomplete and mandatory events that are meant to be added again to the calendar.
- Clicking on an event gives the user the possibility to change the event's attributes or delete them.

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
