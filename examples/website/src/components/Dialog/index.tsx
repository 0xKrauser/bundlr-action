/* 
MIT License
Copyright (c) 2022 Rainbow
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";
import { FocusTrap } from "./FocusTrap";



interface DialogProps {
  open: boolean;
  onClose: () => void;
  onMountAutoFocus?: (event: Event) => void;
  children: ReactNode;
}

export function Dialog({ children, onClose, open }: DialogProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) =>
      open && event.key === "Escape" && onClose();

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const [bodyScrollable, setBodyScrollable] = useState(true);
  useEffect(() => {
    setBodyScrollable(
      getComputedStyle(window.document.body).overflow !== "hidden"
    );
  }, []);

  const handleBackdropClick = useCallback(() => onClose(), [onClose]);

  return (
    <>
      {open
        ? createPortal(
          <RemoveScroll enabled={bodyScrollable}>
            <div>
              <div
                className="align-end md:align-center overlay fixed"
                aria-modal
                role="dialog"
              >
                <FocusTrap
                  className="modal-content"
                  onClick={handleBackdropClick}
                  role="document"
                >
                  {children}
                </FocusTrap>
              </div>
            </div>
          </RemoveScroll>,
          document.body
        )
        : null}
    </>
  );
}
