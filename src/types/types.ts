import { AnyAction } from 'redux';
export type AsyncAction = (dispatch: (action: AnyAction) => any) => void;
