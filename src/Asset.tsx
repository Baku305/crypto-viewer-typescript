import { useEffect, useMemo, useState } from "react";
import { multiStore } from "./state/store";
import { market } from "./state/MarketState";
import { useDispatch, useSelector } from "react-redux";
import DataTable, { TableColumn } from "react-data-table-component";
import { useFetchCryptoApi } from "./customhooks/useFetchApi";
import { Link } from "react-router-dom";
import searchLogo from "./assets/SVG/searchIcon.svg";
import { AssetState } from "./state/AssetState";
import React from "react";
import { Obj } from "reselect/es/types";

const binancePublicEndpoint = "https://api.binance.com";
const exchangeInfoEndpoint = binancePublicEndpoint + "/api/v3/exchangeInfo";

export const filteredArray = (array: Array<Obj<string>>) =>
  array.filter((value: Obj<string>, index: number) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      array.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });

export const numberOfMarkets = (baseAsset: string): DataRow => {
  const a = multiStore.getState().market.filter((m) => m.baseAsset === baseAsset.toUpperCase());

  return {
    baseAsset: baseAsset,
    markets: a.length,
  };
};

type DataRow = {
  baseAsset: string;
  markets: number;
};

const customStyles = {
  cells: {
    style: {
      display: "flex",
      justifyContent: "flex-start",
      minWidth: "fit-content",
      padding: "5px",
      width: "100%",
    },
  },
  columns: {
    style: {
      minWidth: "fit-content",
    },
  },
  rows: {
    style: {
      '&:hover':{
        backgroundColor: "rgba(100, 116, 139, 0.75)",
        color : "white",
        button : {
          color : "white"
        }
      }
    }
  },
};

export function Assets(): JSX.Element {
  const dispatch = useDispatch();

  const [filterText, setFilterText] = useState("");

  const tableColumns: TableColumn<DataRow>[] = [
    {
      name: "BaseAsset",
      selector: (row) => row.baseAsset,
      cell: (row) => (
        <div className="flex justify-start w-full">
          <div>
            <img className="h-5 mr-3" src={`//logo.chainbit.xyz/${row.baseAsset}`} alt="" />
          </div>
          <Link to={`/${row.baseAsset.toLowerCase()}`}>{row.baseAsset}</Link>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const nameA = a.baseAsset;
        const nameB = b.baseAsset;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      name: "Markets",
      selector: (row) => row.markets,
      sortable: true,
    },
  ];

  const {
    symbols: symbolsInfo,
    error: errorInfo,
    isLoading: isLoadingInfo,
    onRefresh: onRefreshInfo,
  } = useFetchCryptoApi(exchangeInfoEndpoint);

  const filteredItems = useSelector<Obj<string>, any>((state) => state.asset).filter(
    (item: DataRow) => {
      return item.baseAsset && item.baseAsset.includes(filterText.toUpperCase());
    }
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <>
        <div className="flex justify-between w-full">
          <label className="relative block">
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <img className="h-5 w-5 fill-slate-300" src={searchLogo} alt="searchLogo"></img>
            </span>
            <input
              onKeyUp={(e) => setFilterText((e.target as HTMLInputElement).value)}
              className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              placeholder="Search ..."
              type="text"
              name="search"
            />
          </label>
        </div>
      </>
    );
  }, []);

  useEffect(() => {
    if (symbolsInfo) {
      dispatch(
        market.actions.set(symbolsInfo.symbols.filter((s: Obj<string>) => s.status === "TRADING"))
      );
      const a = symbolsInfo.symbols
        .filter((s: Obj<string>) => s.status === "TRADING")
        .map((s: Obj<string>) => numberOfMarkets(s.baseAsset));
      dispatch(AssetState.actions.set(filteredArray(a)));
    }
  }, [dispatch, symbolsInfo]);

  return (
    <div className="box-border 2xl:container mx-auto">
      <DataTable
        className=""
        columns={tableColumns}
        data={filteredItems}
        pagination
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        customStyles={customStyles}
      />
    </div>
  );
}
