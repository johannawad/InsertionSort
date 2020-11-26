import Worker from './worker.js';

import './style.css';
import { MESSAGE_TYPE } from './utils/messages.js';

let numberInterval;
let messageCount;
let worker;
let triggerInterval;

document.addEventListener('DOMContentLoaded', function (event) {
  document.getElementById('button').addEventListener('click', startWorker);
});

function sendRandomNumber () {
  const { NEW_NUMBER } = MESSAGE_TYPE;
  numberInterval = window.setInterval(() => {
    const random = Math.floor(Math.random() * 1000) + 1;
    worker.postMessage({ id: messageCount, type: NEW_NUMBER, args: random });
    messageCount++;
  }, triggerInterval);
}

function addMesssageEventListener () {
  const { RECEIVED, FINISHED_SORTING, COMPLETED } = MESSAGE_TYPE;
  worker.onmessage = function (event) {
    const { type, args } = event.data;
    switch (type) {
      case RECEIVED:
        document.getElementById('result').innerHTML = `Messages Received by worker: <b>${messageCount}</b>`;
        break;
      case FINISHED_SORTING:
        clearInterval(numberInterval);
        break;
      case COMPLETED:
        worker.terminate();
        // eslint-disable-next-line no-case-declarations
        const { totalDuration, sortDuration, averageTimePerMessage, numbersSorted, messageTimeDurations } = args;
        document.getElementById('total-duration').innerHTML = `Total Time Elapsed: <b>${Math.floor(totalDuration)}</b> ms`;
        document.getElementById('sort-duration').innerHTML = `It took <b>${Math.floor(sortDuration)}</b> ms to sort <b>${numbersSorted}</b> numbers`;
        if (averageTimePerMessage) {
          document.getElementById('average-message-time').innerHTML = `Average Time per Message: <b>${Math.floor(averageTimePerMessage)}</b> ms`;
          document.getElementById('message-durations-info').hidden = false;
          console.log('Message durations;', messageTimeDurations);
        }
        break;
      default:
        document.getElementById('result').innerText = `${type}`;
    }
  };

  worker.onerror = function (e) {
    console.log(e);
  };
}
function startWorker () {
  let i = document.getElementById('interval').value;
  i = parseInt(i);
  if (isNaN(i) || i < 1 || i > 5000) {
    document.getElementById('result').innerText = 'Please enter a valid Number!';
    document.getElementById('interval').value = '';
    worker?.terminate();
    return;
  }

  const { START } = MESSAGE_TYPE;
  triggerInterval = i;
  resetWorker();

  worker.postMessage({ type: START });

  sendRandomNumber();
}

function resetWorker () {
  if (typeof (Worker) !== 'undefined') {
    if (typeof (w) === 'undefined') {
      worker = new Worker();
    }
  } else {
    console.log('Sorry, your browser does not support Web Workers');
  }
  clearInterval(numberInterval);
  messageCount = 0;
  document.getElementById('message-durations-info').hidden = true;
  document.getElementById('result').innerHTML = '';
  document.getElementById('total-duration').innerHTML = '';
  document.getElementById('sort-duration').innerHTML = '';
  document.getElementById('average-message-time').innerHTML = '';

  addMesssageEventListener();
}
