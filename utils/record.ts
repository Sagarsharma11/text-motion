import html2canvas from "html2canvas";
//@ts-ignore
import Whammy from "whammy";


export async function recordScreenFor(seconds: number, filename = "animation.webm") {
  try {
    // Ask user to select window/tab to record
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 }
    });

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9"
    });

    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start();

    // Stop after given seconds
    setTimeout(() => {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
    }, seconds * 1000);

  } catch (err) {
    console.error("Screen recording failed:", err);
  }
}


export async function recordDivAsVideo(
  element: HTMLElement,
  duration: number = 10000,
  filename: string = "ultra-hd-recording.webm"
) {
  if (!element) {
    console.error("No element provided to record.");
    return;
  }

  // 1. Prepare element for capture
  const originalStyles = {
    visibility: element.style.visibility,
    transform: element.style.transform,
    position: element.style.position,
  };
  element.style.visibility = "visible";
  element.style.transform = "none";
  element.style.position = "fixed";
  element.style.top = "0";
  element.style.left = "0";
  element.style.zIndex = "99999";

  // 2. Calculate dimensions with scaling
  const scale = 2; // 2x resolution for HD quality
  const width = Math.max(element.scrollWidth, element.offsetWidth) * scale;
  const height = Math.max(element.scrollHeight, element.offsetHeight) * scale;

  // 3. Create high-res canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 4. Configure recording
  const stream = canvas.captureStream(60); // 60fps
  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    bitsPerSecond: 20_000_000 // 20Mbps
  });

  // 5. Recording handlers
  recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    Object.assign(element.style, originalStyles);
  };

  recorder.start(100); // Capture chunks every 100ms

  // 6. Premium frame capture
  const endTime = Date.now() + duration;

  async function captureFrame() {
    try {
      const snapshot = await html2canvas(element, {
        scale,
        width: width / scale,
        height: height / scale,
        scrollX: -element.scrollLeft,
        scrollY: -element.scrollTop,
        windowWidth: width / scale,
        windowHeight: height / scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: true,
        removeContainer: true,
        foreignObjectRendering: false, // Better text quality
        // Valid html2canvas options only:
        ignoreElements: (el) => false,
        //@ts-ignore
        onclone: null,
        //@ts-ignore
        proxy: null,
        x: 0,
        y: 0
      });

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(snapshot, 0, 0, width, height);

      if (Date.now() < endTime) {
        requestAnimationFrame(captureFrame);
      } else {
        recorder.stop();
      }
    } catch (error) {
      console.error("Capture error:", error);
      recorder.stop();
    }
  }

  captureFrame();
}


export async function recordDivAsCanvas(
  element: HTMLElement,
  duration: number = 10000,
  filename: string = "recording.webm"
) {
  if (!element) {
    console.error("No element provided to record.");
    return;
  }

  const rect = element.getBoundingClientRect();
  const canvas = document.createElement("canvas");
  canvas.width = rect.width;
  canvas.height = rect.height;
  const ctx = canvas.getContext("2d")!;

  // Use html2canvas to paint the element into canvas
  const html2canvas = (await import("html2canvas")).default;

  const drawFrame = async () => {
    const snapshot = await html2canvas(element, {
      width: rect.width,
      height: rect.height,
    });
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(snapshot, 0, 0);
  };

  // Start recording
  const stream = (canvas as any).captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  recorder.start();

  // Draw every 100ms
  const interval = setInterval(drawFrame, 100);

  setTimeout(() => {
    clearInterval(interval);
    recorder.stop();
    stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
  }, duration);
}
