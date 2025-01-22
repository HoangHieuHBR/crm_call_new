import registerPromiseWorker from 'promise-worker/register';
registerPromiseWorker(message => {
  if (message.type === 'getTreeOrg') {
    let data = message.data;
    if (data && data.length > 0) {
      if (data[0].id) {
        return data;
      }
    }
    return renderIdTree(data);
  }

  if (message.type === 'getTreeCached') {
    let msgData = message.data;
    let data = msgData.data;
    let userCached = msgData.userCached;
    if (data && data.length > 0 && userCached && userCached.length > 0) {
      if (data[0].id) {
        return userCached;
      }
    }
    let mapUser = {};
    let mapGroup = {};
    findAllUser(mapUser, mapGroup, data);
    return { mapUser, mapGroup };
  }
});

export function renderIdTree(array) {
  let id = 1;
  return array.map((_item, index) => {
    id = id + index;
    _item.id = `${id}`;
    if (_item.children && _item.children.length > 0) {
      _item.children = renderIdTreeChild(_item.id, _item.children);
    }
    return _item;
  });
}

function renderIdTreeChild(parentId, array) {
  return array.map((_item, index) => {
    _item.id = `${parentId}-${index + 1}`;
    if (_item.children && _item.children.length > 0) {
      _item.children = renderIdTreeChild(_item.id, _item.children);
    }
    return _item;
  });
}

function findAllUser(mapUser, mapGroup, array) {
  array.forEach(_item => {
    if (_item.children && _item.children.length > 0) {
      if (_item.group_id) {
        mapGroup[_item.group_id] = _item;
      }
      findAllUser(mapUser, mapGroup, _item.children);
    } else {
      if (_item.user_no) {
        mapUser[_item.user_no] = _item;
      }
    }
  });
}
