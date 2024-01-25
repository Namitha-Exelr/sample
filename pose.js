let video, canvas, ctx, poseNet;

async function setup() {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  // Get access to the webcam stream
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  // Load the PoseNet model
  poseNet = await posenet.load();

  // Start pose estimation
  detectPose();
}

async function detectPose() {
  // Estimate poses from the video stream
  const pose = await poseNet.estimateSinglePose(video);

  // Extract keypoints from the pose
  const rightShoulder = pose.keypoints.find((kp) => kp.part === 'rightShoulder');

  // Calculate angle with respect to another point (e.g., right hip)
  const rightHip = pose.keypoints.find((kp) => kp.part === 'rightHip');
  const angle = calculateAngle(rightHip.position, rightShoulder.position);

  // Draw keypoints on the canvas
  drawKeypoints(pose);

  // Show a message when the right shoulder angle is close to 180 degrees
  const thresholdAngle = 175; // You can adjust the threshold as needed
  if (angle >= thresholdAngle) {
    showMessage('Right shoulder at 180 degrees!');
  }

  requestAnimationFrame(detectPose);
}

function calculateAngle(p1, p2) {
  // Calculate the angle between two points
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function drawKeypoints(pose) {
  // Draw the keypoints on the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pose.keypoints.forEach((keypoint) => {
    ctx.beginPath();
    ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  });
}

function showMessage(message) {
  // Show the message on the screen
  alert(message);
}

setup();
