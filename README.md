Cassiopeia
======

This project is a fork of polastre's united upgrade availability search. My fork allows you to return all the bucket space for a route in a range of dates for a one-way flight. It then tells you how many spaces are available for GPU/RPU and MileagePlus upgrade awards.

![award search](https://github.com/pyrohaz4good/cassiopeia/raw/master/screenshots/screenshot1.png)

Polastre made a great tool, I just added some web prettiness to make it easier to find the bucket space you're looking for. If this tool breaks, just go to his version and use it.


## united.js tool (polastre v2.2015 release)

The main component is a node.js script that goes through the United.com search process.

Follow these steps to get started:

1. Install [Node.js](https://nodejs.org)
2. [Download this repository]
3. Extract the zip file
4. Open up a command shell and switch to the extracted directory
5. Install node dependencies by typing `npm install`

Run the tool with:

    node server.js

Then open your browser to http://localhost:3000/search

## All the original FAQs from polastre still apply so here they are:

The relevant sections of the FAQ in [2014/www/templates/index.html](2014/www/templates/index.html) are copied here.

### Why can you only search one-way?

The best way to put together a successful upgrade plan for a round trip ticket is to be flexible on your dates.  By searching both directions separately, you can pick which dates in each direction are most convenient for you to travel.  Then you can combine the results for the final ticket that you intend to book.

### Why do I get no results?

Airlines are funny companies.  The "fare classes" available determines whether there's an upgrade or not.  This changes by time of day, day of week, how many other customers are booked in for the flight, number of days until the flight, and probably the phase of the moon.  The **best days to look for upgrades** are in the middle of the week when fewer people are buying airline tickets.

Keep in mind that upgrades are rarely available for peak travel periods, such as summer school vacation, unless booked exactly one year in advance.

### Who Is This For?

United Premier 1K members, Global Services, anyone holding an upgrade certificate (Global Premier Upgrade or Regional Upgrade), or anyone that wants to use miles and cash to upgrade can find flights and dates that have **immediate upgrade availability**.  If you book a flight with immediate upgrade availability, the agent on the phone can confirm you in the next class of service immediately after booking.  You can also book online and choose to the flights that have a green "instant upgrade" arrow (be sure to use [Advanced Search](https://www.united.com/ual/en/us/flight-search/book-a-flight) and select the upgrade option you want).

### How Do I Use This?

This tool searches for **one-way** availability between the two specified airports.  It looks at every date, and determines whether immediately upgradable seats are available.  You should put your outbound flight in a one query, and then your potential return flight (and date range) as another.  When you find both outbound and return flights with upgrade availability, then go to [united.com](https://www.united.com/ual/en/us/flight-search/book-a-flight) and search with those specific dates.

### Why the stupid name?
Cassiopei is a constellation that allows you to find Polaris, the north star. Polaris is the name of United's new business class product that few have ever actually seen besides the soft product.
