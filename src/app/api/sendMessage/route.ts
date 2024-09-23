import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";
import {messengerNames} from '@/name'

const name = messengerNames[Math.floor(Math.random() * messengerNames.length)]

export async function POST(request:Request) {
    await dbConnect()

    const {username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 404}
            )
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: `${username ? username : 'User'} is not excepting messages currently`
                },
                {status: 201}
            )
        }

        const newMessage = {name: name, content, createdAt: new Date()}

        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: `Message sent successfully to ${username}`
            },
            {status: 200}
        )
    } catch (error) {
        console.log(error)
        return Response.json(
            {
                success: false,
                message: "Error sending message"
            },
            {status: 500}
        )
    }
}