import { applyMiddleware, combineReducers } from "redux";
import { market } from "./MarketState";
import thunkMiddleware from "redux-thunk";
import {} from "@redux-devtools/extension";
import { composeWithDevTools } from "@redux-devtools/extension";
import { AssetState } from "./AssetState";
import { configureStore } from "@reduxjs/toolkit";


const reducer = combineReducers({
  market: market.reducer,
  asset: AssetState.reducer
});


export const multiStore = configureStore({reducer});
