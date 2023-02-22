import Tree from "./Tree.js";

function createRandomArray(maxSize) {
  if (maxSize > 10000 || typeof maxSize !== "number") {
    maxSize = 10000;
  }
  const array = [];
  for (let i = 0; i < maxSize; i += 1) {
    array.push(Math.floor(Math.random() * maxSize * 5));
  }
  return array;
}

const arraySize = 50;
console.log(`Creating tree from random array of ${arraySize} elements:`);
const newTree = Tree(createRandomArray(arraySize));
console.log('\n')
newTree.prettyPrint();
console.log('\n');
console.log(
  newTree.isBalanced() ? "Tree is balanced. Yay!" : "Tree is NOT balanced. Boo!"
);
console.log(`\nLevel order: \n${newTree.levelOrder()}`);
console.log(`\nPre order: \n${newTree.preOrder()}`);
console.log(`\nPost order: \n${newTree.postOrder()}`);
console.log(`\nIn order: \n${newTree.inOrder()}`);
console.log('\nInserting multiple nodes to unbalance the tree:');
newTree.insert(100);
newTree.insert(101);
newTree.insert(102);
newTree.insert(103);
newTree.insert(104);
newTree.insert(105);
newTree.insert(106);
newTree.insert(107);
console.log('\n')
newTree.prettyPrint();
console.log('\n');
console.log(
  newTree.isBalanced() ? "Tree is balanced. Yay!" : "Tree is NOT balanced. Boo!"
);
console.log('\nRebalancing:');
newTree.rebalance();
console.log('\n')
newTree.prettyPrint();
console.log('\n');
console.log(
  newTree.isBalanced() ? "Tree is balanced. Yay!" : "Tree is NOT balanced. Boo!"
);
console.log(`\nLevel order: \n${newTree.levelOrder()}`);
console.log(`\nPre order: \n${newTree.preOrder()}`);
console.log(`\nPost order: \n${newTree.postOrder()}`);
console.log(`\nIn order: \n${newTree.inOrder()}`);
