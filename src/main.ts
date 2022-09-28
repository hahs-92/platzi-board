import { fromEvent, map, mergeAll, takeUntil } from "rxjs";
import "./style.css";

const canvas: HTMLCanvasElement = document.querySelector(".canvas")!;
const cursorPosition = { x: 0, y: 0 };

//
const canvasContext: CanvasRenderingContext2D = canvas.getContext("2d")!;
canvasContext.lineWidth = 8;
canvasContext.lineJoin = "round";
canvasContext.lineCap = "round";
canvasContext.strokeStyle = "white";

const updateCursorPosition = (canvas: HTMLCanvasElement, event: MouseEvent) => {
  //restamos la diferente del canvas con la pantalla completa
  cursorPosition.x = event.clientX - canvas.offsetLeft;
  cursorPosition.y = event.clientY - canvas.offsetTop;
};

const paintStroke = (event: MouseEvent) => {
  //realizar trazo
  canvasContext.beginPath();
  canvasContext.moveTo(cursorPosition.x, cursorPosition.y);
  updateCursorPosition(canvas, event);
  canvasContext.lineTo(cursorPosition.x, cursorPosition.y);
  canvasContext.stroke();
  canvasContext.closePath();
};

const onMouseUp$ = fromEvent(canvas, "mouseup");
const onMouseDown$ = fromEvent(canvas, "mousedown");
const onMouseMove$ = fromEvent(canvas, "mousemove").pipe(takeUntil(onMouseUp$));

onMouseDown$.subscribe((e) => updateCursorPosition(canvas, e as MouseEvent));

const startPaint$ = onMouseDown$.pipe(
  map(() => onMouseMove$),
  mergeAll()
);

startPaint$.subscribe((e) => paintStroke(e as MouseEvent));
