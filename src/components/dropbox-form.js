import React, { useState, useEffect } from 'react';
import { Button, Form, Icon } from 'semantic-ui-react';
import { isUserValid } from './utils/dropbox-utils';
export const DropBoxForm = ({ formData, handleFieldChange, dropboxValidated, setDropboxValidated }) => {

    const [url, setUrl] = useState(`https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=${process.env.REACT_APP_DP_APPKEY}&redirect_uri=${window.location.origin}/`);
    const validate = () => {
        isUserValid(formData.dropboxAccessKey).then(setDropboxValidated);
    }
    const getParams = () => {
        let query = window.location.hash.split('&').reduce((prev, curr) => { prev[curr.split('=')[0]] = curr.split('=')[1]; return prev; }, [])
        return query
    };

    useEffect(() => {
        const value = getParams().access_token;
        if (value) {
            handleFieldChange(null, { name: "dropboxAccessKey", value });
            isUserValid(value).then(setDropboxValidated);
        }
    }, [])

    return (
        <Form className='validate-box'>
            <Button
                as={'a'}
                href={url}
                onClick={() => validate()}>
                Validate Dropbox account
            </Button> <Icon className='approve-icon' name={dropboxValidated ? 'check' : 'x'} color={dropboxValidated ? 'green' : 'red'} />

        </Form>
    )
}