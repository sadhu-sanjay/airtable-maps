[Unit]
Description=Airtable Site
After=multi-user.target

[Service]
WorkingDirectory=/root/airtable-maps
ExecStart=npm run start
Restart=always
RestartSec=3
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=airtable-maps-site
User=root

[Install]
WantedBy=multi-user.target