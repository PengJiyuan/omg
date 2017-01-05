#!/bin/bash
'use strict';

var path = require('path');
var execFile = require('child_process').execFile;
var rootDir = path.join(__dirname, '..');
var scriptPath = path.join(__dirname, 'pre_commit.sh');

console.log('-----ADD ESLINT HOOK JOB: Start!-----');

execFile(scriptPath, [rootDir], null, function() {
  console.log('-----ADD ESLINT HOOK JOB: Done!-----');
});

