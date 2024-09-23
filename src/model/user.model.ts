import mongoose, {Schema, Document} from "mongoose";
import {messengerNames} from '@/name'

export interface Message extends Document{
    name: string;
    content: string;
    createdAt: Date
}

const name = messengerNames[Math.floor(Math.random() * messengerNames.length)]

const MessageSchema: Schema<Message> = new Schema({
    name: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
    resetingPassword: boolean;
    resetingToken: string;
    tokenExpiry: Date;
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],
    resetingPassword: {
        type: Boolean,
        default: false
    },
    resetingToken: {
        type: String,
        required: [true, "Token for resetting password is required"],
    },
    tokenExpiry: {
        type: Date,
        required: [true, "Token Expiry is required"],
    }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel