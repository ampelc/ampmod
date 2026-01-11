import React, { useState, useEffect, useRef } from "react";
import DragToImport from "../components/amp-drag-to-import/drag-to-import";

/**
 * amp: Higher Order Component to provide file dragging.
 * @param {React.Component} WrappedComponent
 * @returns {React.Component} Shows overlay on drag without flicker
 */
const AmpFileDragHoc = WrappedComponent => {
  return function DragOnlyWrapper(props) {
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    useEffect(() => {
      const handleDragEnter = e => {
        e.preventDefault();
        dragCounter.current += 1;
        setIsDragging(true);
      };

      const handleDragLeave = e => {
        e.preventDefault();
        dragCounter.current -= 1;
        if (dragCounter.current === 0) setIsDragging(false);
      };

      const handleDrop = e => {
        e.preventDefault();
        dragCounter.current = 0;
        setIsDragging(false);
      };

      window.addEventListener("dragenter", handleDragEnter);
      window.addEventListener("dragleave", handleDragLeave);
      window.addEventListener("drop", handleDrop);

      return () => {
        window.removeEventListener("dragenter", handleDragEnter);
        window.removeEventListener("dragleave", handleDragLeave);
        window.removeEventListener("drop", handleDrop);
      };
    }, []);

    return <>
      <WrappedComponent {...props} />
      {isDragging && <DragToImport />}
    </>;
  };
};

export default AmpFileDragHoc;
