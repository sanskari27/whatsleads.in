import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '..';
import { Bot, BotState } from '../types/BotState';

const initialState: BotState = {
    all_bots: [],
    details: {
        bot_id: '',
        trigger: '',
        message: '',
        respond_to: 'ALL',
        options: 'INCLUDES_IGNORE_CASE',
        attachments: [],
        shared_contact_cards: [],
        isActive: false,
        response_delay_seconds: 0,
        trigger_gap_seconds: 0,
        polls: [],
    },
    ui: {
        isAddingBot: false,
        isEditingBot: false,
        triggerError: '',
        messageError: '',
        respondToError: '',
        optionsError: '',
        contactCardsError: '',
        attachmentError: '',
        triggerGapError: '',
        responseGapError: '',
    },
    response_delay: {
        time: 0,
        type: 'SEC',
    },
    trigger_gap: {
        time: 0,
        type: 'SEC',
    },
};

const BotSlice = createSlice({
    name: StoreNames.CHATBOT,
    initialState,
    reducers: {
        reset: (state) => {
            state.details = initialState.details;
            state.ui = initialState.ui;
            state.response_delay = initialState.response_delay;
            state.trigger_gap = initialState.trigger_gap;
        },
        setBots: (
            state,
            action: PayloadAction<typeof initialState.all_bots>
        ) => {
            state.all_bots = action.payload;
        },
        addBot: (state, action: PayloadAction<Bot>) => {
            state.all_bots.push(action.payload);
        },
        removeBot: (state, action: PayloadAction<string>) => {
            state.all_bots = state.all_bots.filter(
                (bot) => bot.bot_id !== action.payload
            );
        },
        setSelectedBot: (state, action: PayloadAction<string>) => {
            const index = state.all_bots.findIndex(
                (bot) => bot.bot_id === action.payload
            );
            if (index === -1) {
                return;
            }
            state.details.bot_id = state.all_bots[index].bot_id;
            state.details.trigger = state.all_bots[index].trigger;
            state.details.message = state.all_bots[index].message;
            state.details.respond_to = state.all_bots[index].respond_to;
            state.details.options = state.all_bots[index].options;
            state.details.attachments = state.all_bots[index].attachments;
            state.details.shared_contact_cards =
                state.all_bots[index].shared_contact_cards;
            state.details.isActive = state.all_bots[index].isActive;
            state.details.response_delay_seconds =
                state.all_bots[index].response_delay_seconds;
            state.details.trigger_gap_seconds =
                state.all_bots[index].trigger_gap_seconds;
            state.details.polls = state.all_bots[index].polls;

            state.ui.isEditingBot = true;

            state.response_delay.time =
                state.details.response_delay_seconds % 3600 === 0
                    ? state.details.response_delay_seconds / 3600
                    : state.details.response_delay_seconds % 60 === 0
                    ? state.details.response_delay_seconds / 60
                    : state.details.response_delay_seconds;
            state.response_delay.type =
                state.details.response_delay_seconds % 3600 === 0
                    ? 'HOUR'
                    : state.details.response_delay_seconds % 60 === 0
                    ? 'MINUTE'
                    : 'SECOND';

            state.trigger_gap.time =
                state.details.trigger_gap_seconds % 3600 === 0
                    ? state.details.trigger_gap_seconds / 3600
                    : state.details.trigger_gap_seconds % 60 === 0
                    ? state.details.trigger_gap_seconds / 60
                    : state.details.trigger_gap_seconds;
            state.trigger_gap.type =
                state.details.trigger_gap_seconds % 3600 === 0
                    ? 'HOUR'
                    : state.details.trigger_gap_seconds % 60 === 0
                    ? 'MINUTE'
                    : 'SECOND';
        },
        updateBot: (
            state,
            action: PayloadAction<{ id: string; data: Bot }>
        ) => {
            state.all_bots = state.all_bots.map((bot) => {
                if (bot.bot_id === action.payload.id) {
                    return action.payload.data;
                }
                return bot;
            });
        },
        setTrigger: (
            state,
            action: PayloadAction<typeof initialState.details.trigger>
        ) => {
            state.details.trigger = action.payload;
            state.ui.triggerError = '';
        },
        setMessage: (
            state,
            action: PayloadAction<typeof initialState.details.message>
        ) => {
            state.details.message = action.payload;
            state.ui.messageError = '';
        },
        setRespondTo: (
            state,
            action: PayloadAction<typeof initialState.details.respond_to>
        ) => {
            state.details.respond_to = action.payload;
            state.ui.respondToError = '';
        },
        setOptions: (
            state,
            action: PayloadAction<typeof initialState.details.options>
        ) => {
            state.details.options = action.payload;
            state.ui.optionsError = '';
        },
        setAttachments: (
            state,
            action: PayloadAction<typeof initialState.details.attachments>
        ) => {
            state.details.attachments = action.payload;
            state.ui.attachmentError = '';
        },
        setContactCards: (
            state,
            action: PayloadAction<
                typeof initialState.details.shared_contact_cards
            >
        ) => {
            state.details.shared_contact_cards = action.payload;
            state.ui.contactCardsError = '';
        },
        setResponseDelayTime: (state, action: PayloadAction<number>) => {
            state.response_delay.time = action.payload;
            state.details.response_delay_seconds =
                state.response_delay.time *
                (state.response_delay.type === 'HOUR'
                    ? 3600
                    : state.response_delay.type === 'MINUTE'
                    ? 60
                    : 1);

            state.ui.responseGapError = '';
        },
        setResponseDelayType: (state, action: PayloadAction<string>) => {
            state.response_delay.type = action.payload;
            state.details.response_delay_seconds =
                state.response_delay.time *
                (state.response_delay.type === 'HOUR'
                    ? 3600
                    : state.response_delay.type === 'MINUTE'
                    ? 60
                    : 1);
            state.ui.responseGapError = '';
        },
        setTriggerGapTime: (state, action: PayloadAction<number>) => {
            state.trigger_gap.time = action.payload;
            state.details.trigger_gap_seconds =
                state.trigger_gap.time *
                (state.trigger_gap.type === 'HOUR'
                    ? 3600
                    : state.trigger_gap.type === 'MINUTE'
                    ? 60
                    : 1);
        },
        setTriggerGapType: (state, action: PayloadAction<string>) => {
            state.trigger_gap.type = action.payload;
            state.details.trigger_gap_seconds =
                state.trigger_gap.time *
                (state.trigger_gap.type === 'HOUR'
                    ? 3600
                    : state.trigger_gap.type === 'MINUTE'
                    ? 60
                    : 1);
            state.ui.triggerGapError = '';
        },
        setPolls: (
            state,
            action: PayloadAction<typeof initialState.details.polls>
        ) => {
            state.details.polls = action.payload;
        },
        setAddingBot: (state, action: PayloadAction<boolean>) => {
            state.ui.isAddingBot = action.payload;
        },
        setEditingBot: (state, action: PayloadAction<boolean>) => {
            state.ui.isEditingBot = action.payload;
        },
        setError: (
            state,
            action: PayloadAction<{
                type:
                    | 'triggerError'
                    | 'messageError'
                    | 'respondToError'
                    | 'optionsError'
                    | 'contactCardsError'
                    | 'attachmentError'
                    | 'triggerGapError'
                    | 'responseGapError';

                error: string;
            }>
        ) => {
            state.ui[action.payload.type] = action.payload.error;
        },
    },
});

export const {
    reset,
    setBots,
    addBot,
    updateBot,
    removeBot,
    setSelectedBot,
    setTrigger,
    setMessage,
    setRespondTo,
    setOptions,
    setAttachments,
    setContactCards,
    setResponseDelayTime,
    setResponseDelayType,
    setTriggerGapTime,
    setTriggerGapType,
    setPolls,
    setError,
    setAddingBot,
    setEditingBot,
} = BotSlice.actions;

export default BotSlice.reducer;