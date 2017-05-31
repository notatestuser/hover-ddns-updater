Creates or updates a DNS A record on your domain with your network's public IP via the Hover.com API.

## Installation
`npm i -g hover-ddns-updater`

## Usage
Call it manually, throw it in crontab, whatever.

```bash
luke@pi-nas $ export HOVER_API_USER=x
luke@pi-nas $ export HOVER_API_PASS=y
luke@pi-nas $ export HOVER_DDNS_DOMAIN=lukep.org
luke@pi-nas $ export HOVER_DDNS_SUBDOMAIN=homestead
luke@pi-nas $ hover-ddns-updater
Current IP: 111.222.333.444
Received via: http://icanhazip.com/
Success
luke@pi-nas $ host homestead.lukep.org
homestead.lukep.org has address 111.222.333.444
```
