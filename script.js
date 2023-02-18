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

function mergeSort(arr) {
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

const Node = (data, left = null, right = null) => ({ data, left, right });

function buildTree(array) {
  // Base case to exit recursion - we've reached a leaf of our tree
  if (array.length === 0) {
    return null;
  }

  const midpoint = Math.floor(array.length / 2);
  const root = Node(array[midpoint]);
  root.left = buildTree(array.slice(0, midpoint));
  root.right = buildTree(array.slice(midpoint + 1));

  return root;
}

const Tree = (array) => {
  // Sort, then remove duplicates by converting to set & back to array
  const sorted = [...new Set(mergeSort(array))];

  const root = buildTree(sorted);

  // For a nice pretty display of the tree
  const prettyPrint = (node = root, prefix = '', isLeft = true) => {
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  };

  const insert = (value, current = root) => {
    const currentNode = current;
    if (sorted.includes(value)) {
      console.error('Value already present - no duplicates allowed');
    } else if (!currentNode.left || !currentNode.right) {
      // We can make a leaf, so insert here
      if (value < currentNode.data) {
        currentNode.left = Node(value);
      }
      if (value > currentNode.data) {
        currentNode.right = Node(value);
      }
    } else {
      // Not at a leaf yet
      if (value < currentNode.data) {
        insert(value, currentNode.left);
      }
      if (value > currentNode.data) {
        insert(value, currentNode.right);
      }
    }
  };

  return { prettyPrint, insert };
};

const testArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const newTree = Tree(testArray);
newTree.prettyPrint();
newTree.insert(50);
newTree.insert(2);
newTree.insert(200);
newTree.insert(34);
newTree.insert(7);
newTree.insert(22);
newTree.prettyPrint();
