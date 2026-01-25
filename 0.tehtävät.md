FSO 0.4

Uuden muistiinpanon tekeminen lähettää 5 http pyyntöä (302)

Sequence diagram

Participant browser
Participant server

browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note 
activate server
server-->>browser: (muistiinpanon post ja 302 lataa muut sivut. Failed to load response)
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
activate server
server-->>browser: html sivu
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
activate server
server-->>browser: the css file
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
activate server
server-->>browser: the JavaScript file
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
activate server
server-->>browser: the data.json file
deactivate server

FSO 0.5

Kun käyttäjä menee sivulle https://studies.cs.helsinki.fi/exampleapp/spa

Sequence diagram

Participant browser
Participant server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
activate server
server-->>browser: html sivu
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
activate server
server-->>browser: the css file
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
activate server
server-->>browser: the JavaScript file
deactivate server

browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
activate server
server-->>browser: the data.json file ([
    {
        "content": "mari…)
deactivate server


FSO 0.6

Kun käyttäjä tekee uuden muistiinpanon https://studies.cs.helsinki.fi/exampleapp/spa sivulla lähetetään vain yksi tiedosto. Tämä on single page app idea

Sequence diagram

Participant browser
Participant server

browser->>server: POST (201) https://studies.cs.helsinki.fi/exampleapp/new_note_spa
activate server
server-->>browser: {"message":"note created"}
deactivate server
