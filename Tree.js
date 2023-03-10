import mergeSort from './mergeSort.js';

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

  let root = buildTree(sorted);

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

  const levelOrder = (callback, queue = [root], values = []) => {
    // Traverse in breadth-first level order
    while (queue.length > 0) {
      if (typeof callback === 'function') {
        // Provide node to callback if it's there
        callback(queue[0]);
      } else {
        // If not, keep track of the node values to return
        values.push(queue[0].data);
      }
      // Enqueue nodes as we go
      if (queue[0].left) {
        queue.push(queue[0].left);
      }
      if (queue[0].right) {
        queue.push(queue[0].right);
      }
      // Dequeue once we've worked with the node
      queue.shift();
      // Keep it rolling until there's nothing left in the queue
      levelOrder(callback, queue, values);
    }
    return values;
  };

  const inOrder = (callback, currentNode = root, values = []) => {
    // Traverse depth-first in order
    if (!currentNode) {
      return values;
    }
    inOrder(callback, currentNode.left, values);
    // Use callback if it exists, or return node values otherwise
    if (typeof callback === 'function') {
      callback(currentNode);
    } else {
      values.push(currentNode.data);
    }
    inOrder(callback, currentNode.right, values);
    return values;
  };

  const preOrder = (callback, currentNode = root, values = []) => {
    // Traverse depth-first pre order
    if (!currentNode) {
      return values;
    }
    // Use callback if it exists, or return node values otherwise
    if (typeof callback === 'function') {
      callback(currentNode);
    } else {
      values.push(currentNode.data);
    }
    preOrder(callback, currentNode.left, values);
    preOrder(callback, currentNode.right, values);
    return values;
  };

  const postOrder = (callback, currentNode = root, values = []) => {
    // Traverse depth-first post order
    if (!currentNode) {
      return values;
    }
    postOrder(callback, currentNode.left, values);
    postOrder(callback, currentNode.right, values);
    // Use callback if it exists, or return node values otherwise
    if (typeof callback === 'function') {
      callback(currentNode);
    } else {
      values.push(currentNode.data);
    }
    return values;
  };

  const height = (node) => {
    // Calculate height of a given node
    if (!node) {
      return -1;
    }
    const leftHeight = height(node.left);
    const rightHeight = height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  };

  const depth = (node, current = root, initDepth = 0) => {
    // XXX
    // lots of copy-paste from find method...integrate them somehow?
    if (!node) {
      return 'not in tree';
    }
    let nodeDepth = initDepth;
    let currentNode = current;
    // Found the value, so return the node
    if (currentNode.data === node.data) {
      return nodeDepth;
    }
    // Maybe it's to the left?
    if (node.data < currentNode.data) {
      if (currentNode.left) {
        // Keep track of how deep we're going
        nodeDepth += 1;
        currentNode = currentNode.left;
      } else {
        // Smaller but there's no left node, so it's not in the tree
        return nodeDepth;
      }
    }
    // Or maybe it's to the right?
    if (node.data > currentNode.data) {
      if (currentNode.right) {
        // Keep track of how deep we're going
        nodeDepth += 1;
        currentNode = currentNode.right;
      } else {
        // Larger but there's no right node, so it's not in the tree
        return nodeDepth;
      }
    }
    // Keep on searching if you can
    return depth(node, currentNode, nodeDepth);
  };

  const isBalanced = () => {
    // Can't be balanced if it doesn't exist
    if (!root) {
      return false;
    }

    // Check & compare height of root subtrees
    const leftSubTree = root.left;
    const rightSubTree = root.right;
    const leftHeight = height(leftSubTree);
    const rightHeight = height(rightSubTree);
    const difference = Math.abs(leftHeight - rightHeight);
    if (difference > 1) {
      return false;
    }
    return true;
  };

  const rebalance = () => {
    const ordered = inOrder();
    root = buildTree(ordered);
  };

  return {
    depth,
    find,
    height,
    inOrder,
    insert,
    isBalanced,
    levelOrder,
    postOrder,
    preOrder,
    prettyPrint,
    rebalance,
    remove,
  };
};

export default Tree;
