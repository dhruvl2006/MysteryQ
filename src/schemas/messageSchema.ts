import {z} from 'zod'

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, {message: "Message should be atleast 10 Characters long"})
        .max(500, {message: "Content should be less than 500 characters"}),
})