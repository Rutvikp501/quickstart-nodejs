/*
if using node-cron
cron.schedule('* * * * *', () => {
  console.log('cron job executed at:',  currentDateTime());
});
if using node-schedule
schedule.scheduleJob('* * * * *', currentDateTime());

*    *    *    *    *    *
|    |    |    |    |    |
sec  min  hr   day  mon  dow

*/
// import cron from 'node-cron';
import schedule from 'node-schedule';
import  {currentDateTime}  from '../Helpers/dateHelpers.js';

// // Every 10 seconds
// schedule.scheduleJob('*/10 * * * * *', () => { console.log('Every 10 seconds', currentDateTime());});

// // Every minute
// schedule.scheduleJob('* * * * *', () => { console.log('Every minute', currentDateTime()); });

// // Every hour
// schedule.scheduleJob('0 * * * *', () => { console.log('Every hour', currentDateTime()); });

 // Every day at midnight
 schedule.scheduleJob('0 0 * * *', () => { console.log('Every day at midnight', currentDateTime()); });

// Every Sunday
schedule.scheduleJob('0 0 * * 0', () => { console.log('Every Sunday', currentDateTime()); });

// Every month, 1st
schedule.scheduleJob('0 0 1 * *', () => { console.log('First day of every month', currentDateTime()); });

// Every year, Jan 1st
schedule.scheduleJob('0 0 1 1 *', () => { console.log('Jan 1st every year', currentDateTime()); });

// Custom scheduleJob - Every 15 minutes
schedule.scheduleJob('*/15 * * * *', () => { console.log('Every 15 minutes', currentDateTime()); });

// Custom scheduleJob - At 2:30 PM every day
schedule.scheduleJob('30 14 * * *', () => { console.log('At 2:30 PM every day', currentDateTime()); });

// Custom scheduleJob - At 6:00 AM on the 1st of every month
schedule.scheduleJob('0 6 1 * *', () => { console.log('At 6:00 AM on the 1st of every month', currentDateTime()); });

// Custom scheduleJob - At 5:00 PM every Friday
schedule.scheduleJob('0 17 * * 5', () => { console.log('At 5:00 PM every Friday', currentDateTime()); });

// Custom scheduleJob - At 8:00 AM on weekdays (Mon-Fri)
schedule.scheduleJob('0 8 * * 1-5', () => { console.log('At 8:00 AM on weekdays (Mon-Fri)', currentDateTime()); });

// Custom scheduleJob - At 12:00 PM on the last day of every month
// Node-Cron does not support special characters like L for last day, or W for weekday nearest 
schedule.scheduleJob('0 12 L * *', () => { console.log('At 12:00 PM on the last day of every month', currentDateTime()); });

// Custom scheduleJob - At 3:00 PM on the 15th of every month
schedule.scheduleJob('0 15 15 * *', () => { console.log('At 3:00 PM on the 15th of every month', currentDateTime()); });

// Custom scheduleJob - At 9:00 AM on the first Monday of every month
//cron.schedule('0 9 1-7 * 1', () => { console.log('At 9:00 AM on the first Monday of every month', currentDateTime()); });
schedule.scheduleJob('0 9 * * 1#1', () => { console.log('At 9:00 AM on the first Monday of every month', currentDateTime()); });

// 2nd Saturday of the month at 11:00 AM
//cron.schedule('0 11 8-14 * 6', () => { console.log('At 11:00 AM on the 2nd Saturday of the month', currentDateTime()); });
schedule.scheduleJob('0 11 * * 6#2', () => { console.log('At 11:00 AM on the 2nd Saturday of the month', currentDateTime()); });

// 4th Saturday of the month at 11:00 AM
//cron.schedule('0 11 22-28 * 6', () => { console.log('At 11:00 AM on the 4th Saturday of the month', currentDateTime()); });
schedule.scheduleJob('0 11 * * 6#4', () => { console.log('At 11:00 AM on the 4th Saturday of the month', currentDateTime()); });
