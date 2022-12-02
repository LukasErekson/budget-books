import { createSlice } from '@reduxjs/toolkit';

const homePage: string = 'Categorize Transactions';

export const pageSlice: any = createSlice({
  name: 'pageSlice',
  initialState: {
    activePage: homePage,
    activeAccount: {},
  },
  reducers: {
    changeActivePage: (state, action) => {
      const newPage: string = action.payload.activePage;

      return { ...state, activePage: newPage };
    },
    changeActiveAccount: (state, action) => {
      const newActiveAccount: any = action.payload;
      return { ...state, activeAccount: newActiveAccount };
    },
  },
});

export const { changeActivePage, changeActiveAccount } = pageSlice.actions;

export default pageSlice.reducer;
