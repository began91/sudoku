import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import squareReducer from '../features/square/squareSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    square: squareReducer
  },
});
