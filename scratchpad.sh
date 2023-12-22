# if argument is dump take msyqldumpm backup

if [ "$1" = "dump" ]; then
    mysqldump -u root -p --airtable-maps > backup.sql

else
    mysql -u root -p --airtable-maps < backup.sql
fi
`