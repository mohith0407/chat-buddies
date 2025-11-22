import {model, Schema} from "mongoose";
const chatModel=Schema({
    chatName:{
        type:String,
        trim:true
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    groupAvatar: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    users:[
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    latestMessage:{
        type:Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})
const Chat=model("Chat",chatModel)
export default Chat;
