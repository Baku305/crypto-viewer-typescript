import { createSlice } from "@reduxjs/toolkit"

type assetState = Array<any>

const initialState : assetState = []

export const AssetState = createSlice({
 name: "asset",
 initialState: initialState,
 reducers: {
  set: (state,action) => {
   if (state !== undefined) {
    return state = action.payload
  }},
 }
})