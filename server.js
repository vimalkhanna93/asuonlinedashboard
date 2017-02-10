var path = require('path');
var googleapis = require('googleapis');
var JWT = googleapis.auth.JWT;
var analytics = googleapis.analytics('v3');
var moment = require('moment');
var async = require("async");

// Google Analytics authentication
var key = require(path.join(__dirname,
		'ASU Online Analytics Dashboard-65e8759b9928.json'));
var jwtClient = new JWT(key.client_email, null, key.private_key,
		[ 'https://www.googleapis.com/auth/analytics.readonly' ], null);
var profile_id = 'ga:24315440';
var today_date = 'today';

var dashboard_active_users_data;

var dashboard_hourly_psu_data;
var dashboard_monthly_psu_data;
var dashboard_monthly_browsers_data;
var dashboard_monthly_US_state_data;
var dashboard_monthly_countries_data;
var dashboard_daily_psu_data;
var dashboard_daily_browsers_data;
var dashboard_daily_US_state_data;
var dashboard_daily_countries_data;

var dashboard_analytics = {
		"dashboard_hourly_psu_data" : dashboard_hourly_psu_data ,
		"dashboard_monthly_psu_data" : dashboard_monthly_psu_data,
		"dashboard_monthly_browsers_data" : dashboard_monthly_browsers_data,
		"dashboard_monthly_US_state_data" : dashboard_monthly_US_state_data,
		"dashboard_monthly_countries_data" : dashboard_monthly_countries_data,
		"dashboard_daily_psu_data" : dashboard_daily_psu_data,
		"dashboard_daily_browsers_data" : dashboard_daily_browsers_data,
		"dashboard_daily_US_state_data" : dashboard_daily_US_state_data,
		"dashboard_daily_countries_data" : dashboard_daily_countries_data
		};

