import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const getSelf=async()=>{
    const self=await currentUser();
    if(!self || !self.username){
        throw new Error("unauthorized access")
    }
    
    const user=await db.user.findUnique({
        where:{
            externalUserIs: self.id
        }
    })

    if(!user){
        throw new Error("user not found");
    }

    return user;
}