import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useStore } from '@leaa/dashboard/stores';

export default (props: RouteComponentProps) => {
  const store = useStore();

  store.mapping.abcMapping = ['aaaaaaa'];

  return (
    <div>
      <h1>SHOW SHOW</h1>
      <hr />
      <Link to="/show/9">SHOW 9</Link>
      <hr />
      <Link to="/user-permissions/9">user-permissions 9</Link>

      <h2>STORE</h2>
      <hr />
      <div>{JSON.stringify(store)}</div>

      <h2>PROPS</h2>
      <hr />
      <div>{JSON.stringify(props.match)}</div>
    </div>
  );
};