function dashboardData(context) {
	async.series({
		dashboard_hourly_psu_data: function(callback){
	             analytics.data.ga.get({
	                 'auth':       jwtClient,
	                 'ids':        profile_id,
	                 'start-date': today_date,
	                 'end-date':   today_date,
	                 'dimensions': 'ga:hour',
	                 'metrics':    'ga:pageviews,ga:sessions,ga:users'
	             }, function (err, result) {
	                 if (!err)
	                     dashboard_hourly_psu_data = result.rows;
	                 else
	                     console.log(err);
	                 callback(null, dashboard_hourly_psu_data);
	             });
	    },
	    dashboard_monthly_psu_data: function(callback){
	            analytics.data.ga.get({
	                'auth':       jwtClient,
	                'ids':        profile_id,
	                'start-date': moment().subtract(1, 'year').date(1).month(0).format('YYYY-MM-DD'),
	                'end-date':   moment().format('YYYY-MM-DD'),
	                'dimensions': 'ga:month,ga:nthMonth',
	                'metrics':    'ga:pageviews,ga:sessions,ga:users',
	                'sort':       'ga:nthMonth'
	            }, function (err, result) {
	                if (!err)
	                    dashboard_monthly_psu_data = result.rows;
	                else
	                    console.log(err);
	                callback(null, dashboard_monthly_psu_data);
	            });
	    },
	    dashboard_monthly_browsers_data: function(callback){
	            analytics.data.ga.get({
	                'auth':       jwtClient,
	                'ids':        profile_id,
	                'start-date': moment().date(1).format('YYYY-MM-DD'),
	                'end-date':   moment().format('YYYY-MM-DD'),
	                'dimensions': 'ga:browser',
	                'metrics':    'ga:users',
	                'sort':       '-ga:users',
	                'max-results': 5
	            }, function (err, result) {
	                if (!err)
	                    dashboard_monthly_browsers_data = result.rows;
	                else
	                    console.log(err);
	                callback(null, dashboard_monthly_browsers_data);
	            });
	    },
	    dashboard_monthly_US_state_data: function(callback){
	            analytics.data.ga.get({
	                'auth':       jwtClient,
	                'ids':        profile_id,
	                'start-date': moment().date(1).format('YYYY-MM-DD'),
	                'end-date':   moment().format('YYYY-MM-DD'),
	                'dimensions': 'ga:region',
	                'metrics':    'ga:users',
	                'sort':       '-ga:users',
	                'filter':     'ga:country==United States',
	            }, function (err, result) {
	                if (!err)
	                    dashboard_monthly_US_state_data = result.rows;
	                else
	                    console.log(err);
	                callback(null, dashboard_monthly_US_state_data);
	            });
	    },
	    dashboard_monthly_countries_data: function(callback){
	            analytics.data.ga.get({
	                'auth':       jwtClient,
	                'ids':        profile_id,
	                'start-date': moment().date(1).format('YYYY-MM-DD'),
	                'end-date':   moment().format('YYYY-MM-DD'),
	                'dimensions': 'ga:country',
	                'metrics':    'ga:users',
	                'sort':       '-ga:users',
	                'filter':     'ga:country!=United States',
	            }, function (err, result) {
	                if (!err)
	                    dashboard_monthly_countries_data = result.rows;
	                else
	                    console.log(err);
	                callback(null, dashboard_monthly_countries_data);
	            });
	    },
	    dashboard_daily_psu_data: function(callback){
	            analytics.data.ga.get({
	                'auth':         jwtClient,
	                'ids':          profile_id,
	                'start-date':   moment().subtract(1, 'day').day(0).subtract(1, 'week').format('YYYY-MM-DD'),
	                'end-date':     moment().format('YYYY-MM-DD'),
	                'dimensions':   'ga:date,ga:nthDay',
	                'metrics':      'ga:pageviews,ga:sessions,ga:users',
	                'sort':         'ga:nthDay'
	            }, function (err, result) {
	                if (!err)
	                    dashboard_daily_psu_data = result.rows;
	                else
	                    console.log(err);
	                callback(null, dashboard_daily_psu_data);
	            });
	    },
	    dashboard_daily_browsers_data: function(callback){
	            analytics.data.ga.get({
	                'auth':       jwtClient,
	                'ids':        profile_id,
	                'start-date': today_date,
	                'end-date':   today_date,
	                'dimensions': 'ga:browser',
	                'metrics':    'ga:users',
	                'sort':       '-ga:users',
	                'max-results': 5
	            }, function (err, result) {
	                if (!err)
	                    dashboard_daily_browsers_data = result.rows;
	                else
	                    console.log(err);
	                callback(null, dashboard_daily_browsers_data);
	            });
	    },
	    dashboard_daily_US_state_data: function(callback){
	            analytics.data.ga.get({
	                'auth':       jwtClient,
	                'ids':        profile_id,
	                'start-date': today_date,
	                'end-date':   today_date,
	                'dimensions': 'ga:region',
	                'metrics':    'ga:users',
	                'sort':       '-ga:users',
	                'filter':     'ga:country==United States',
	            }, function (err, result) {
	                if (!err)
	                    dashboard_daily_US_state_data = result.rows;
	                else
	                    console.log(err);
	                callback(null, dashboard_daily_US_state_data);
	            });
	    },
	    dashboard_daily_countries_data: function(callback){
	            analytics.data.ga.get({
	                'auth':       jwtClient,
	                'ids':        profile_id,
	                'start-date': today_date,
	                'end-date':   today_date,
	                'dimensions': 'ga:country',
	                'metrics':    'ga:users',
	                'sort':       '-ga:users',
	                'filter':     'ga:country!=United States',
	            }, function (err, result) {
	                if (!err)
	                    dashboard_daily_countries_data = result.rows;
	                else
	                    console.log(err);
	                callback(null, dashboard_daily_countries_data);
	            });
	    }
	},
	function(err, results) {
		if(results.dashboard_hourly_psu_data===undefined)
			results.dashboard_hourly_psu_data = [];
		if(results.dashboard_monthly_psu_data===undefined)
			results.dashboard_monthly_psu_data = [];
		if(results.dashboard_monthly_browsers_data===undefined)
			results.dashboard_monthly_browsers_data = [];
		if(results.dashboard_monthly_US_state_data===undefined)
			results.dashboard_monthly_US_state_data = [];
		if(results.dashboard_monthly_countries_data===undefined)
			results.dashboard_monthly_countries_data = [];
		if(results.dashboard_daily_psu_data===undefined)
			results.dashboard_daily_psu_data = [];
		if(results.dashboard_daily_browsers_data===undefined)
			results.dashboard_daily_browsers_data = [];
		if(results.dashboard_daily_US_state_data===undefined)
			results.dashboard_daily_US_state_data = [];
		if(results.dashboard_daily_countries_data===undefined)
			results.dashboard_daily_countries_data = [];
	   context.done(null, results);
	});
}

function activeUsers(context) {
        analytics.data.realtime.get({
            'auth':       jwtClient,
            'ids':        profile_id,
            'metrics':    'rt:activeUsers',
            'dimensions': 'rt:deviceCategory,rt:userType'
        }, function (err, data) {
            if(!err)
                dashboard_active_users_data = data.rows;
            else
                console.log(err);
            context.done(null, dashboard_active_users_data);
        });
}

exports.handler = function(event, context) {

	jwtClient.authorize(function(err, tokens) {
		 if (err) {
		        console.log(err);
		        context.done(null, dashboard_analytics);
		        return;
		    }

		 var event_context = event["context"];
		 var resource = event_context["resource-path"];
		 if(resource != null && resource==="/dashboard-analytics/activeusers")
		 {
			 activeUsers(context);
		 }
		 else if(resource != null && resource==="/dashboard-analytics")
		 {
			 dashboardData(context);
		 }
		 else
		 {
			 context.done(null, dashboard_analytics);
		 }
	});
};
