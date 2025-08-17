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
        onclone: null,
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


// export async function recordDivAsCanvas(
//   element: HTMLElement,
//   duration: number = 10000,
//   filename: string = "full-hd-recording.webm"
// ) {
//   if (!element) {
//     console.error("No element provided to record.");
//     return;
//   }

//   // 1. Prepare element for HD capture
//   const originalStyles = {
//     position: element.style.position,
//     visibility: element.style.visibility,
//     transform: element.style.transform,
//   };
//   element.style.position = 'fixed';
//   element.style.visibility = 'visible';
//   element.style.transform = 'none';
//   element.style.top = '0';
//   element.style.left = '0';
//   element.style.zIndex = '99999';

//   // 2. Calculate full HD dimensions (1920x1080) while maintaining aspect ratio
//   const elementRect = element.getBoundingClientRect();
//   const elementAspectRatio = elementRect.width / elementRect.height;
//   const targetAspectRatio = 16 / 9; // Full HD standard
//   //@ts-ignore
//   let canvasWidth, canvasHeight;
  
//   if (elementAspectRatio > targetAspectRatio) {
//     // Wider than 16:9
//     canvasWidth = 1920;
//     canvasHeight = Math.round(1920 / elementAspectRatio);
//   } else {
//     // Taller than 16:9
//     canvasHeight = 1080;
//     canvasWidth = Math.round(1080 * elementAspectRatio);
//   }

//   // 3. Create HD canvas with high DPI
//   const scale = 2; // 2x resolution for retina quality
//   const canvas = document.createElement("canvas");
//   canvas.width = canvasWidth * scale;
//   canvas.height = canvasHeight * scale;
//   const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  
//   // Enable high-quality rendering
//   ctx.imageSmoothingEnabled = true;
//   ctx.imageSmoothingQuality = "high";

//   // 4. Configure premium recording
//   const stream = (canvas as any).captureStream(60); // 60fps
//   const recorder = new MediaRecorder(stream, {
//     mimeType: 'video/webm;codecs=vp9',
//     bitsPerSecond: 25_000_000 // 25Mbps for high quality
//   });
  
//   const chunks: Blob[] = [];
//   recorder.ondataavailable = (e) => chunks.push(e.data);
  
//   recorder.onstop = () => {
//     const blob = new Blob(chunks, { type: "video/webm" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//     Object.assign(element.style, originalStyles); // Restore styles
//   };

//   // 5. Dynamic frame capture with html2canvas
//   const html2canvas = (await import("html2canvas")).default;
//   let lastFrameTime = performance.now();
//   const frameInterval = 1000 / 60; // Target 60fps

//   async function captureFrame() {
//     const now = performance.now();
//     const elapsed = now - lastFrameTime;
    
//     if (elapsed >= frameInterval) {
//       try {
//         const snapshot = await html2canvas(element, {
//           scale: scale,
//           //@ts-expect-error
//           width: canvasWidth,
//                 //@ts-expect-error
//           height: canvasHeight,
//           scrollX: -element.scrollLeft,
//           scrollY: -element.scrollTop,
//           useCORS: true,
//           allowTaint: true,
//           backgroundColor: null,
//           foreignObjectRendering: false, // Better text quality
//           removeContainer: true
//         });

//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(
//           snapshot, 
//           0, 0, snapshot.width, snapshot.height,
//           0, 0, canvas.width, canvas.height
//         );
        
//         lastFrameTime = now - (elapsed % frameInterval);
//       } catch (error) {
//         console.error("Frame capture error:", error);
//       }
//     }
    
//     if (!recorder || recorder.state !== "recording") return;
//     requestAnimationFrame(captureFrame);
//   }

//   // 6. Start recording
//   recorder.start(100); // Collect chunks every 100ms
//   captureFrame(); // Start frame capture loop

//   // 7. Automatic stop after duration
//   setTimeout(() => {
//     if (recorder.state === "recording") {
//       recorder.stop();
//     }
//     stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
//   }, duration);
// }