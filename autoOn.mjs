export default function logEveryTenMinutes() {
    console.log('Logging every 10 minutes:', new Date());
  }
  
  const intervalTime = 10 * 60 * 1000;
  
  setInterval(logEveryTenMinutes, intervalTime);
  
  console.log('Log scheduler started.');