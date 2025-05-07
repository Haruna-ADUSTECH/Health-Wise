// Heart rate estimation (basic simulation)
function startHeartRate() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const hrText = document.getElementById('hr');
  const context = canvas.getContext('2d');

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      video.srcObject = stream;

      let samples = [];
      let count = 0;

      const interval = setInterval(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        let data = context.getImageData(0, 0, canvas.width, canvas.height).data;

        // Average red channel
        let red = 0;
        for (let i = 0; i < data.length; i += 4) red += data[i];
        red /= data.length / 4;

        samples.push(red);
        count++;

        if (samples.length > 60) {
          samples.shift();
          let max = Math.max(...samples);
          let min = Math.min(...samples);
          let bpm = Math.round((max - min) * 1.5); // Simplified estimation
          hrText.textContent = bpm;
        }
      }, 100);
    })
    .catch((err) => {
      alert("Camera access denied or not supported.");
    });
}

// Motion detection (breathing proxy)
function startMotion() {
  const motionVal = document.getElementById("motionValue");
  if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", function(event) {
      let ax = event.accelerationIncludingGravity.x || 0;
      let ay = event.accelerationIncludingGravity.y || 0;
      let az = event.accelerationIncludingGravity.z || 0;
      let movement = Math.sqrt(ax * ax + ay * ay + az * az).toFixed(2);
      motionVal.textContent = movement;
    });
  } else {
    motionVal.textContent = "Not supported on this device.";
  }
}
