/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {ElementRef} from "@angular/core";

export type ExportOptions = {
  filename?: string;
  delimiter?: string;
  columns?: string[];
}

/**
 * Forcibly starts the process of downloading and saving the file.
 * @param blobData Data to save
 * @param filename File name to save. Default is `download`.
 */
export function saveAs(blobData: Blob, filename?: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blobData);
  link.download = filename || "download";
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Exports data from HTML table to MS Excel format text
 * @param tableIdOrElem HTML table's `id` value or `ElementRef` object
 * @param options Export options
 */
export function exportToExcel(tableIdOrElem: string|ElementRef, options: ExportOptions = {filename: 'records.xls'}) {
  let tableElem: HTMLElement|null;
  if (typeof tableIdOrElem==="string") {
    tableElem = document.getElementById(tableIdOrElem);
  } else {
    tableElem = tableIdOrElem.nativeElement;
  }
  if (tableElem && tableElem instanceof HTMLTableElement) {
    //const tableHTML = encodeURIComponent(tableElem.outerHTML.replace(/ or .*?>/g, '>'));
    const tableHTML = tableElem.outerHTML.replace(/ or .*?>/g, '>');
    const blobData = new Blob([tableHTML], {type: '{type: application/vnd.ms-excel'});
    saveAs(blobData, options?.filename);
  }
}

/**
 * Exports data from HTML table to CSV format text
 * @param tableIdOrElem HTML table's `id` value or `ElementRef` object
 * @param options Export options
 */
export function exportToCSV(tableIdOrElem: string|ElementRef, options: ExportOptions = {filename: 'records.csv'}) {
  let tableElem: HTMLElement|null;
  if (typeof tableIdOrElem==="string") {
    tableElem = document.getElementById(tableIdOrElem);
  } else {
    tableElem = tableIdOrElem.nativeElement;
  }
  if (tableElem && tableElem instanceof HTMLTableElement) {
    const rows = tableElem.querySelectorAll("tr");
    let csv: string[] = [];
    let keys: number[] = [];

    if (rows.length > 0 && (options && options.columns?.length)) {
      const headers = rows[0].querySelectorAll<HTMLTableColElement>("th");
      headers.forEach((header, key) => {
        if (options.columns!.findIndex((name) => {
          const loweredName = name.toLowerCase();
          return header.innerText.toLowerCase() == loweredName || header.classList.contains("cdk-column-"+loweredName);
        }) >= 0) {
          keys.push(key);
        }
      });
    }

    const appendCells = (cells: HTMLTableColElement[] | NodeListOf<HTMLTableColElement>) => {
      const rowText = Array.from(cells).map(cell => cell.innerText);
      csv.push(rowText.join(options?.delimiter ?? ","));
    };

    if (keys.length > 0) {
      rows.forEach((row)=>{
        const allCells = row.querySelectorAll<HTMLTableColElement>("th,td");
        let cells: HTMLTableColElement[] = [];
        allCells.forEach((cell, key)=>{
          if (keys.indexOf(key) >= 0) {cells.push(cell)}
        });
        appendCells(cells);
      });
    } else {
      rows.forEach((row)=> {
        appendCells( row.querySelectorAll<HTMLTableColElement>("th,td") );
      });
    }
    const blobData = new Blob([csv.join("\n")], {type: "text/csv;charset=utf-8;"});
    saveAs(blobData, options?.filename);
  }
}
