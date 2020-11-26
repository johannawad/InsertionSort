import { MESSAGE_TYPE } from './utils/messages.js';
import { sortArray, sortedArray } from './utils/sort.js';
import Timer from './utils/timer.js';

let arraySize;
let interval;
let arr;
let timer;
let isFinishedSorting;

onmessage = function (e) {
  const { type, args, id } = e.data;
  const { START, NEW_NUMBER } = MESSAGE_TYPE;
  switch (type) {
    case START:
      resetWorker();
      timer.startSortTimer();
      triggerBatch();
      break;
    case NEW_NUMBER:
      timer.startMessageTimer(id);
      addNewNumberToArray(args);
      timer.stopMessageTimer(id);
      break;
    default:
      postMessage({ type: type });
  }
};

function addNewNumberToArray (number) {
  if (arr && !isFinishedSorting) {
    arr.push(number);
    postMessage({ type: MESSAGE_TYPE.RECEIVED });
  }
}

function triggerBatch () {
  timer.resumeSortTimer();
  const messageArray = arr.splice(0, 5000);
  sortArray(messageArray);
  timer.pauseSortTimer();
  if (arr.length > 0) {
    setTimeout(triggerBatch);
  } else {
    postMessage({ type: MESSAGE_TYPE.FINISHED_SORTING });
    isFinishedSorting = true;

    timer.stopSortTimer();
    finishCalculation();
  }
}

function resetWorker () {
  timer = new Timer();
  arraySize = 100000;
  arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 1000));
  isFinishedSorting = false;
}

function finishCalculation () {
  if (timer.tasksAreCompleted() && arr.length === 0) {
    clearTimeout(interval);
    postMessage({
      type: MESSAGE_TYPE.COMPLETED,
      args: {
        sortDuration: timer.getSortDuration(),
        numbersSorted: sortedArray.length,
        averageTimePerMessage: timer.getMessageTimesAverage(),
        messageTimeDurations: timer.getMessageDurations(),
        totalDuration: timer.getFullDuration()
      }
    });
  }
}
