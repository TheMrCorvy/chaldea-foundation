import { createApp } from './app';
import { startCronJobs } from './cron/jobs';

const port = process.env.PORT || 3000;
const app = createApp();

app.listen(port, () => {
    console.log(`🚀 Anime Private Cloud Backend is running on port ${port}`);
    console.log(`📊 Health check available at http://localhost:${port}/health`);
    startCronJobs();
});
