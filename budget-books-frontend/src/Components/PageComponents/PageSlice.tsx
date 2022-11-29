import { createSlice } from '@reduxjs/toolkit';

const homePage: string = 'Categorize Transactions';

export const pageSlice: any = createSlice({
  name: 'pageSlice',
  initialState: {
    activePage: homePage,
    activeAccountID: 0,
  },
  reducers: {
    changeActivePage: (state, action) => {
      const newPage: string = action.payload.activePage;

      return { ...state, activePage: newPage };
    },
    changeActiveAccount: (state, action) => {
      const newActiveAccountID: number = action.payload;
      return { ...state, activeAccountID: newActiveAccountID };
    },
  },
});

export const { changeActivePage, changeActiveAccount } = pageSlice.actions;

export default pageSlice.reducer;
