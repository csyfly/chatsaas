git pull || exit -1  
npm install || exit -2
npx prisma generate || exit -3
npm run build  || exit -4
pm2 restart chatsaas || exit -5
echo "Deployed successfully"