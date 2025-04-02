import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// ✅ Use this instead of `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// ✅ Use this instead of `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
