#!/usr/bin/env node

var REQUIRED_ENV_VARS = [
    'HOVER_API_USER',
    'HOVER_API_PASS',
    'HOVER_DDNS_DOMAIN',
    'HOVER_DDNS_SUBDOMAIN'];

REQUIRED_ENV_VARS.some(function (name) {
    if (! process.env[name] || ! process.env[name].length)
        throw new Error('Env var '+name+' must be set.');
});

var hover = require('hover-api')(
    process.env[REQUIRED_ENV_VARS[0]], process.env[REQUIRED_ENV_VARS[1]]);

var async = require('async');
var moira = require('moira');

var DOMAIN_NAME = process.env[REQUIRED_ENV_VARS[2]];
var SUBDOMAIN_NAME = process.env[REQUIRED_ENV_VARS[3]];

async.autoInject({
    ip: function(cb) {
        moira.getIP(function(err, ip, service) {
            if (err)
                return cb(err);
            console.log('Current IP:', ip);
            console.log('Received via:', service);
            cb(null, ip);
        });
    },
    dns: function(domain, cb) {
        hover.getDomainDns(domain, cb);
    },
    domain: function(cb) { cb(null, DOMAIN_NAME); },
    existingDnsRecordId: function(dns, cb) {
        var entry = dns[0].entries.filter(function(entry) {
            return entry.name === SUBDOMAIN_NAME;
        })[0];
        cb(null, typeof(entry) === 'object' ? entry.id : null);
    },
    removeDnsRecord: function(existingDnsRecordId, cb) {
        if ( ! existingDnsRecordId) return cb(null);
        hover.removeDns(existingDnsRecordId, cb);
    },
    createDnsRecord: function(removeDnsRecord, domain, ip, cb) {
        hover.createARecord(domain, SUBDOMAIN_NAME, ip, cb);
    }
}, function(err, results) {
    if (err)
        console.error('Error', err);
    else
        console.log('Success');
});

