import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, code} = await request.json()


        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username})
        
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 500}) 
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verfied successfully"
            }, {status: 201})
        } else if (!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired, please signup again to get a new code"
            }, {status: 201})
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, {status: 201})
        }
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {status: 500})
    }
}