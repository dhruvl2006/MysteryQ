import {z} from 'zod'

export const forgetPassword = z.object({
    username: z.string(),
})