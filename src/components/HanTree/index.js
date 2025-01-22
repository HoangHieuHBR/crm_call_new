import React, { useState, useEffect } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Checkbox, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { isArray } from 'lodash';
import { getOnChange, buildTreeWithKeyword } from './ultils';
import HanInputSearch from '../HanInputSearch';
import CustomTreeNode from './CustomTreeNode';
import ListUserSelected from './ListUserSelected';
import FolderIcon from '@material-ui/icons/Folder';
import PersonIcon from '@material-ui/icons/Person';
import clsx from 'clsx';
import 'simplebar';
import { useStyles } from './styles';
import { useTranslation } from 'react-i18next';

export default function HanTree({ onChange }) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const sourceTreeAll = useSelector(state => state.staff.userTree);
  const [sourceTree, setSourceTree] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [expandedList, setExpandedList] = useState([]);

  useEffect(() => {
    setSourceTree([...sourceTreeAll]);
  }, [sourceTreeAll]);

  useEffect(() => {
    if (searchKeyword == null) {
      return;
    }

    if (searchKeyword == '') {
      setSourceTree([...sourceTreeAll]);
      setExpandedList([]);
    } else {
      const result = buildTreeWithKeyword(searchKeyword, [...sourceTreeAll]);
      setExpandedList(result.expandList);
      setSourceTree(result.treeSearch);
    }
  }, [searchKeyword]);

  useEffect(() => {
    if (sourceTree && isArray(sourceTree) && sourceTree.length > 0) {
      setData(sourceTree);
    } else {
      setData([]);
    }
  }, [sourceTree]);

  useEffect(() => {
    if (onChange) {
      const userOnlySelected = selected.filter(item => !item.isFolder);
      onChange(userOnlySelected);
    }
  }, [selected]);
  const renderTree = nodes => {
    if (isArray(nodes)) return nodes.map(e => renderNode(e));
    return renderNode(nodes);
  };
  const renderNode = nodes => (
    <CustomTreeNode
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <div style={{ display: 'flex' }}>
          <Checkbox
            checked={selected.some(item => item.id === nodes.id)}
            onChange={event =>
              setSelected(
                getOnChange(data, selected, event.currentTarget.checked, nodes)
              )
            }
            onClick={e => e.stopPropagation()}
          />
          <div className={classes.nodeTree}>
            {nodes.isFolder ? <FolderIcon /> : <PersonIcon />}
            <span className={classes.titleNode}> {nodes.title}</span>
          </div>
        </div>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map(node => renderTree(node))
        : null}
    </CustomTreeNode>
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className={classes.sectionSearch}>
        <HanInputSearch
          onClear={() => {
            setSearchKeyword('');
          }}
          onEnter={value => {
            setSearchKeyword(value);
          }}
        />
      </div>
      <div data-simplebar className={classes.sectionTree}>
        <TreeView
          expanded={expandedList}
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeToggle={(e, nodeIds) => {
            setExpandedList(nodeIds);
          }}
        >
          {renderTree(data)}
        </TreeView>
      </div>
      <div
        data-simplebar
        className={clsx(classes.sectionTree, classes.sectionListSelected)}
      >
        <Typography style={{ padding: 5 }}>{t('Assigned')}</Typography>
        <ListUserSelected source={selected} />
      </div>
    </div>
  );
}
