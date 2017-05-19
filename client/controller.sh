#!/bin/bash

# hi="cd .."
# $hi
# ls


if [ "$#" -eq 2 ]; then
    printf "" 1> $2

    while read line; do
        # if [ ${line:0:3} == "ls" ]; then
        #     $line 1>> $2
        # fi
        $line
        if [ "$?" == 0 ] ; then
            echo "Finished executing command:" "$line" 1>> $2 
        else
            echo "Did not finish executing command:" "$line" 1>> $2 
        fi
        
        echo " " 1>> $2
    done <$1
else
    echo "Incorrect Usage"
    exit 1
fi
