# AP Basic Stats

This is a simple tracker that emulates some basic functions of the default multitracker.
The only difference is that this doesn't read it directly from the server data, but connects to slots specified in an
environment variable so it can be used without a webhost.

## Build Instructions

`docker build -t ap-basic-stats .`