function merge(left, right) {
  // Expects either equal length arrays or left to be longer
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      merged.push(left[i]);
      i += 1;
    } else if (right[j] <= left[i]) {
      merged.push(right[j]);
      j += 1;
    }
  }

  // Fill in the merged array with any unfinished leftovers
  for (; i < left.length; i += 1) {
    merged.push(left[i]);
  }
  for (; j < right.length; j += 1) {
    merged.push(right[j]);
  }

  return merged;
}

export default function mergeSort(arr) {
  let halfPoint = 0;

  // Determine halfway point to split (if odd length, left is longer)
  if (arr.length % 2 === 0) {
    halfPoint = Math.floor(arr.length / 2);
  } else {
    halfPoint = Math.floor(arr.length / 2) + 1;
  }

  const leftHalf = arr.slice(0, halfPoint);
  const rightHalf = arr.slice(halfPoint);

  // Arrays of one (or less) length are sorted, so just merge em
  if (leftHalf.length <= 1 && rightHalf.length <= 1) {
    return merge(leftHalf, rightHalf);
  }

  // Still need to split and merge
  return merge(mergeSort(leftHalf), mergeSort(rightHalf));
}
