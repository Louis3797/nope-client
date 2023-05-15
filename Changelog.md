# Changelog 26.04.2023

---

## Added

### Rest API

`POST /api/verify-token` ist ein neuer Endpoint damit die Frontends checken können ob deren Zugangtokens gültig sind

### Socket.io

#### Client -> Server

`tournament:create` Erstellt ein neues Tunier

`tournament:join` Lässt ein Spieler ein Tunier beitreten


 `tournament:leave` Lässt ein Spieler ein Tunier verlassen

###Server -> Client

`list:tournaments` Liste aller verfügbaren Tuniere

`tournament:playerInfo` Informiert Spieler in Tunieren wenn andere Spieler beitreten oder es verlassen

`tournament:info` Informiert über andere Dinge im Tunier

---

## Updated

### Rest API

`POST /api/auth/login` gibt nun auch bei erfolgreichen login ein user object zurück

### Socket.io

---

## Removed

### Rest API

### Socket.io
