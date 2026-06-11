import { createSlice } from "@reduxjs/toolkit";

type chat = {
	date: string;
	id: string;
	user: boolean;
	content: string;
};
type ChatState = {
	user: string;
	chats: chat[];
};
const initialState: ChatState = {
	user: "",
	chats: [],
};

const ChatSlice = createSlice({
	name: "Chat",
	initialState,
	reducers: {
		Add_chat(state, action) {
			state.user = action.payload.user;
			state.chats.push(action.payload.chat as chat);
		},
		Delete_chat(state, action) {
			state.chats = state.chats.filter((chat) => chat.id !== action.payload.id);
		},
		Drop_chat(state) {
			state.chats = [];
		},
	},
});

export default ChatSlice.reducer;

export const { Add_chat, Delete_chat, Drop_chat } = ChatSlice.actions;
