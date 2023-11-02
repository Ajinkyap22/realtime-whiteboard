"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import ZoomPanel from "@/app/board/components/ZoomPanel";
import { ActiveTool } from "@/types/ActiveTool";
import { Shapes } from "@/types/Shapes";

type Props = {
  activeTool: ActiveTool;
  activeShape: Shapes;
};

const Whiteboard = ({ activeTool, activeShape }: Props) => {
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  const canvasRef = useRef(null);

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current);
    setCanvas(newCanvas);

    const imageURL =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d8d8d8' fill-opacity='0.3'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

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

    // resize on init
    resizeCanvas();

    return () => {
      // Clean up event listeners on component unmount
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;

    canvas.isDrawingMode = false;

    // Set the active tool
    switch (activeTool) {
      case ActiveTool.BRUSH:
        handledDraw();
        break;
      case ActiveTool.TEXT:
        handleAddText();
        break;
      case ActiveTool.SHAPE:
        handleAddShape();
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool, canvas, activeShape]);

  // add event listener to canvas
  function handleAddText() {}

  // event handler for text
  function setTextCoords({
    clientX,
    clientY,
  }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {}

  function handledDraw() {
    if (!canvas) return;

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = "black"; // Set brush color
    canvas.freeDrawingBrush.width = 2; // Set brush width
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      color: "rgba(0,0,0,0.3)",
      blur: 5,
    });
  }

  function handleZoom(type: "in" | "out") {
    if (!canvas) return;

    // Get the current zoom of the canvas
    const currentZoom = canvas.getZoom();

    // Zoom in or out depending on zoom type
    let zoom = type === "in" ? currentZoom * 1.1 : currentZoom / 1.1;

    if (currentZoom > 1.7 && type === "in") zoom = 2;

    if (currentZoom < 0.32 && type === "out") zoom = 0.3;

    if (zoom < 0.3 || zoom > 2) return;

    // Set the new zoom
    canvas.setZoom(zoom);
    setCurrentZoom(zoom);

    // Update the canvas
    canvas.renderAll();
  }

  // --------SHAPES---------

  const handleAddShape = () => {
    if (!canvas) return;

    canvas.discardActiveObject();

    // add event listeners to canvas
    canvas.on("mouse:down", handleMouseDownForShape);

    canvas.on("mouse:move", handleMouseMoveForShape);

    canvas.on("mouse:up", handleMouseUpForShape);
  };

  // mouse down
  const handleMouseDownForShape = (e: fabric.IEvent<MouseEvent>) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(e.e, false);

    const posX = pointer.x;
    const posY = pointer.y;

    renderShape(activeShape, posX, posY);
  };

  // mouse move
  const handleMouseMoveForShape = (e: fabric.IEvent<MouseEvent>) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(e.e, false);

    const posX = pointer.x;
    const posY = pointer.y;

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      drawShape(activeObject, posX, posY);
    }
  };

  // mouse up
  const handleMouseUpForShape = (e: fabric.IEvent<MouseEvent>) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      activeObject.setCoords();
    }

    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
  };

  const renderShape = (shape: Shapes, x: number, y: number) => {
    if (!canvas) return;

    let shapeObj: fabric.Object;

    switch (shape) {
      case Shapes.RECTANGLE:
        shapeObj = new fabric.Rect({
          left: x,
          top: y,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
          width: 0,
          height: 0,
        });
        break;
      case Shapes.CIRCLE:
        shapeObj = new fabric.Circle({
          left: x,
          top: y,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
          radius: 0,
        });
        break;
      case Shapes.TRIANGLE:
        shapeObj = new fabric.Triangle({
          left: x,
          top: y,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
          width: 0,
          height: 0,
        });
        break;
      case Shapes.LINE:
        shapeObj = new fabric.Line([x, y, x, y], {
          fill: "black",
          stroke: "black",
          strokeWidth: 2,
        });
        break;
      default:
        shapeObj = new fabric.Rect({
          left: x,
          top: y,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
          width: 0,
          height: 0,
        });
        break;
    }

    canvas.add(shapeObj);
    canvas.renderAll();
    canvas.setActiveObject(shapeObj);
  };

  const drawShape = (activeObject: fabric.Object, x: number, y: number) => {
    if (!canvas) return;

    switch (activeObject.type) {
      case "rect":
        const rect = activeObject as fabric.Rect;
        const left = rect.left!;
        const top = rect.top!;

        if (x < left) {
          rect.set({ left: x });
        }

        if (y < top) {
          rect.set({ top: y });
        }

        rect.set({ width: Math.abs(x - left) });
        rect.set({ height: Math.abs(y - top) });
        break;
      case "circle":
        const circle = activeObject as fabric.Circle;
        const leftCircle = circle.left!;
        const topCircle = circle.top!;

        const radius = Math.abs(x - leftCircle);

        circle.set({ radius });

        if (x < leftCircle) {
          circle.set({ left: x });
        }

        if (y < topCircle) {
          circle.set({ top: y });
        }
        break;
      case "triangle":
        const triangle = activeObject as fabric.Triangle;

        const leftTriangle = triangle.left!;
        const topTriangle = triangle.top!;

        if (x < leftTriangle) {
          triangle.set({ left: x });
        }

        if (y < topTriangle) {
          triangle.set({ top: y });
        }

        triangle.set({ width: Math.abs(x - leftTriangle) });
        triangle.set({ height: Math.abs(y - topTriangle) });
        break;
      case "line":
        const line = activeObject as fabric.Line;

        line.set({ x2: x, y2: y });
        break;
      default:
        break;
    }

    canvas.renderAll();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
        }}
      ></canvas>

      <ZoomPanel handleZoom={handleZoom} currentZoom={currentZoom} />
    </>
  );
};

export default Whiteboard;
