import React from 'react';
import OauthPopup from 'react-oauth-popup';
import { Button, Form, Icon } from 'semantic-ui-react';
import { isUserValid } from './utils/dropbox-utils';

export const DropBoxForm = ({ formData, handleFieldChange, dropboxValidated, setDropboxValidated }) => {

    const validate = () => {
        isUserValid(formData.dropboxAccessKey).then(setDropboxValidated);
        alert(JSON.stringify(process.env));
    }

    return (
        <Form>
            <OauthPopup
                url={`https://www.dropbox.com/oauth2/authorize?client_id=${process.env.REACT_APP_DP_APPKEY}&response_type=code&response_type=code`}
                onCode={(help, me) => console.log(help, me)}
                onClose={() => console.log('closed')}
            >
                <Form.Button fluid label={"Copy-Paste access key from pop-up"}>Dropbopx Login</Form.Button>
            </OauthPopup>
            <Form.Input
                required={formData.dropboxAccessKey===''}
                id="dropbox-user-access-key-id"
                name="dropboxAccessKey"
                label='Access Key'
                placeholder="12345ABCDEFG/B123232"
                value={formData.dropboxAccessKey}
                type="password"
                onChange={handleFieldChange}
            />
            <Button
                onClick={() => validate()}>
                Validate Dropbox accounts
            </Button> <Icon className='approve-icon' name={dropboxValidated ? 'check' : 'x'} color={dropboxValidated ? 'green' : 'red'} />

        </Form>
    )
}