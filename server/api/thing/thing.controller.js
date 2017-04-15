/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');
var moment = require('moment');

// Get list of things
exports.index = function (req, res) {
    Thing.find({

        name: "Ligue de volley"
    },function (err, things) {
        if ( err ) {
            return handleError(res, err);
        }
        return res.json(200, things);
    }).where('name').equals("Ligue de volley");
};

//Get list by date
exports.reservationByDate = function (req, res) {
    Thing.find({
        reservationDay: req.params.day + '/' + req.params.month + '/' + req.params.year,
        salle: '/' + req.params.room
    }, function (err, things) {

        if ( err ) {
            return handleError(res, err);
        }
        return res.json(208, things);
    });
};


// Get a single thing
exports.show = function (req, res) {
    Thing.findById(req.params.id, function (err, thing) {
        if ( err ) {
            return handleError(res, err);
        }
        if ( !thing ) {
            return res.send(404);
        }
        return res.json(thing);
    });
};

// Creates a new thing in the DB.
exports.create = function (req, res) {
console.log('ici...');
    console.log(req.body);
    var datesDifferences = moment(req.body.reservationEnd, "DD/MM/YYYY HH:mm").diff(moment(req.body.reservationStart, "DD/MM/YYYY HH:mm"), 'days');
    var dataObj = {
        name: req.body.name,
        salle: req.body.salle
    };
    console.log(datesDifferences);

    function isDateFreeToReserve(dateObject, callback) {
        Thing.find({
          /* reservationDay: dateObject.reservationDay,
           salle: dateObject.salle*/
        })
            .where('reservationDay').equals(dateObject.reservationDay)
            .where('salle').equals(dateObject.salle)
            .exec(function (err, result) {
                var isFree = true;

                for (var index in result) {
                    var resas = result[index];
                    var format = "DD/MM/YYYY HH:mm";
                    var resStart = moment(dateObject.reservationStart, format);
                    var resEnd = moment(dateObject.reservationEnd, format);
                    var currResEnd = moment(resas.reservationEnd, format);
                    var currResStart = moment(resas.reservationStart, format);
                    console.log('departresa : ' + resStart);console.log('db : '+currResStart);

                    if ( resStart.isBetween(currResStart, currResEnd) || resEnd.isBetween(currResStart, currResEnd) || currResStart.isBetween(resStart, resEnd) || currResEnd.isBetween(resStart, resEnd) || (resStart === currResStart)) {
                        // console.log("resstart " + resStart.format(format));
                        // console.log("resend " + resEnd.format(format));
                        // console.log("currresend(db) " + currResEnd.format(format));
                        // console.log("currresstart(db) " + currResStart.format(format));
                        isFree = false;
                        console.log(isFree);
                        return res.json(400, {message: 'Not valid, please try again.'});
                        break;
                    }
                }
                callback(isFree);
            });
    }


    function roomRangeModifier(date, hourModifier, isRoomStart) {
        var tmp = date.split(' ')[0];
        if ( date.split(':')[1] === '00' || isRoomStart ) {
            hourModifier <= 9 ? tmp = tmp + ' 0' + hourModifier + ':00' : tmp = tmp + ' ' + hourModifier + ':00';
        } else
            hourModifier <= 9 ? tmp = tmp + ' 0' + hourModifier + ':30' : tmp = tmp + ' ' + hourModifier + ':30';
        return tmp;
    }


    function isWeekEnd(date) {
        var isWeekEnd = false;
        if ( 0 === moment(date, "DD/MM/YYYY").weekday() || 6 === moment(date, "DD/MM/YYYY").weekday() ) {
            isWeekEnd = true;
        }
        return isWeekEnd;
    }

    function createReservation(dataObjects) {
        dataObjects.forEach(function(obj) {
            !isWeekEnd(obj.reservationDay) && Thing.create(obj, function(err) {
                if (err) {
                    console.log(err);
                }
            })
        });
    }

    function clone(obj) {
        var result = {};

        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                result[prop] = obj[prop];
            }
        }
        return result;
    }

    if ( datesDifferences < 0 ) {
        console.log("erreur dans les dates");
    } else {
        var isSameDay = 0,
            isOneDayDifference = 1,
            promises = [];

        for (var day = 0; day <= datesDifferences; day++) {

            dataObj.reservationDay = moment(req.body.reservationStart, "DD/MM/YYYY HH:mm").add(day, 'days').format("DD/MM/YYYY");

            if ( datesDifferences === isSameDay ) {
                dataObj.reservationStart = req.body.reservationStart;
                dataObj.reservationEnd = req.body.reservationEnd;
            } else if ( datesDifferences === isOneDayDifference ) {
                if ( day === 0 ) {
                    dataObj.reservationStart = req.body.reservationStart;
                    dataObj.reservationEnd = roomRangeModifier(dataObj.reservationDay, req.body.roomEnd, false);
                } else {
                    dataObj.reservationStart = roomRangeModifier(dataObj.reservationDay, req.body.roomStart, true);
                    dataObj.reservationEnd = req.body.reservationEnd;
                }
            } else {
                if ( day === 0 ) {
                    dataObj.reservationStart = req.body.reservationStart;
                    dataObj.reservationEnd = roomRangeModifier(req.body.reservationStart, req.body.roomEnd, false);
                } else if ( day !== datesDifferences ) {
                    dataObj.reservationStart = roomRangeModifier(dataObj.reservationDay, req.body.roomStart, true);
                    dataObj.reservationEnd = roomRangeModifier(dataObj.reservationDay, req.body.roomEnd, false);
                } else {
                    dataObj.reservationStart = roomRangeModifier(dataObj.reservationDay, req.body.roomStart, true);
                    dataObj.reservationEnd = req.body.reservationEnd;
                }
            }

            promises.push(new Promise(
                function (resolve, reject) {
                    var dataObjectCopy = clone(dataObj);

                    isDateFreeToReserve(dataObjectCopy, function (isFree) {
                        isFree ? resolve(dataObjectCopy) : reject();
                    });
                })
            );
        }

        Promise.all(promises).then(createReservation, function() {
            console.log("validation failed");

        });
    }
};

// Updates an existing thing in the DB.
exports.update = function (req, res) {
    if ( req.body._id ) {
        delete req.body._id;
    }
    Thing.findById(req.params.id, function (err, thing) {
        if ( err ) {
            return handleError(res, err);
        }
        if ( !thing ) {
            return res.send(404);
        }
        var updated = _.merge(thing, req.body);
        updated.save(function (err) {
            if ( err ) {
                return handleError(res, err);
            }
            return res.json(200, thing);
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function (req, res) {
    Thing.findById(req.params.id, function (err, thing) {
        if ( err ) {
            return handleError(res, err);
        }
        if ( !thing ) {
            return res.send(404);
        }
        thing.remove(function (err) {
            if ( err ) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}

