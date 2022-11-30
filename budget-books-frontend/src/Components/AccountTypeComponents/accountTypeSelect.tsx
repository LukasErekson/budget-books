import React, { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import Select from 'react-select';
import {
  selectAccountTypeByGroups,
  selectAccountTypeNames,
  selectAccountTypes,
} from './accountTypeSelectors';
import { fetchAccountTypes } from './accountTypeThunks';

function AccountTypeSelector(props: {
  setCategory: Function;
  category: Number;
  setInputCategory: Function;
  inputCategory: string;
  fetchAccountTypes: Function;
}): JSX.Element {
  let options: any[] = useSelector((state: any) =>
    selectAccountTypeByGroups(state)
  );

  const accountTypes: any[] = useSelector((state: any) =>
    selectAccountTypes(state)
  );
  const accountTypeNames = useSelector((state: any) =>
    selectAccountTypeNames(state)
  );

  useEffect(() => {
    if (Object.keys(options).length === 0) {
      props.fetchAccountTypes('all');
    } else props.setCategory(options[0].options[0]);
  }, [options]);

  return (
    <Select
      name={'accountType'}
      options={options.concat({
        label: `Create new category: ${props.inputCategory}`,
        value: -1,
      })}
      onInputChange={(newValue: string) => props.setInputCategory(newValue)}
      value={props.category}
      onChange={(newCategory: any) => {
        // Allow for a new category.
        if (newCategory.value === -1) {
          newCategory.label = newCategory.label.slice(21);
          if (newCategory.label === '') {
            return;
          }
          if (accountTypeNames.includes(newCategory.label)) {
            const matchingAccountType: any = accountTypes.filter(
              (accountTypeObject: any) =>
                accountTypeObject.name === newCategory.label
            )[0];
            props.setCategory({
              label: matchingAccountType.name,
              value: matchingAccountType.id,
            });
            return;
          }
        }
        props.setCategory(newCategory);
      }}
    />
  );
}

const mapDipsatchToProps = (dispatch: Function) => {
  return {
    fetchAccountTypes: (group: string) => dispatch(fetchAccountTypes(group)),
  };
};

export default connect(null, mapDipsatchToProps)(AccountTypeSelector);
