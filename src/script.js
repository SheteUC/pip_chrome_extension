

function findLargestPlayingVideo() {
  const videos = Array.from(document.querySelectorAll('video'))
    .filter(video => video.readyState != 0)
    .filter(video => video.disablePictureInPicture == false);

  if (videos.length === 0) {
    return;
  }

  return videos[0];
}

async function requestPictureInPicture(video) {
  await video.requestPictureInPicture();
  video.setAttribute('__pip__', true);
  video.addEventListener('leavepictureinpicture', event => {
    video.removeAttribute('__pip__');
  }, { once: true });
  new ResizeObserver(maybeUpdatePictureInPictureVideo).observe(video);
}

function maybeUpdatePictureInPictureVideo(entries, observer) {
  const observedVideo = entries[0].target;
  if (!document.querySelector('[__pip__]')) {
    observer.unobserve(observedVideo);
    return;
  }
  const video = findLargestPlayingVideo();
  if (video && !video.hasAttribute('__pip__')) {
    observer.unobserve(observedVideo);
    requestPictureInPicture(video);
  }

  // Calculate progress percentage
  const progress = (video.currentTime / video.duration) * 100;

  // Check if a progress bar already exists
  let progressBar = observedVideo.querySelector('.pip-progress-bar');

  if (!progressBar) {
    // If progress bar doesn't exist, create and append it
    progressBar = document.createElement('div');
    progressBar.classList.add('pip-progress-bar');
    observedVideo.appendChild(progressBar);
  }

  // Update progress bar width
  progressBar.style.width = `${progress}%`;

  // Set basic styles for the progress bar
  progressBar.style.position = 'absolute';
  progressBar.style.bottom = '0';
  progressBar.style.left = '0';
  progressBar.style.height = '4px';
  progressBar.style.backgroundColor = 'blue'; // Change to a suitable color
}

(async () => {
  const video = findLargestPlayingVideo();
  if (!video) {
    return;
  }
  if (video.hasAttribute('__pip__')) {
    document.exitPictureInPicture();
    return;
  }

  // Only add the ResizeObserver and progress bar for pip videos
  await requestPictureInPicture(video);

  // Load the CSS file into the extension
  const cssFile = chrome.extension.getURL('styles.css');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssFile;
  document.head.appendChild(link);
})();


