import { fromEvent, merge } from "rxjs";
import { map, mergeAll, takeUntil } from "rxjs/operators";
import "./style.css";

const restartButton: HTMLInputElement =
  document.querySelector(".restart-button")!;
const canvas: HTMLCanvasElement = document.querySelector(".canvas")!;
const cursorPosition = { x: 0, y: 0 };

//canvas config
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

//observables

const onMouseUp$ = fromEvent(canvas, "mouseup");
const onMouseDown$ = fromEvent(canvas, "mousedown");
const onMouseMove$ = fromEvent(canvas, "mousemove").pipe(takeUntil(onMouseUp$));

let mouseDownSubscription = onMouseDown$.subscribe((e) =>
  updateCursorPosition(canvas, e as MouseEvent)
);

const startPaint$ = onMouseDown$.pipe(
  map(() => onMouseMove$),
  mergeAll()
);

const onLoadWindow$ = fromEvent(window, "load");
const onRestartClick$ = fromEvent(restartButton, "click");

//este merge no es un operador
const restartWhiteBoard$ = merge(onLoadWindow$, onRestartClick$);

//subscriptions
let startPaintSubscription = startPaint$.subscribe((e) =>
  paintStroke(e as MouseEvent)
);

restartWhiteBoard$.subscribe(() => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  startPaintSubscription.unsubscribe();
  startPaintSubscription = startPaint$.subscribe((e) =>
    paintStroke(e as MouseEvent)
  );
  mouseDownSubscription.unsubscribe();
  mouseDownSubscription = onMouseDown$.subscribe((e) =>
    updateCursorPosition(canvas, e as MouseEvent)
  );
});
