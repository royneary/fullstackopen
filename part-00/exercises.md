# Exercise 0.4

Creating a new note on the page https://studies.cs.helsinki.fi/exampleapp/notes causes the following sequence of events:

```mermaid
sequenceDiagram
  participant browser
  participant server

  browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
  activate server
  server->>browser: Status Code 302 (Redirect) with location /exampleapp/notes
  deactivate server

  Note right of browser: The redirect instructs the browser to reload the whole page

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
  activate server
  server-->>browser: HTML document
  deactivate server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
  activate server
  server-->>browser: the css file
  deactivate server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
  activate server
  server-->>browser: the JavaScript file
  deactivate server

  Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
  activate server
  server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
  deactivate server

  Note right of browser: The browser executes the callback function that renders the notes
```


# Exercise 0.5

Visiting the page https://studies.cs.helsinki.fi/exampleapp/spa causes the following sequence of events:

```mermaid
sequenceDiagram
  participant browser
  participant server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
  activate server
  server-->>browser: HTML document
  deactivate server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
  activate server
  server-->>browser: the css file
  deactivate server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
  activate server
  server-->>browser: the JavaScript file
  deactivate server

  Note right of browser: The browser executes the JavaScript code that initializes an empty notes array and fetches the JSON from the server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
  activate server
  server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
  deactivate server

  Note right of browser: The browser assigns the received notes to the notes array and renders them as a HTML list

```


# Exercise 0.6

Creating a new note on the page https://studies.cs.helsinki.fi/exampleapp/spa causes the following sequence of events:

```mermaid
sequenceDiagram
  participant browser
  participant server

  Note right of browser: The browser appends a new note object to the notes array and re-renders the HTML list, then sends a request to the server

  browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
  activate server
  server->>browser: {"message":"note created"}
  deactivate server

```
