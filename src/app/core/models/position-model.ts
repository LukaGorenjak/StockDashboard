import { model } from "@angular/core";

export interface Position {
    ticker: string; 
    amount: number;
    buyPrice: number;
    currentPrice: number;
}


export interface FinnhubQuote {
    c: number;
    d: number;
    dp: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
}