chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'buttonClicked') {
      // Handle the message from the popup
      console.log('Button clicked!');
      // Perform additional actions as needed
    }
  });