import React from 'react';
import {useStyles} from './styles';

export default function ListUserSelected(props) {
  const {source} = props;
  const classes = useStyles();
  return (
    <div style={{width: '100%', height: '100%'}}>
      {
        source && source.length > 0 && <ul className={classes.listUsers}>
          {
            source.map((e, index) => {
              if (e.isFolder) return null;
              return <li key={`node-${index}`} className={classes.itemUser}>
                {(e.title && e.title.length > 0) ? e.title : 'unknown'}
              </li>
            })
          }
        </ul>
      }
    </div>
  );
}
