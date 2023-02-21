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
    if (!currentNode.left || !currentNode.right) {
      // We can make a leaf, so insert here
      if (value < currentNode.data) {
        if (!currentNode.left) {
          currentNode.left = Node(value);
        } else {
          insert(value, currentNode.left);
        }
      }
      if (value > currentNode.data) {
        if (!currentNode.right) {
          currentNode.right = Node(value);
        } else {
          insert(value, currentNode.right);
        }
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

  const remove = (value, current = root, previous = null) => {
    let currentNode = current;
    const previousNode = previous;
    if (currentNode.data === value) {
      // Found the value, so delete it
      if (!currentNode.left && !currentNode.right) {
        // Deleting a leaf node (no children)
        if (value < previousNode.data) {
          previousNode.left = null;
        } else {
          previousNode.right = null;
        }
      } else if (!currentNode.left || !currentNode.right) {
        // Deleting a node with one child
        if (value < previousNode.data) {
          previousNode.left = currentNode.left
            ? currentNode.left
            : currentNode.right;
        } else {
          previousNode.right = currentNode.left
            ? currentNode.left
            : currentNode.right;
        }
        // Deleting a node with two children
      } else if (currentNode.left && currentNode.right) {
        // Keep track of the node we've found to replace it's data
        const toReplace = currentNode;
        // Start searching for the successor node on the right subtree
        const rightSubRoot = currentNode.right;
        // Keep going left until we find the smallest node on the right
        currentNode = currentNode.right;
        while (currentNode.left) {
          currentNode = currentNode.left;
        }
        // Replace the original node's data with the sucessor's data
        toReplace.data = currentNode.data;
        // Remove the successor node, start search at original subtree
        remove(toReplace.data, rightSubRoot);
      }
    } else if (value < currentNode.data) {
      // value not here so keep looking
      // Move left
      if (currentNode.left) {
        remove(value, currentNode.left, currentNode);
      } else if (currentNode.right) {
        // Move right
        remove(value, currentNode.right, currentNode);
      }
    }
  };

  const find = (value, current = root) => {
    let currentNode = current;
    // Found the value, so return the node
    if (currentNode.data === value) {
      return currentNode;
    }
    // Maybe it's to the left?
    if (value < currentNode.data) {
      if (currentNode.left) {
        currentNode = currentNode.left;
      } else {
        // Smaller but there's no left node, so it's not in the tree
        return null;
      }
    }
    // Or maybe it's to the right?
    if (value > currentNode.data) {
      if (currentNode.right) {
        currentNode = currentNode.right;
      } else {
        // Larger but there's no right node, so it's not in the tree
        return null;
      }
    }
    // Keep on searching if you can
    return find(value, currentNode);
  };

  return {
    prettyPrint, insert, remove, find,
  };
};

const testArray = [
  50, 2, 200, 34, 7, 22, 25, 220, 101, 1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67,
  6345, 324, 55, 72, 19, 123, 341, 1212, 2423, 7341, 2, 6, 11, 10, 15, 18, 12,
];
const newTree = Tree(testArray);
newTree.prettyPrint();
