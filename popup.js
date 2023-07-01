document.addEventListener('DOMContentLoaded', function() {
    var myButton = document.getElementById('myButton');
    myButton.addEventListener('click', function() {
      // Perform some action when the button is clicked
      // Example: Send a message to the background script
      chrome.runtime.sendMessage({ action: 'buttonClicked' });
    });
  });