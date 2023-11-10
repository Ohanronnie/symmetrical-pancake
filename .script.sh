pg_ctl -D /data/data/com.termux/files/usr/var/lib/postgresql -l logfile start
pm2 start watchit
cd server
pm2 start "yarn start:dev" --name=api 
cd ../client
pm2 start "npm run dev" --name=react
