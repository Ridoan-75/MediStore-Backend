import app from "./app";
import { prisma } from "./lib/prisma"


const PORT = process.env.PORT || 5000;

 async function main() {
    try{
        await prisma.$connect()
        console.log("connected to the db")

        app.listen(PORT, ()=> {
            console.log(`Server is on ${PORT}`)
        })
    }catch
    (error){
        console.error("an error", error  )
        await prisma.$connect();
        process.exit(1)

    }
 }


 main();