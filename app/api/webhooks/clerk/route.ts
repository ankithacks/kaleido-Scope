import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please provide a WEBHOOK secret key");
  }

  // get the headers:-
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error occured == no svix headers got", {
      status: 400,
    });
  }

  // get the body;-
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
//   const { id } = evt.data;
  const eventType = evt.type;
//   console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
//   console.log('Webhook body:', body)

  if(eventType === "user.created"){
    await db.user.create({
        data: {
            externalUserIs: payload.data.id,
            username: payload.data.username,
            imageUrl: payload.data.image_url
        }
    })
  }

  if(eventType === "user.updated"){
    const currentUser=await db.user.findUnique({
      where:{
        externalUserIs: payload.data.id
      }
    })

    if(!currentUser){
      return new Response("user not foud!!", {
        status: 400
      })
    }

    await db.user.update({
      where:{
        externalUserIs: payload.data.id
      },
      data:{
        username: payload.data.username,
        imageUrl: payload.data.image_url
      }
    })
  }

  if(eventType === "user.deleted"){
    await db.user.delete({
      where:{
        externalUserIs: payload.data.id
      }
    })
  }

  return new Response('', { status: 200 })
}
