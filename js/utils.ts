/*
 * Utils
 *
 * Useful utility functions
 */

import $ from "jquery";

const escapeMap = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ['"', "&quot;"],
  ["'", "&#39;"],
]);

export class Utils {
  static stringFormat(format: string, ...args: any) {
    return format.replace(/{(\d+)}/g, (match, num) => {
      return typeof args[num] !== "undefined" ? args[num] : match;
    });
  }

  static escape(str: string) {
    return str.replace(/&(?!\w+;)|[<>"']/g, s => escapeMap.get(s) ?? s);
  }

  static createDropDownListOptions(items: any[] | object) {
    let html = "";

    if (Array.isArray(items)) {
      for (const item of items) {
        html += $("<option>").val(item).text(item)[0].outerHTML;
      }
    } else {
      // Assume it's an object contains keys & values
      $.each(items, (key, value) => {
        html += $("<option>")
          .val(key)
          .text(value as any)[0].outerHTML;
      });
    }

    return html;
  }

  static range(start: number, end: number, step: number) {
    if (step === undefined) {
      step = 1;
    }

    const array = [];
    const totalSteps = Math.floor((end - start) / step);
    for (let i = 0; i <= totalSteps; i++) {
      array.push(start + i * step);
    }

    return array;
  }
}
