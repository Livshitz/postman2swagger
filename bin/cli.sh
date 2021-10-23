#!/bin/bash

# Get dir of executable
dir=$( dirname $(realpath "$0") )/../
# Navigate to the dir
# cd $dir # commented out to keep releative paths (like output) intact
# Execute the main script and pass the args
node $dir/build/Main.js $@