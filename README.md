# Din Oas Webbtjänst

Denna webbtjänst är utvecklad för företaget Din Oas. I denna så hanteras innehåll om Nyheter, Tjänster och Projekt samt användare. Webbtjänsten är skapad med Hapi.js och är kopplad till 
en MongoDB databas. 

## Anrop 
Nedan finns en tabell för samtliga anrop som kan göras till webbtjänsten. 

<table>
  <tr>
    <th>Anrop</th>
    <th>Ändpunkt</th> 
    <th>Beskrivning</th>
  </tr>
  
  <tr>
    <td>GET</td>
    <td>/news</td> 
    <td>Hämstar samtliga nyheter</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/news/{id}</td> 
    <td>Hämtar nyhet med angivet id</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/news</td> 
    <td>Lägger till en nyhet</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/news/{id}</td> 
    <td>Uppdaterar nyhet med angivet id</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/news/{id}</td> 
    <td>Raderar nyhet med angivet id</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/portfolio</td> 
    <td>Hämtar alla projekt i portfolio</td
  </tr>
  <tr>
    <td>GET</td>
    <td>/portfolio/{id}</td> 
    <td>Hämtar projekt med angivet id</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/portfolio</td> 
    <td>Lägger till projekt i portfolio</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/portfolio/{id}</td> 
    <td>Uppdaterar projekt med angivet id</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/portfolio/{id}</td> 
    <td>Raderar projekt med angivet id</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/service</td> 
    <td>Hämtar alla tjänster</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/service/{id}</td> 
    <td>Hämtar tjänst med angivet id</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/service</td> 
    <td>Lägger till en ny tjänst</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/service/{id}</td> 
    <td>Uppdaterar tjänst med angivet id</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/service/{id}</td> 
    <td>Raderar tjänst med angivet id</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/adduser</td> 
    <td>Lägger till ny användare</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/loginuser</td> 
    <td>Loggar in användare</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/protected</td> 
    <td>Hämtar skyddad sida</td>
  </tr>
</table>
