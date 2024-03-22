#!/bin/bash

# Define the directory name
dir_name="CalamityModPublic"

# Check if the directory exists
if [ ! -d "$dir_name" ]; then
    # If it doesn't exist, clone the repository
    git clone https://github.com/CalamityTeam/CalamityModPublic.git
else
    # If it exists, cd into the directory and pull the latest changes
    cd "$dir_name" || exit
    git pull
fi
