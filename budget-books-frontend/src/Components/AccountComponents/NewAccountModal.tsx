import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { connect } from 'react-redux';
import { fetchAccountTypes } from '../AccountTypeComponents/accountTypeThunks';
import {
    selectAccountTypes,
    selectAccountTypeByGroups,
} from '../AccountTypeComponents/accountTypeSelectors';

function NewAccountModal(props: {
    isOpen: boolean;
    onRequestClose: any;
    fetchAccountTypes: Function;
    selectAccountTypes: any[];
    selectAccountTypeByGroups: any;
}): JSX.Element {
    const [category, setCategory]: [any, Function] = useState({});
    const [inputCategory, setInputCategory]: [string, Function] = useState('');

    const options: any[] = props.selectAccountTypeByGroups;

    console.log(category);

    useEffect(() => {
        if (Object.keys(options).length === 0) {
            props.fetchAccountTypes('all');
        }
    }, [options, props]);

    return (
        <>
            <Modal
                isOpen={props.isOpen}
                onRequestClose={props.onRequestClose}
                appElement={document.getElementById('root') || undefined}
            >
                <h1>Add New Account</h1>
                <label htmlFor='accountType'>Category:</label>
                <Select
                    name={'accountType'}
                    options={options.concat({
                        label: `Create new category: ${inputCategory}`,
                        value: -1,
                    })}
                    onInputChange={(newValue: string) =>
                        setInputCategory(newValue)
                    }
                    value={category}
                    onChange={(newCategory: any) => {
                        // Allow for a new category.
                        if (newCategory.value === -1) {
                            newCategory.label = newCategory.label.slice(21);
                            if (newCategory.label === '') {
                                return;
                            }
                        }
                        setCategory(newCategory);
                    }}
                />
            </Modal>
        </>
    );
}

const mapStateToProps = (state: any) => {
    return {
        selectAccountTypes: selectAccountTypes(state),
        selectAccountTypeByGroups: selectAccountTypeByGroups(state),
    };
};

const mapDipsatchToProps = (dispatch: Function) => {
    return {
        fetchAccountTypes: (group: string) =>
            dispatch(fetchAccountTypes(group)),
    };
};

export default connect(mapStateToProps, mapDipsatchToProps)(NewAccountModal);
