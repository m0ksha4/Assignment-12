import{createClient}from 'redis'
const redisClient=createClient({
    url:process.env.REDIS_URL
})
export const redisConnection=()=>{
    redisClient
    .connect().then(()=>{
        console.log("redis connect successfully");
        
    }).catch(()=>{
        console.log("fail connect to redis");
        
    })
}