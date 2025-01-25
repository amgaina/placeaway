'use client';

import type React from 'react';
import { createContext, useContext, useReducer, type Dispatch } from 'react';

type BookingState = {
  visitorCount: number;
  hasPets: boolean;
  hasChildren: boolean;
  startDate: Date | null;
  endDate: Date | null;
  interests: string[];
};

type BookingAction =
  | { type: 'SET_VISITOR_COUNT'; payload: number }
  | { type: 'SET_HAS_PETS'; payload: boolean }
  | { type: 'SET_HAS_CHILDREN'; payload: boolean }
  | { type: 'SET_START_DATE'; payload: Date | null }
  | { type: 'SET_END_DATE'; payload: Date | null }
  | { type: 'SET_INTERESTS'; payload: string[] };

const initialState: BookingState = {
  visitorCount: 1,
  hasPets: false,
  hasChildren: false,
  startDate: null,
  endDate: null,
  interests: [],
};

function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case 'SET_VISITOR_COUNT':
      return { ...state, visitorCount: action.payload };
    case 'SET_HAS_PETS':
      return { ...state, hasPets: action.payload };
    case 'SET_HAS_CHILDREN':
      return { ...state, hasChildren: action.payload };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'SET_END_DATE':
      return { ...state, endDate: action.payload };
    case 'SET_INTERESTS':
      return { ...state, interests: action.payload };
    default:
      return state;
  }
}

const BookingContext = createContext<
  | {
      state: BookingState;
      dispatch: Dispatch<BookingAction>;
    }
  | undefined
>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};
