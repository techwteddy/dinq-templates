import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	summary: {
		mainPoints: [],
		keyInsights: "",
		recommendations: [],
	},
	flashcards: [],
	quiz: [],
};

const parseSlice = createSlice({
	name: "parse",
	initialState,
	reducers: {
		Add_data(state, action) {
			state.summary = action.payload.summary;
			state.flashcards = action.payload.flashcards;
			state.quiz = action.payload.quiz;
		},

		Delete_data(state) {
			state.summary = { keyInsights: "", mainPoints: [], recommendations: [] };
			state.flashcards = [];
			state.quiz = [];
		},

		Update_summary(state, action) {
			state.summary = action.payload;
		},

		Update_flashcard(state, action) {
			state.flashcards = action.payload;
		},
		Update_quiz(state, action) {
			state.quiz = action.payload;
		},
	},
});

export const { Add_data, Delete_data, Update_summary, Update_flashcard, Update_quiz } = parseSlice.actions;

export default parseSlice.reducer;
