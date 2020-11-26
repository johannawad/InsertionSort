export var sortedArray = [];

function insertSort (newNumber) {
  let i = sortedArray.length - 1;
  while (i >= 0 && newNumber < sortedArray[i]) {
    i--;
  }
  sortedArray.splice(i + 1, 0, newNumber);
}

export function sortArray (arrayToSort) {
  arrayToSort.forEach(element => {
    insertSort(element);
  });
}
