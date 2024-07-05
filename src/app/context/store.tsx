"use client"

import { createContext, useReducer } from "react";

export type Content = {
    url: string;
    mime: string;
}

export type Action =
| { type: 'ADD_FILE'; payload: Content }
| { type: 'SET_FILES'; payload: Content[] };

export type State = {
    files: Content[]
}

const initialState = {
    files: []
};

const store = createContext<{
    state: State,
    dispatch: React.Dispatch<Action>;
} | null>(null);
const { Provider } = store;

const StateProvider:React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [state, dispatch] = useReducer((state: State, action: Action) => {
        const { type, payload } = action;
        
        switch(type) {
            case "SET_FILES" :
                return {
                    ...state,
                    files: payload
                };
            case "ADD_FILE" :
                return {
                    ...state,
                    files: [...state.files, payload]
                };
            default :
                throw new Error()
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };