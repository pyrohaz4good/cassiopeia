
var appRouter = function(app, searcher) {
  // POST method route
  app.post('/search', function (req, res) {
    var flightResults = ""
    var sendError = function(errmsg, req, res) {
      var fs = require('fs')
      var _ = require('lodash')
      var errorconfig = {
        start: req.body.startDate,
        end: req.body.endDate,
        origin: new String(req.body.origin),
        destination: new String(req.body.destination)

      }
      var foothtml = fs.readFileSync(__dirname + '/main_template_footer.html')
      var formhtml = fs.readFileSync(__dirname + '/form_template.ejs')
      var template = _.template(formhtml)
      var formhtml_tmp = template({data: errorconfig})

      var bodyhtml = fs.readFileSync(__dirname + '/main_template.html')
      //bodyhtml += formhtml + foothtml

      bodyhtml += formhtml_tmp
      bodyhtml += "<br><div class='alert alert-danger' role='alert'>You need to specify the " + errmsg + ".</div>"
      bodyhtml += foothtml
      res.send(bodyhtml);

    }

    if (!req.body.startDate) {
      return sendError("start date of the flight search", req, res);
        //return res.send({"status": "error", "message": "No origin"});
    } else if(!req.body.endDate) {
      return sendError("end date of the flight search", req, res);
      //  return res.send({"status": "error", "message": "No destination"});
    } else if(!req.body.origin) {
      return sendError("origin", req, res);
      //  return res.send({"status": "error", "message": "No start date"});
    } else if(!req.body.destination) {
      return sendError("destination", req, res);
      //return sendError("End Date", req, res);
    } else if(req.body.origin) {


      var _ = require('lodash')
      var fs = require('fs')
      var request = require('request')
      var async = require ('async')
      var colors = require('colors');
      var args = process.argv.slice(2);

      // load the default json blob
      var formData = require('../united_request.json')

      // these are the final result datasets
      var finalResults = []

      // set data based on args
      var config = {
        origin: new String(req.body.origin),
        destination: new String(req.body.destination),
        start: new Date(req.body.startDate),
        end: new Date(req.body.endDate)
      }


      var headers = {
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"
      }
      var sendError = function(errmsg, res, req) {
        var fs = require('fs')
        var _ = require('lodash')
        var errorconfig = {
          origin: new String(req.body.origin),
          destination: new String(req.body.destination),
          start: new Date(req.body.startDate),
          end: new Date(req.body.endDate)
        }
        var foothtml = fs.readFileSync(__dirname + '/main_template_footer.html')
        var formhtml = fs.readFileSync(__dirname + '/form_template.ejs')
        var template = _.template(formhtml)
        var formhtml_tmp = template({data: errorconfig})

        var bodyhtml = fs.readFileSync(__dirname + '/main_template.html')
        //bodyhtml += formhtml + foothtml

        bodyhtml += formhtml_tmp
        bodyhtml += "<div class='alert alert-danger' role='alert'>You need to specify the " + errormsg + ".</div>"
        bodyhtml += foothtml
        res.send(bodyhtml);

      }
      /**
       * Gets the right referer URL for where the XHR request is coming from
       */
      var getReferer = function (origin, destination, dateString) {
        return 'https://www.united.com/ual/en/us/flight-search/book-a-flight/results/rev?f=' +
          origin +
          '&t=' +
          destination +
          '&d=' +
          dateString +
          '&tt=1&st=bestmatches&cbm=-1&cbm2=-1&ut=MUA&sc=7&px=1&taxng=1&idx=1'
      }

      /**
       * Get the URL for making the XHR request
       */
      var getUrl = function (origin, destination, dateString) {
        return 'https://www.united.com/ual/en/us/flight-search/book-a-flight/flightshopping/getflightresults/rev'
      }

      /**
       * Convert the date into a string format that can be used in requests
       */
      var getDateString = function (date) {
        var d = ('0' + date.getDate()).slice(-2)
        var m = ('0' + (date.getMonth() + 1)).slice(-2)
        var y = date.getFullYear()
        return y + '-' + m + '-' + d
      }

      /**
       * Clone the default data payload and set options for this search
       */
      var setData = function (inputData, origin, destination, dateString) {
        var data = _.cloneDeep(inputData)
        data['Origin'] = origin
        data['Destination'] = destination
        data['DepartDate'] = dateString
        data['ReturnDate'] = dateString
        data['Trips'][0]['Origin'] = origin
        data['Trips'][0]['Destination'] = destination
        data['Trips'][0]['DepartDate'] = dateString
        data['Trips'][0]['ReturnDate'] = dateString
        return data
      }

      /**
       * Parse the resulting data from United
       */
      var parseResults = function (data) {
        var upgrades = []
        if (data.data['Trips'])
        {

        var flights = data.data['Trips'][0]['Flights']
        for (var i = 0; i < flights.length; i++) {
          var products = flights[i]['Products']
          console.log(flights[i]['BookingClassAvailList'])
          if (products[1]['UpgradeInfo'] &&
              products[1]['UpgradeInfo']['Available'] === true &&
              products[1]['UpgradeInfo']['Waitlisted'] === false) {
            upgrades.push(flights[i])
          }
        }
        return upgrades
        } else {

            return null;
        }

      }

      /**
       * Load, process, and return results for a given date
       */
      var loadResults = function (origin, destination, date, cb) {
        var dateString = getDateString(date)
        var options = {
          url: getUrl(origin, destination, dateString),
          headers: _.clone(headers),
          method: 'POST'
        }
        options.headers['Referer'] = getReferer(origin, destination, dateString)
        data = setData(formData, origin, destination, dateString)
        options.json = data
        request(options, function (error, response, body) {
          var upgrades = []
          if (!error) {
            // update results
            upgrades = parseResults(body)
          }
          finalResults.push({
            date: date,
            upgrades: upgrades,
            error: error
          })
          return cb(error)
        })
      }

      /**
       * Helper function for async call
       */
      var loadResultsByDate = function (date, cb) {
        return loadResults(config.origin, config.destination, date, cb)
      }

      /**
       * Pretty print the results so that they are human readable
       */
      var foothtml = fs.readFileSync(__dirname + '/main_template_footer.html')

      var bodyhtml = fs.readFileSync(__dirname + '/main_template.html')

      // Prepare search form with posted variables and add to output buffer
      var formHTML = fs.readFileSync(__dirname + '/form_template.ejs')
      var template = _.template(formHTML)
      bodyhtml += template({data: req.body})
      bodyhtml += "<p class='lead'>Results</p><table class='table table-bordered'><thead><th>Date</th><th>Miles + $ Cost</th><th>Flight</th><th>Description</th><th>Upgrades</th></thead>"

      var printResults = function (result) {

        if (result.upgrades) {

          if (result.upgrades.length > 0) {

            console.log(getDateString(result.date).green.bold)

          } else {
            console.log(getDateString(result.date).red.bold)
            bodyhtml += "<tr><td style='white-space: nowrap'>" + getDateString(result.date)+"</td><td></td><td></td><td></td><td><span class='badge alert-danger'>No Upgrades Available</span></td>"
          }
          var templateFile = fs.readFileSync(__dirname + '/united_template.ejs')
          var template = _.template(templateFile)

          for (var i = 0; i < result.upgrades.length; i++) {
            console.log(template({ data: result.upgrades[i] }))
            bodyhtml += "<tr><td style='white-space: nowrap'><span class='label label-success'>" + getDateString(result.date) + "</span></td>"
            bodyhtml += template({ data: result.upgrades[i] })
            bodyhtml += "</tr>"
          }


        } else {
          bodyhtml += "<div class='alert alert-danger' role='alert'>No results for your search for date " + getDateString(result.date) + ".</div>"
        }
      }



      var dates = []
      for (var d = new Date(config.start); d <= config.end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d))
      }

      async.each(dates, loadResultsByDate, function (err) {
        finalResults.sort(function (a,b) { return a.date - b.date })
        for (var i = 0; i < finalResults.length; i++) {
          printResults(finalResults[i])
        }
        console.log(finalResults)
        res.send(bodyhtml + "</table>" + foothtml);
      })



    } else {


    }
  });

 app.get("/search", function(req, res) {
    var fs = require('fs')
    var _ = require('lodash')
    var defaultconfig = {
      origin: "",
      destination: "",
      start: new Date(),
      end: new Date()
    }
    var foothtml = fs.readFileSync(__dirname + '/main_template_footer.html')
    var formhtml = fs.readFileSync(__dirname + '/form_template.ejs')
    var template = _.template(formhtml)
    var formhtml_tmp = template({data: defaultconfig})

    var bodyhtml = fs.readFileSync(__dirname + '/main_template.html')
    //bodyhtml += formhtml + foothtml
    bodyhtml += formhtml_tmp + foothtml
    res.send(bodyhtml);
 });

}

module.exports = appRouter;
