const Node = (val, left = null, right = null) => {
  const value = val;
  return {
    value,
    left,
    right,
  };
};

const Tree = (arr) => {
  const cleanArr = (arr) => {
    arr.sort((a,b)=>a-b);
    let noDupsArr = [];
    for (const item of arr) {
      if (!noDupsArr.includes(item)) {
        noDupsArr.push(item);
      }
    }  
    return noDupsArr
  }
  
  let cleanedArr = cleanArr(arr)
  let root = Node(cleanedArr[Math.floor(cleanArr.length/2)]);
  
  const buildTree = (arr) => {
    if (!arr || arr.length === 0) {
      return null
    }
    if (arr.length === 1) {
      return Node(arr[0]);
    }
    let a = cleanArr(arr);    
    let leftSide = a.slice(0, Math.floor(a.length / 2));
    let root= Node(a[Math.floor(a.length/2)]);
    let rightSide = a.slice(Math.floor(a.length / 2)+1);
    root.left = buildTree(leftSide);
    root.right = buildTree(rightSide);
    return root;
  };
  
  root = buildTree(cleanedArr);

  const insertNode = (value) => {
    let pointer = root;
    while (pointer) {
      if (value === pointer.value) {
        console.log('already present')
        return
      }
      if (value < pointer.value) {
        if (!pointer.left){
          pointer.left = Node(value);
          return
        }
        pointer = pointer.left;
      }
      if (value > pointer.value) {
        if (!pointer.right){
          pointer.right = Node(value);
          return
        }
        pointer = pointer.right;
      }
    }
  }

  const deleteNode = (value) => {
    let pointer = root;
    let parent = root;
    let link = null;
    while (value != pointer.value){
      if (value < pointer.value) {
        link = 'left';
        parent = pointer;
        pointer = pointer.left;
      }
      if (value > pointer.value) {
        link = 'right';
        parent = pointer;
        pointer = pointer.right;
      }
      if (!pointer) {
        console.log("I couldn't find that node.");
        return
      }
    }
    if (value === pointer.value) {
      if (pointer.left && pointer.right){
        let newValue = pointer.right;
        link = 'right';
        parent = pointer;
        while (newValue.left) {
          parent = newValue
          newValue = newValue.left
          link = 'left'
        }
        pointer.value = newValue.value;
        parent[link] = null;
        return
      }
      if (pointer.left || pointer.right){
        parent[link] = (pointer.left || pointer.right);
        return
      }
      else {
        parent[link] = null;
      }
      

    }
  }

  const findNode = (value) => {
    let pointer = root;
    while (pointer && value != pointer.value){
      if (pointer && value > pointer.value) {
        pointer = pointer.right;
      }
      if (pointer && value < pointer.value) {
        pointer = pointer.left    
      }
    }
    if (!pointer) {
      console.log('not found')
      return null
    }
    if (value === pointer.value){
      return pointer
    }
  }

  const levelOrder = (somefunc = function (n) { return n.value} ) => {
    let queue = [];
    let results = [];
    queue.push(root);
    while (queue.length > 0) {
      let nextUp = queue.shift();  
      if (nextUp.left){
        queue.push(nextUp.left);
      }
      if (nextUp.right){
        queue.push(nextUp.right);
      }
      results.push(somefunc(nextUp))
    }
    return results
  }

  const inorder = (somefunc = function (n) { return n.value} ) => {
    let results = [];
    let subroutine = (node) => {
      if (node.left) {
        subroutine(node.left);
      }
      results.push(somefunc(node));
      if (node.right) {
        subroutine(node.right)
      }
    }
    subroutine(root);
    return results
  }

  const preorder = (somefunc = function (n) { return n.value} ) => {
    let results = [];
    let subroutine = (node) => {
      results.push(somefunc(node));
      if (node.left) {
        subroutine(node.left);
      }
      if (node.right) {
        subroutine(node.right)
      }
    }
    subroutine(root);
    return results
  }

  const postorder = (somefunc = function (n) { return n.value} ) => {
    let results = [];
    let subroutine = (node) => {
      if (node.left) {
        subroutine(node.left);
      }
      if (node.right) {
        subroutine(node.right)
      }
      results.push(somefunc(node));
    }
    subroutine(root);
    return results
  }

  const height = (node) => {
    if (!node){
      return 0
    }
    if (!findNode(node.value)) {
      return -1
    }
    let h = 0;
    let pointer = findNode(node.value);
    if (!pointer.left && !pointer.right){
      return h;
    }
    else {
      h++;
      return h + Math.max(height(pointer.left), height(pointer.right));
    }
  }

  const depth = (node) => {
    let depth = 0;
    let pointer = root;
    while (pointer && node.value != pointer.value){
      if (node.value > pointer.value) {
        pointer = pointer.right;
        depth++;
      }
      else if (node.value < pointer.value) {
        pointer = pointer.left
        depth++;
      }
    }
    if (!pointer) {
      console.log('not found')
      return null
    }
    if (node.value === pointer.value){
      return depth
    }
  }

  const isBalanced = () => {
    const heightArr = levelOrder(height);
    const depthArr = levelOrder(depth);
    for (let i = 1; i< heightArr.length; i++) {
      for (let j = 0; j < i; j++){
        if (heightArr[i] === heightArr[j] && Math.abs(depthArr[i] - depthArr[j]) > 1) {
          return false
        }
      }
    }
    return true
  }

  const rebalance = () => {
    let arrOfVals = levelOrder();
    cleanedArr= cleanArr(arrOfVals);
    let newRoot = buildTree(cleanedArr);
    root.value = newRoot.value;
    root.left = newRoot.left
    root.right = newRoot.right;
  }
 

  return ({ 
    root,
    insertNode,
    deleteNode,
    findNode,
    levelOrder,
    inorder,
    preorder,
    postorder,
    depth,
    height,
    isBalanced,
    rebalance
  });
};


const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
}

const makeRandomData = function (){
  let arr =[]
  for (i = 0; i<5; i++){
    let entry = Math.round((Math.random()*100));
    arr.push(entry)
  }
  return arr
}

let testData = makeRandomData();
let testTree = Tree(testData)
console.log(testTree.isBalanced());
console.log(testTree.levelOrder());
console.log(testTree.preorder());
console.log(testTree.inorder());
console.log(testTree.postorder());


testTree.insertNode(100);
testTree.insertNode(120);
testTree.insertNode(130);
testTree.insertNode(140);

console.log(testTree.isBalanced());
testTree.rebalance();
console.log(testTree.isBalanced());
testTree.rebalance();

console.log(testTree.levelOrder());
console.log(testTree.preorder());
console.log(testTree.inorder());
console.log(testTree.postorder());

