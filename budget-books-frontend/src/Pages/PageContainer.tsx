import React from 'react';
import { connect } from 'react-redux';
import CategorizeTransactionsPage from './CategorizeTransactionsPage';

function PageContainer(props: any) {
  return (
    <>
      <CategorizeTransactionsPage />
    </>
  );
}

const mapStateToProps = (state: any) => {
  return {};
};

const mapDipsatchToProps = (dispatch: Function) => {
  return {};
};

export default connect(mapStateToProps, mapDipsatchToProps)(PageContainer);
