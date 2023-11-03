"use client";

import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import ZoomPanel from "@/app/board/components/ZoomPanel";

import { ActiveTool } from "@/types/ActiveTool";
import { Shapes } from "@/types/Shapes";
import { useBoundStore } from "@/zustand/store";
import { getSpace } from "@/app/config/ably";
import { useSession } from "next-auth/react";
import { getBoardData } from "@/services/boardService";
import { useMutation } from "react-query";

type Props = {
  activeTool: ActiveTool;
  activeShape: Shapes;
  boardIdTracker: any;
  switchActiveTool: (tool: ActiveTool) => void;
  handleSaveBoard: (boardData: any) => void;
  handlePublishEvent: (boardData: any) => void;
};

const Whiteboard = ({
  activeTool,
  activeShape,
  boardIdTracker,
  switchActiveTool,
  handlePublishEvent,
  handleSaveBoard,
}: Props) => {
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isCanvasSet, setIsCanvasSet] = useState<boolean>(false);

  const canvasRef = useRef(null);
  const isCanvasUpdatedByEvent = useRef(false);

  const setBoardWithPrevious = useBoundStore(
    (state) => state.setBoardWithPrevious
  );

  const board = useBoundStore((state) => state.board);
  const clientId = useBoundStore((state) => state.clientId);
  const guestUser = useBoundStore((state) => state.guestUser);

  const { status } = useSession();

  const getBoardDataMutation = useMutation(({ boardId }: { boardId: string }) =>
    getBoardData(boardId)
  );

  const fetchBoardData = async () => {
    const boardData = await getBoardDataMutation.mutateAsync({
      boardId: board?.boardId as string,
    });

    setBoardWithPrevious((prev) => ({
      ...prev,
      boardName: boardData.boardName,
      boardData: boardData.boardData,
      host: boardData.host,
    }));

    if (!canvas) return;

    if (boardData?.boardData) {
      canvas.loadFromJSON(boardData?.boardData, () => {
        canvas.renderAll();
      });
    }
  };

  useEffect(() => {
    if (!boardIdTracker) return;

    if (boardIdTracker?.isValid && boardIdTracker?.hostType === "user") {
      fetchBoardData();
    }
  }, [boardIdTracker, canvas]);

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "rgba(0, 0, 0, 0)", // Set canvas background color to transparent
    });

    setCanvas(newCanvas);
    setIsCanvasSet(true);

    const imageURL =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d8d8d8' fill-opacity='.5'%3E%3Cpath opacity='.3' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

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

    cleanUp();

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
      case ActiveTool.SELECT:
        cleanUp();
        break;
      // case ActiveTool.ERASER:
      //   handleErase();
      //   break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool, canvas, activeShape]);

  useEffect(() => {
    if (!canvas) return;

    canvas.on("object:added", loadCanvasFromJson);
    canvas.on("mouse:up", loadCanvasFromJson);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  useEffect(() => {
    if (!isCanvasSet) return;

    listenCanvasEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCanvasSet]);

  const loadCanvasFromJson = () => {
    if (!canvas) return;

    if (isCanvasUpdatedByEvent.current) {
      isCanvasUpdatedByEvent.current = false;
      return;
    }

    try {
      const boardData = JSON.stringify(canvas.toJSON());

      setBoardWithPrevious((prev) => ({
        ...prev,
        boardData,
      }));

      if (status === "authenticated" && boardIdTracker?.hostType === "user") {
        handleSaveBoard(boardData);
      } else if (status === "unauthenticated" && !!guestUser) {
        handlePublishEvent(boardData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const listenCanvasEvent = async () => {
    if (!clientId) return;

    const space = await getSpace(clientId, board?.boardId as string);

    space.channel.subscribe("canvasEvent", (message) => {
      handleCanvasEvent(message.data);
    });
  };

  const handleCanvasEvent = (data: any) => {
    try {
      if (!canvas) return;

      if (data.clientId.toString() == clientId?.toString()) return;

      const canvasData = data.canvasData;

      isCanvasUpdatedByEvent.current = true;

      canvas.off("object:added");
      canvas.off("mouse:up");

      canvas.loadFromJSON(canvasData, () => {
        canvas.renderAll();
        canvas.on("object:added", loadCanvasFromJson);
        canvas.on("mouse:up", loadCanvasFromJson);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const cleanUp = () => {
    if (!canvas) return;

    canvas.isDrawingMode = false;

    canvas.renderAll();
  };

  // --------TEXT---------

  // add event listener to canvas
  function handleAddText() {
    if (!canvas) return;
    canvas.isDrawingMode = false;

    // Create a flag to track whether the first mouse down has occurred
    let isFirstMouseDown = true;

    // Add an event listener to the canvas for the `mouse:down` event
    canvas.on("mouse:down", function (e) {
      if (!canvas) return;

      // If the first mouse down has not occurred yet, call `setTextCoords()`
      if (isFirstMouseDown) {
        setTextCoords(e);
        isFirstMouseDown = false;
      }
    });
  }

  // event handler for text
  function setTextCoords(e: any) {
    if (!canvas) return;
    const pointer = canvas.getPointer(e, false);
    const posX = pointer.x;
    const posY = pointer.y;

    //render input box but only once
    renderInputBox(posX, posY);
  }

  function renderInputBox(posX: number, posY: number) {
    if (!canvas) return;

    const input = document.createElement("input");
    input.type = "text";
    input.style.position = "absolute";
    input.style.left = posX + "px";
    input.style.top = posY + "px";
    input.style.fontSize = "20px";
    input.style.fontFamily = "Arial";
    input.style.color = "black";
    input.style.border = "1px solid black";
    input.style.outline = "none";
    input.style.backgroundColor = "transparent";
    input.style.zIndex = "999";
    input.style.width = "200px";
    input.style.padding = "0px";
    input.style.paddingLeft = "5px";
    input.style.margin = "0px";
    input.style.overflow = "hidden";

    let removed = false;

    input.onkeydown = function (e) {
      if (e.key === "Enter") {
        removed = true;
        placeText(input, posX, posY);
      }
    };

    input.onblur = function () {
      if (removed) return;

      placeText(input, posX, posY);
    };

    document.body.appendChild(input);
    setTimeout(() => {
      input.focus();
    }, 100);
  }

  const placeText = (input: HTMLInputElement, x: number, y: number) => {
    if (!canvas) return;

    if (input.value) {
      const text = new fabric.IText(input.value, {
        left: x,
        top: y,
        fontFamily: "arial",
        fill: "#000",
        fontSize: 20,
      });

      canvas.add(text);
    }

    document.body.removeChild(input);
    canvas.off("mouse:down", setTextCoords);
    switchActiveTool(ActiveTool.BRUSH);
  };

  // --------DRAWING---------
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

  // --------ZOOM---------
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
    // canvas.off("mouse:up");
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

  // --------ERASER---------
  // function handleErase() {
  //   if (!canvas) return;

  //   canvas.isDrawingMode = true;
  //   canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  //   canvas.freeDrawingBrush.color = "white"; // Set brush color
  //   canvas.freeDrawingBrush.width = 30; // Set brush width

  //   // below code is not working
  //   // canvas.freeDrawingBrush.globalCompositeOperation = "source-over";
  // }

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
