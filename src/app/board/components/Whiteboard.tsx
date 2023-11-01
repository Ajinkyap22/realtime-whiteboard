import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [textInput, setTextInput] = useState("");
  const [addingText, setAddingText] = useState(false);
  const [textPosition, setTextPosition] = useState({ left: 0, top: 0 });

  //Add Text
  function addText() {
    if (!canvas) return;
    const text = new fabric.Textbox(textInput, {
      left: textPosition.left,
      top: textPosition.top,
      fill: "black",
      fontFamily: "Arial",
      fontSize: 30,
      width: 200, // Set a default width for the text box
    });
    canvas.add(text);
    setAddingText(false); // Reset state after adding text
    setTextInput(""); // Reset text input
  }

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current);
    setCanvas(newCanvas);
    const imageURL =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='115' height='115' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d8d8d8' fill-opacity='0.3'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

    fabric.Image.fromURL(imageURL, function () {
      newCanvas.setBackgroundColor(
        // @ts-ignore
        { source: imageURL, repeat: "repeat" },
        function () {
          newCanvas.renderAll();
        }
      );
    });

    window.addEventListener("resize", resizeCanvas, false);

    function resizeCanvas() {
      newCanvas.setHeight(window.innerHeight);
      newCanvas.setWidth(window.innerWidth);
      newCanvas.renderAll();
    }

    //Drawing
    newCanvas.isDrawingMode = true;
    newCanvas.freeDrawingBrush.color = "black"; // Set brush color
    newCanvas.freeDrawingBrush.width = 2; // Set brush width
    newCanvas.freeDrawingBrush.shadow = new fabric.Shadow({
      color: "rgba(0,0,0,0.3)",
      blur: 5,
    });
    // Handle canvas click for text input position
    function handleCanvasClick(event: any) {
      if (addingText) {
        const pointer = newCanvas.getPointer(event.e);
        setTextPosition({ left: pointer.x, top: pointer.y });
        setAddingText(true); // Enable adding text
      }
    }

    newCanvas.on("mouse:down", handleCanvasClick);
    // resize on init
    resizeCanvas();

    return () => {
      // Clean up event listeners on component unmount
      window.removeEventListener("resize", resizeCanvas);
      newCanvas.off("mouse:down", handleCanvasClick);
    };
  }, [addingText]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
      }}
    />
  );
};

export default Whiteboard;
