

### Auth state listeners
Components that register a listener with auth.js should remove that listener when they are unmounted. This is to avoid memory leaks.

### Google logout Problems
The google api logout function does not seem to work on local host unless the server is run on port 8080.