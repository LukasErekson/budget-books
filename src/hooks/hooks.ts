import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../stores/store';
import { AnyAction } from 'redux';
import { ThunkDispatch } from '@reduxjs/toolkit';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useThunkDispatch: () => ThunkDispatch<RootState, any, AnyAction> =
  useDispatch;
