import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }

    try{
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }        
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected = db.connections[0].readyState
        console.log("Database Connected Successfully")
    } catch (error){
        console.log("Database Connected Failed", error)
        process.exit(1)
    }
}

export default dbConnect;