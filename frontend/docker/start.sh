#!/bin/bash
#
# This script rebuilds the app every 15 minutes and copies the files to the nginx directory
# It also saves a ready and healthy file in /tmp

terminate() {
    echo "We're exiting"
    exit 0
}

# Trap SIGTERM signal and call the terminate function
trap terminate EXIT

# Start the subprocesses in the background
./build-loop.sh &
nginx &

# Wait forever (or until a signal is caught)
sleep 100000 & wait
