export function getOnChange(data, selected, checked, nodes) {
  const allNode = getChildById(data, nodes.id);
  let array = checked
    ? [...selected, ...allNode]
    : selected.filter(value => !allNode.includes(value));

  array = array.filter((v, i) => array.indexOf(v) === i);
  return array;
}

function getChildById(node, id) {
  let array = [];

  function getAllChild(nodes) {
    if (nodes === null) return [];
    array.push(nodes);
    if (Array.isArray(nodes.children)) {
      nodes.children.forEach(node => {
        array = [...array, ...getAllChild(node)];
        array = array.filter((v, i) => array.indexOf(v) === i);
      });
    }
    return array;
  }

  function getNodeById(nodes, id) {
    if (nodes.id === id) {
      return nodes;
    } else if (Array.isArray(nodes.children)) {
      let result = null;
      nodes.children.forEach(node => {
        if (!!getNodeById(node, id)) {
          result = getNodeById(node, id);
        }
      });
      return result;
    }

    return null;
  }

  if (Array.isArray(node)) {
    let rs = {};
    node.forEach(e => {
      const temp = getNodeById(e, id);
      if (temp != null) {
        rs = temp;
      }
    });
    return getAllChild(rs);
  } else return getAllChild(getNodeById(node, id));
}

function _findChildrenWithKeyword(keyword, parent) {
  let newChilds = [];
  let array = parent.children;
  if (array) {
    for (let i = 0; i < array.length; i++) {
      const _item = {...array[i]};
      if (_item.isFolder) {
        if (_item.children && _item.children.length > 0) {
          newChilds.push(_item);
          _item.children = _findChildrenWithKeyword(keyword, _item);
        }
      } else {
        if (
          _item.title == null ||
          _item.title == '' ||
          !_item.title.toLowerCase().includes(keyword)
        ) {
          continue;
        }
        newChilds.push(_item);
      }
    }
  }
  return newChilds;
}

function _isGroupEmpty(item) {
  if (item.children && item.children.length > 0) {
    for (let i = 0; i < item.children.length; i++) {
      const child = item.children[i];
      if (child.isFolder) {
        if (!_isGroupEmpty(child)) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  return true;
}

function _filterGroup(array, expandList) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    const child = {...array[i]};
    if (child.isFolder) {
      if (!_isGroupEmpty(child)) {
        expandList.push(child.id);
        result.push(child);
        child.children = _filterGroup(child.children, expandList);
      }
    } else {
      result.push(child);
    }
  }
  return result;
}

export function buildTreeWithKeyword(keyword, array) {
  let searchTree = [];
  for (let i = 0; i < array.length; i++) {
    const _item = {...array[i]};
    if (_item.isFolder) {
      if (_item.children && _item.children.length > 0) {
        searchTree.push(_item);
        _item.children = _findChildrenWithKeyword(keyword, _item);
      }
    } else {
      if (
        _item.title == null ||
        _item.title == '' ||
        !_item.title.toLowerCase().includes(keyword)
      ) {
        continue;
      }
      searchTree.push(_item);
    }
  }

  let expandList = [];
  let treeSearch = _filterGroup(searchTree, expandList);

  return {treeSearch: treeSearch, expandList: expandList};
}
