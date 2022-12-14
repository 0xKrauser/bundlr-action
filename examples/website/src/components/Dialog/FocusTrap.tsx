/* 
MIT License
Copyright (c) 2022 Rainbow
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { useCallback, useEffect, useRef } from "react";

const moveFocusWithin = (element: HTMLElement, position: "start" | "end") => {
  const focusableElements = element.querySelectorAll(
    "button:not(:disabled), a[href]"
  ) as NodeListOf<HTMLButtonElement | HTMLAnchorElement>;

  if (focusableElements.length === 0) return;

  focusableElements[
    position === "end" ? focusableElements.length - 1 : 0
  ].focus();
};

export function FocusTrap(props: JSX.IntrinsicElements["div"]) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyActiveElement = document.activeElement;

    return () => {
      (previouslyActiveElement as HTMLElement).focus?.();
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const elementToFocus =
        contentRef.current.querySelector("[data-auto-focus]");
      if (elementToFocus) {
        (elementToFocus as HTMLElement).focus();
      } else {
        contentRef.current.focus();
      }
    }
  }, [contentRef]);

  return (
    <>
      <div
        onFocus={useCallback(
          () =>
            contentRef.current && moveFocusWithin(contentRef.current, "end"),
          []
        )}
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
      />
      <div
        ref={contentRef}
        style={{ outline: "none" }}
        tabIndex={-1}
        {...props}
      />
      <div
        onFocus={useCallback(
          () =>
            contentRef.current && moveFocusWithin(contentRef.current, "start"),
          []
        )}
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
      />
    </>
  );
}
