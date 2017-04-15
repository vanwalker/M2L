/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');

Thing.find({}).remove(function() {
    Thing.create({
        name : "Ligue d'escrime",
        info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.',
        reservationStart: '30/05/2016 16:00',
        reservationEnd: '30/05/2016 18:30',
        reservationDay: '30/05/2016',
        salle: '/corbin'
    }, {
        name : "Ligue de baseball",
        info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.',
        reservationStart: '02/06/2016 10:30',
        reservationEnd: '02/06/2016 12:00',
        reservationDay: '02/06/2016',
        salle: '/corbin'
    },{
        name : "Ligue de volley",
        info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.',
        reservationStart: '02/06/2016 08:30',
        reservationEnd: '02/06/2016 9:30',
        reservationDay: '02/06/2016',
        salle: '/corbin'
    },{
        name : "Ligue d   e volleyyy",
        info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.',
        reservationStart: '02/06/2016 08:30',
        reservationEnd: '02/06/2016 9:30',
        reservationDay: '02/06/2016',
        salle: '/multimedia'
    });
});

User.find({}).remove(function() {
    User.create({
            provider: 'local',
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
        }, {
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@admin.com',
            password: 'admin'
        }, function() {
            console.log('finished populating users');
        }
    );
});