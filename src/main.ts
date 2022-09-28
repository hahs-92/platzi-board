import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";
import "./style.css";

const canvas: HTMLCanvasElement = document.querySelector(".canvas")!;
const cursorPosition = {
  x: 0,
  y: 0,
};

const normalizePosition = (canvas: HTMLCanvasElement, event: MouseEvent) => {
  cursorPosition.x = event.clientX - canvas.offsetLeft;
  cursorPosition.y = event.clientY - canvas.offsetTop;
};

const onMouseDown$ = fromEvent(canvas, "mousedown").pipe(
  map((event) => {
    //restamos la diferente del canvas con la pantalla completa
    normalizePosition(canvas, event as MouseEvent);
    console.log(cursorPosition);
  })
);
const onMouseMove$ = fromEvent(canvas, "mousemove");
const onMouseUp$ = fromEvent(canvas, "mouseup");

onMouseDown$.subscribe(console.log);

//
const canvasContext: CanvasRenderingContext2D = canvas.getContext("2d")!;
canvasContext.lineWidth = 8;
canvasContext.strokeStyle = "white";

//realizar trazo
canvasContext.beginPath();
canvasContext.moveTo(50, 0);
canvasContext.lineTo(100, 100);
canvasContext.stroke();
canvasContext.closePath();
